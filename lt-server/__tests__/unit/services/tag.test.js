const mongoose = require('mongoose');
const Tag = require('../../../src/models/tag');
const TagService = require('../../../src/services/tag');
const { cacheService } = require('../../../src/services/cache');

describe('Tag Service Tests', () => {
    const chapterId = new mongoose.Types.ObjectId().toString();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('addNewTag', () => {
        it('should add a new tag when it does not exist', async () => {
            const tagData = {
                name: 'javascript',
                chapter: chapterId,
            };

            const findOneMock = jest.spyOn(Tag, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null),
            }));

            const saveSpy = jest.spyOn(Tag.prototype, 'save').mockImplementation(function () {
                this._id = new mongoose.Types.ObjectId();
                return Promise.resolve(this);
            });

            const result = await TagService.addNewTag(tagData);

            expect(findOneMock).toHaveBeenCalledWith({ name: 'Javascript', chapter: chapterId });
            expect(saveSpy).toHaveBeenCalled();
            expect(cacheService.del).toHaveBeenCalledWith(`tags:chapter:${chapterId}`);
            expect(result._id).toBeDefined();
            expect(result.name).toBe('Javascript');
            expect(result.chapter.toString()).toBe(chapterId);

            findOneMock.mockRestore();
            saveSpy.mockRestore();
        });

        it('should return existing tag when it already exists', async () => {
            const existingTag = {
                _id: new mongoose.Types.ObjectId(),
                name: 'Javascript',
                chapter: chapterId,
            };

            const tagData = {
                name: 'javascript',
                chapter: chapterId,
            };

            const findOneMock = jest.spyOn(Tag, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(existingTag),
            }));

            const result = await TagService.addNewTag(tagData);

            expect(findOneMock).toHaveBeenCalledWith({ name: 'Javascript', chapter: chapterId });
            expect(cacheService.del).not.toHaveBeenCalled(); 
            expect(result).toBe(existingTag);

            findOneMock.mockRestore();
        });
    });

    describe('getAllTags', () => {
        it('should return tags from cache if available', async () => {
            const cachedTags = [
                { _id: new mongoose.Types.ObjectId(), name: 'Javascript', chapter: chapterId },
                { _id: new mongoose.Types.ObjectId(), name: 'React', chapter: chapterId },
            ];

            cacheService.get.mockResolvedValue(cachedTags);

            const result = await TagService.getAllTags(chapterId);

            expect(cacheService.get).toHaveBeenCalledWith(`tags:chapter:${chapterId}`);
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(Tag);
            expect(result[1]).toBeInstanceOf(Tag);
        });

        it('should fetch tags from database and cache them when not in cache', async () => {
            const dbTags = [
                new Tag({ _id: new mongoose.Types.ObjectId(), name: 'Javascript', chapter: chapterId }),
                new Tag({ _id: new mongoose.Types.ObjectId(), name: 'React', chapter: chapterId }),
            ];

            cacheService.get.mockResolvedValue(null);

            const findMock = jest.spyOn(Tag, 'find').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(dbTags),
            }));

            dbTags.forEach((tag) => {
                tag.toObject = jest.fn().mockReturnValue({
                    _id: tag._id,
                    name: tag.name,
                    chapter: tag.chapter,
                });
            });

            const result = await TagService.getAllTags(chapterId);

            expect(cacheService.get).toHaveBeenCalledWith(`tags:chapter:${chapterId}`);
            expect(findMock).toHaveBeenCalledWith({ chapter: chapterId });
            expect(cacheService.set).toHaveBeenCalledWith(
                `tags:chapter:${chapterId}`,
                dbTags.map((t) => t.toObject()),
                900,
            );
            expect(result).toBe(dbTags);

            findMock.mockRestore();
        });
    });
});
