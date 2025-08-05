const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');
const { validate } = require('../common/validation');
const {
    getUserSchema,
    getNotificationsSchema,
    removeNotificationSchema,
    addNewUserSchema,
    logInUserSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    updateClassInUserSchema,
    updatePasswordInUserSchema,
    updatePrivilegeSchema,
} = require('../validations/user');

const UserController = require('../controllers/user');

router.get('/:userName', validate(getUserSchema), UserController.getUser);
router.get('/:userName/notifications', validate(getNotificationsSchema), UserController.getNotifictions);
router.delete('/:userName/notifications/:id', validate(removeNotificationSchema), UserController.removeNotification);
router.post('/', validate(addNewUserSchema), UserController.addNewUser);
router.post('/login', validate(logInUserSchema), UserController.logInUser);
router.post('/forgot-password', validate(forgotPasswordSchema), UserController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), UserController.resetPassword);
router.post(
    '/update-class',
    extractAndVerifyToken,
    validate(updateClassInUserSchema),
    UserController.updateClassInUser,
);
router.post(
    '/update-password',
    extractAndVerifyToken,
    validate(updatePasswordInUserSchema),
    UserController.updatePasswordInUser,
);
router.post(
    '/update-privilege',
    extractAndVerifyToken,
    hasAdminPrivilege,
    validate(updatePrivilegeSchema),
    UserController.updatePrivilege,
);

module.exports = router;
