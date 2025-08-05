const mongoose = require('mongoose');
const Subject = require('../../../src/models/subject');
const Class = require('../../../src/models/class');
const { cacheService } = require('../../../src/services/cache');
const SubjectService = require('../../../src/services/subject');

describe('Subject Service Tests', () => {
    describe('getSubject', () => {
        it('should return a subject from cache if available', async () => {
            const subjectId = new mongoose.Types.ObjectId().toString();
            const cachedSubject = {
                _id: subjectId,
                name: 'Mathematics',
                class: new mongoose.Types.ObjectId(),
                chapters: [],
            };

            cacheService.get.mockResolvedValue(cachedSubject);

            const result = await SubjectService.getSubject(subjectId);

            expect(cacheService.get).toHaveBeenCalledWith(`subject:${subjectId}`);
            expect(result).toBeInstanceOf(Subject);
            expect(result._id.toString()).toBe(subjectId);
            expect(result.name).toBe('Mathematics');
        });

        it('should fetch subject from database if not in cache', async () => {
            const subjectId = new mongoose.Types.ObjectId();
            const classId = new mongoose.Types.ObjectId();
            const subjectData = {
                _id: subjectId,
                name: 'Physics',
                class: { _id: classId, name: 'Grade 10' },
                chapters: [],
                toObject: jest.fn().mockReturnValue({
                    _id: subjectId,
                    name: 'Physics',
                    class: { _id: classId, name: 'Grade 10' },
                    chapters: [],
                }),
            };

            cacheService.get.mockResolvedValue(null);

            const findByIdMock = jest.spyOn(Subject, 'findById').mockImplementation(() => ({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(subjectData),
            }));

            const result = await SubjectService.getSubject(subjectId);

            expect(cacheService.get).toHaveBeenCalledWith(`subject:${subjectId}`);
            expect(findByIdMock).toHaveBeenCalledWith(subjectId);
            expect(cacheService.set).toHaveBeenCalledWith(`subject:${subjectId}`, subjectData.toObject(), 1800);
            expect(result).toBe(subjectData);

            findByIdMock.mockRestore();
        });
    });

    describe('getSubjectBreadcrumb', () => {
        it('should return breadcrumb from cache if available', async () => {
            const subjectId = new mongoose.Types.ObjectId().toString();
            const cachedBreadcrumb = [
                { name: 'Grade 10', url: '/classes/classid' },
                { name: 'Mathematics', url: '#' },
            ];

            cacheService.get.mockResolvedValue(cachedBreadcrumb);

            const result = await SubjectService.getSubjectBreadcrumb(subjectId);

            expect(cacheService.get).toHaveBeenCalledWith(`subject:breadcrumb:${subjectId}`);
            expect(result).toEqual(cachedBreadcrumb);
        });

        it('should build breadcrumb from subject data if not in cache', async () => {
            const subjectId = new mongoose.Types.ObjectId();
            const classId = new mongoose.Types.ObjectId();
            const subjectData = {
                _id: subjectId,
                name: 'Chemistry',
                class: { _id: classId, name: 'Grade 11' },
                chapters: [],
                toObject: jest.fn().mockReturnValue({
                    _id: subjectId,
                    name: 'Chemistry',
                    class: { _id: classId, name: 'Grade 11' },
                    chapters: [],
                }),
            };

            // First call is for breadcrumb cache, second call is for subject cache in getSubject
            cacheService.get
                .mockResolvedValueOnce(null) // breadcrumb cache miss
                .mockResolvedValueOnce(null); // subject cache miss

            const findByIdMock = jest.spyOn(Subject, 'findById').mockImplementation(() => ({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(subjectData),
            }));

            const expectedBreadcrumb = [
                { name: 'Grade 11', url: `/classes/${classId}` },
                { name: 'Chemistry', url: '#' },
            ];

            const result = await SubjectService.getSubjectBreadcrumb(subjectId);

            expect(cacheService.get).toHaveBeenCalledWith(`subject:breadcrumb:${subjectId}`);
            expect(cacheService.set).toHaveBeenCalledWith(`subject:breadcrumb:${subjectId}`, expectedBreadcrumb, 3600);
            expect(result).toEqual(expectedBreadcrumb);

            findByIdMock.mockRestore();
        });

        it('should return empty array if subject not found', async () => {
            const subjectId = new mongoose.Types.ObjectId();

            // Mock breadcrumb cache miss
            cacheService.get.mockResolvedValueOnce(null);

            // Mock getSubject to return null directly (simulating subject not found)
            jest.spyOn(SubjectService, 'getSubject').mockResolvedValueOnce(null);

            const result = await SubjectService.getSubjectBreadcrumb(subjectId);

            expect(result).toEqual([]);

            // Restore the spy
            SubjectService.getSubject.mockRestore();
        });

        it('should return empty array if subject has no class', async () => {
            const subjectId = new mongoose.Types.ObjectId();
            const subjectData = {
                _id: subjectId,
                name: 'Mathematics',
                class: null,
                chapters: [],
                toObject: jest.fn().mockReturnValue({
                    _id: subjectId,
                    name: 'Mathematics',
                    class: null,
                    chapters: [],
                }),
            };

            // First call is for breadcrumb cache, second call is for subject cache in getSubject
            cacheService.get
                .mockResolvedValueOnce(null) // breadcrumb cache miss
                .mockResolvedValueOnce(null); // subject cache miss

            const findByIdMock = jest.spyOn(Subject, 'findById').mockImplementation(() => ({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(subjectData),
            }));

            const result = await SubjectService.getSubjectBreadcrumb(subjectId);

            expect(result).toEqual([]);

            findByIdMock.mockRestore();
        });
    });

    describe('getSubjects', () => {
        it('should return subjects from cache if available', async () => {
            const classId = new mongoose.Types.ObjectId().toString();
            const cachedSubjects = [
                { _id: new mongoose.Types.ObjectId(), name: 'Mathematics', class: classId },
                { _id: new mongoose.Types.ObjectId(), name: 'Physics', class: classId },
            ];

            cacheService.get.mockResolvedValue(cachedSubjects);

            const result = await SubjectService.getSubjects(classId);

            expect(cacheService.get).toHaveBeenCalledWith(`subjects:class:${classId}`);
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(Subject);
            expect(result[1]).toBeInstanceOf(Subject);
        });

        it('should fetch subjects from database if not in cache', async () => {
            const classId = new mongoose.Types.ObjectId();
            const subjects = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    name: 'Biology',
                    class: classId,
                    chapters: [],
                    toObject: () => ({ _id: 'id1', name: 'Biology', class: classId }),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    name: 'Chemistry',
                    class: classId,
                    chapters: [],
                    toObject: () => ({ _id: 'id2', name: 'Chemistry', class: classId }),
                },
            ];

            cacheService.get.mockResolvedValue(null);

            const findMock = jest.spyOn(Subject, 'find').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(subjects),
            }));

            const result = await SubjectService.getSubjects(classId);

            expect(cacheService.get).toHaveBeenCalledWith(`subjects:class:${classId}`);
            expect(findMock).toHaveBeenCalledWith({ class: classId });
            expect(cacheService.set).toHaveBeenCalledWith(
                `subjects:class:${classId}`,
                subjects.map((s) => s.toObject()),
                900,
            );
            expect(result).toBe(subjects);

            findMock.mockRestore();
        });
    });

    describe('addNewSubject', () => {
        it('should create a new subject and update the class', async () => {
            const classId = new mongoose.Types.ObjectId();
            const subjectBody = {
                name: 'Computer Science',
                class: classId,
            };

            const savedSubject = {
                _id: new mongoose.Types.ObjectId(),
                name: 'Computer Science',
                class: classId,
                chapters: [],
            };

            const mockClass = {
                _id: classId,
                name: 'Grade 12',
                subjects: [],
                save: jest.fn().mockResolvedValue(this),
                toObject: jest.fn().mockReturnValue({
                    _id: classId,
                    name: 'Grade 12',
                    subjects: [],
                }),
            };

            // Mock Class model's findById to bypass database query
            jest.spyOn(Class, 'findById').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(mockClass),
            }));

            jest.spyOn(Subject.prototype, 'save').mockResolvedValue(savedSubject);

            const result = await SubjectService.addNewSubject(subjectBody);

            expect(mockClass.subjects).toContain(savedSubject._id);
            expect(mockClass.save).toHaveBeenCalled();
            expect(cacheService.del).toHaveBeenCalledWith(`subjects:class:${classId}`);
            expect(result).toBe(savedSubject);
        });

        it('should handle errors when creating a new subject', async () => {
            const classId = new mongoose.Types.ObjectId();
            const subjectBody = {
                name: 'Invalid Subject',
                class: classId,
            };

            const error = new Error('Validation error');
            jest.spyOn(Subject.prototype, 'save').mockRejectedValue(error);

            await expect(SubjectService.addNewSubject(subjectBody)).rejects.toThrow('Validation error');
        });

        it('should handle errors when updating the class', async () => {
            const classId = new mongoose.Types.ObjectId();
            const subjectBody = {
                name: 'Computer Science',
                class: classId,
            };

            const savedSubject = {
                _id: new mongoose.Types.ObjectId(),
                name: 'Computer Science',
                class: classId,
                chapters: [],
            };

            // Mock Class model's findById to return null (class not found)
            jest.spyOn(Class, 'findById').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null),
            }));

            jest.spyOn(Subject.prototype, 'save').mockResolvedValue(savedSubject);

            await expect(SubjectService.addNewSubject(subjectBody)).rejects.toThrow('Referenced class does not exist');
        });
    });

    describe('cache invalidation', () => {
        it('should properly invalidate cache when adding new subject', async () => {
            const classId = new mongoose.Types.ObjectId();
            const subjectBody = {
                name: 'Art',
                class: classId,
            };

            const savedSubject = {
                _id: new mongoose.Types.ObjectId(),
                name: 'Art',
                class: classId,
                chapters: [],
            };

            const mockClass = {
                _id: classId,
                name: 'Grade 8',
                subjects: [],
                save: jest.fn().mockResolvedValue(this),
                toObject: jest.fn().mockReturnValue({
                    _id: classId,
                    name: 'Grade 8',
                    subjects: [],
                }),
            };

            // Mock Class model's findById to return a valid class
            jest.spyOn(Class, 'findById').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(mockClass),
            }));

            jest.spyOn(Subject.prototype, 'save').mockResolvedValue(savedSubject);

            await SubjectService.addNewSubject(subjectBody);

            expect(cacheService.del).toHaveBeenCalledWith(`subjects:class:${classId}`);
            expect(cacheService.del).toHaveBeenCalledTimes(1);
        });
    });
});
