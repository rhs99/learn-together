const Subject = require('../models/subject');

const getSubjects = async () => {
  try {
    const subjects = await Subject.find();
    return subjects;
  } catch (e) {
    console.log(e.message);
  }
};

const addNewSubject = async (body) => {
  try {
    const newSubject = new Subject(body);
    await newSubject.save();
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = { getSubjects, addNewSubject };
