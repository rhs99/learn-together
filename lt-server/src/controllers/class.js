const ClassService = require('../services/class');

const getClass = async (req, res) => {
    try {
        const _class = await ClassService.getClass(req.params.id);
        res.status(200).json(_class);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

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

module.exports = { getClasses, addNewClass, getClass };
