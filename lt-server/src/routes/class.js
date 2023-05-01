const express = require('express');
const router = express.Router();

const ClassController = require('../controllers/class');

router.get('/list', ClassController.getClasses);
router.post('/create', ClassController.addNewClass);

module.exports = router;
