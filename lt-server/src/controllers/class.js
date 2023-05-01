const ClassService = require('../services/class');

const getClasses = async (req, res) => {
  try {
    const classes = await ClassService.getClasses();
    res.status(200).json(classes);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const addNewClass = async (req, res) => {
  try {
    await ClassService.addNewClass(req.body);
    res.status(201).json();
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = { getClasses, addNewClass };
