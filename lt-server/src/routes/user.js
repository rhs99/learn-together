const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');

const UserController = require('../controllers/user');

router.get('/', UserController.getUser);
router.get('/notifications', UserController.getNotifictions);
router.post('/create', UserController.addNewUser);
router.post('/login', UserController.logInUser);
router.post('/updateClass', extractAndVerifyToken, hasAdminPrivilege, UserController.updateClassInUser);
router.post('/updatePassword', extractAndVerifyToken, hasAdminPrivilege, UserController.updatePasswordInUser);
router.post('/updatePrivilege', extractAndVerifyToken, hasAdminPrivilege, UserController.updatePrivilege);

module.exports = router;
