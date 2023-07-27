const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');

const ClassController = require('../controllers/class');

router.get('/', ClassController.getClasses);
router.get('/:_id', ClassController.getClass);
router.post('/', extractAndVerifyToken, hasAdminPrivilege, ClassController.addNewClass);

module.exports = router;
