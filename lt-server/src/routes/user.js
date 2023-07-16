const express = require('express');
const router = express.Router();

const { extractAndVerifyToken } = require('../common/middlewares');

const UserController = require('../controllers/user');

router.get('/', UserController.getUser);
router.post('/create', UserController.addNewUser);
router.post('/login', UserController.logInUser);
router.post('/updateClass', extractAndVerifyToken, UserController.updateClassInUser);
router.post('/updatePassword', extractAndVerifyToken, UserController.updatePasswordInUser);

module.exports = router;
