const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');

const UserController = require('../controllers/user');

router.get('/:userName', UserController.getUser);
router.get('/:userName/notifications', UserController.getNotifictions);
router.delete('/:userName/notifications/:qId', UserController.removeNotification);
router.post('/', UserController.addNewUser);
router.post('/login', UserController.logInUser);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);
router.post('/update-class', extractAndVerifyToken, UserController.updateClassInUser);
router.post('/update-password', extractAndVerifyToken, UserController.updatePasswordInUser);
router.post('/update-privilege', extractAndVerifyToken, hasAdminPrivilege, UserController.updatePrivilege);

module.exports = router;
