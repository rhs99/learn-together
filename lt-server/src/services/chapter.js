const Chapter = require('../models/chapter');

const getChapters = async () => {
  try {
    const chapters = await Chapter.find();
    return chapters;
  } catch (e) {
    console.log(e.message);
  }
};

const addNewChapter = async (body) => {
  try {
    const newChapter = new Chapter(body);
    await newChapter.save();
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = { getChapters, addNewChapter };
