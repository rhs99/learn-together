const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');
const { validate } = require('../common/validation');
const { getClassSchema, getClassesSchema, createClassSchema } = require('../validations/class');

const ClassController = require('../controllers/class');

router.get('/', validate(getClassesSchema), ClassController.getClasses);
router.get('/:_id', validate(getClassSchema), ClassController.getClass);
router.post('/', extractAndVerifyToken, hasAdminPrivilege, validate(createClassSchema), ClassController.addNewClass);

module.exports = router;
