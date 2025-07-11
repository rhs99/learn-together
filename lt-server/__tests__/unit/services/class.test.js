const mongoose = require('mongoose');
const Class = require('../../../src/models/class');
const ClassService = require('../../../src/services/class');
const { cacheService } = require('../../../src/services/cache');

describe('Class Service Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getClass', () => {
        it('should return a class from cache if available', async () => {
            const classId = new mongoose.Types.ObjectId().toString();
            const cachedClass = { 
                _id: classId, 
                name: 'Grade 10',
                subjects: [] 
            };

            cacheService.get.mockResolvedValue(cachedClass);

            const result = await ClassService.getClass(classId);

            expect(cacheService.get).toHaveBeenCalledWith(`class:${classId}`);
            expect(result).toBeInstanceOf(Class);
            expect(result._id.toString()).toBe(classId);
            expect(result.name).toBe('Grade 10');
        });

        it('should fetch class from database if not in cache', async () => {
            const classId = new mongoose.Types.ObjectId();
            const classData = { 
                _id: classId,
                name: 'Grade 11',
                subjects: [],
                toObject: jest.fn().mockReturnValue({ 
                    _id: classId, 
                    name: 'Grade 11', 
                    subjects: [] 
                })
            };

            cacheService.get.mockResolvedValue(null);
            
            const findByIdMock = jest.spyOn(Class, 'findById').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(classData)
            }));

            const result = await ClassService.getClass(classId);

            expect(cacheService.get).toHaveBeenCalledWith(`class:${classId}`);
            expect(cacheService.set).toHaveBeenCalledWith(`class:${classId}`, classData.toObject(), 1800);
            expect(result).toBe(classData);

            findByIdMock.mockRestore();
        });
    });

    describe('getClasses', () => {
        it('should return classes from cache if available', async () => {
            const cachedClasses = [
                { _id: new mongoose.Types.ObjectId(), name: 'Grade 10' },
                { _id: new mongoose.Types.ObjectId(), name: 'Grade 11' }
            ];

            cacheService.get.mockResolvedValue(cachedClasses);

            const result = await ClassService.getClasses();

            expect(cacheService.get).toHaveBeenCalledWith('classes');
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(Class);
            expect(result[1]).toBeInstanceOf(Class);
        });

        it('should fetch classes from database if not in cache', async () => {
            const classes = [
                { _id: new mongoose.Types.ObjectId(), name: 'Grade 10', toObject: () => ({ _id: 'id1', name: 'Grade 10' }) },
                { _id: new mongoose.Types.ObjectId(), name: 'Grade 11', toObject: () => ({ _id: 'id2', name: 'Grade 11' }) }
            ];

            cacheService.get.mockResolvedValue(null);
            
            const findMock = jest.spyOn(Class, 'find').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(classes)
            }));

            const result = await ClassService.getClasses();

            expect(cacheService.get).toHaveBeenCalledWith('classes');
            expect(cacheService.set).toHaveBeenCalledWith('classes', [{ _id: 'id1', name: 'Grade 10' }, { _id: 'id2', name: 'Grade 11' }], 600);
            expect(result).toBe(classes);

            findMock.mockRestore();
        });
    });

    describe('addNewClass', () => {
        it('should save a new class and invalidate cache', async () => {
            const classData = { name: 'Grade 12' };
            const newClassId = new mongoose.Types.ObjectId();

            const saveSpy = jest.spyOn(Class.prototype, 'save').mockImplementation(function() {
                this._id = newClassId;
                return Promise.resolve(this);
            });

            await ClassService.addNewClass(classData);

            expect(saveSpy).toHaveBeenCalled();
            expect(cacheService.del).toHaveBeenCalledWith('classes');
            expect(cacheService.del).toHaveBeenCalledWith(`class:${newClassId}`);

            saveSpy.mockRestore();
        });
    });
});
