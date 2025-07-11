const mongoose = require('mongoose');
const Tag = require('../../../src/models/tag');
const { formatTagName } = require('../../../src/common/utils');

// Mock the formatTagName function
jest.mock('../../../src/common/utils', () => ({
  formatTagName: jest.fn(name => {
    let newName = name.charAt(0).toUpperCase() + name.slice(1);
    return newName.trim().split(/\s+/).join('-');
  })
}));

describe('Tag Model Tests', () => {
  const chapterId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    formatTagName.mockClear();
  });

  it('should create a new tag successfully', async () => {
    const tagData = {
      name: 'javascript',
      chapter: chapterId
    };

    const tag = new Tag(tagData);
    const savedTag = await tag.save();

    // Check that formatTagName was called during the save process
    expect(formatTagName).toHaveBeenCalledWith('javascript');
    
    // Verify the saved tag
    expect(savedTag._id).toBeDefined();
    expect(savedTag.name).toBe('Javascript');
    expect(savedTag.chapter.toString()).toBe(chapterId.toString());
  });

  it('should format multi-word tag names with hyphens', async () => {
    const tagData = {
      name: 'react hooks',
      chapter: chapterId
    };

    const tag = new Tag(tagData);
    const savedTag = await tag.save();

    expect(formatTagName).toHaveBeenCalledWith('react hooks');
    expect(savedTag.name).toBe('React-hooks');
  });

  it('should not allow duplicate tags for the same chapter', async () => {
    const tagData = {
      name: 'python',
      chapter: chapterId
    };

    // Create first tag
    await new Tag(tagData).save();
    
    // Try to create duplicate tag
    try {
      await new Tag(tagData).save();
      // If we reach here, the test has failed
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('MongoServerError');
      expect(error.code).toBe(11000); // Duplicate key error
    }
  });

  it('should allow same tag name for different chapters', async () => {
    const anotherChapterId = new mongoose.Types.ObjectId();
    
    const tagData1 = {
      name: 'algorithms',
      chapter: chapterId
    };
    
    const tagData2 = {
      name: 'algorithms',
      chapter: anotherChapterId
    };

    const tag1 = await new Tag(tagData1).save();
    const tag2 = await new Tag(tagData2).save();

    expect(tag1._id).toBeDefined();
    expect(tag2._id).toBeDefined();
    expect(tag1._id.toString()).not.toBe(tag2._id.toString());
  });

  it('should require name and chapter fields', async () => {
    const invalidTag = new Tag({});
    
    try {
      await invalidTag.save();
      // If we reach here, the test has failed
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors.name).toBeDefined();
      expect(error.errors.chapter).toBeDefined();
    }
  });
});
