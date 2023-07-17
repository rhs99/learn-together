const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');

const ClassController = require('../controllers/class');

router.get('/:id/name', ClassController.getClass);
router.get('/list', ClassController.getClasses);
router.post('/create', extractAndVerifyToken, hasAdminPrivilege, ClassController.addNewClass);

module.exports = router;
