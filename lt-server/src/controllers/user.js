const { sendEmail } = require('../common/utils');
const Util = require('../common/utils');
const Config = require('../config');
const UserService = require('../services/user');
const logger = require('../config/logger');

const getUser = async (req, res) => {
    logger.debug('Getting user profile', { userName: req.params.userName });
    const user = await UserService.getUser(req.params.userName);
    res.status(200).json(user);
};

const getNotifictions = async (req, res) => {
    logger.debug('Getting user notifications', { userName: req.params.userName });
    const notifications = await UserService.getNotifications(req.params.userName);
    res.status(200).json(notifications);
};

const removeNotification = async (req, res) => {
    logger.info('Removing notification', { userName: req.params.userName, notificationId: req.params.id });
    await UserService.removeNotification(req.params.userName, req.params.id);
    res.status(200).json();
};

const addNewUser = async (req, res) => {
    logger.info('Creating new user account', { userName: req.body.userName, email: req.body.email });
    await UserService.addNewUser(req.body);
    res.status(201).json();
};

const logInUser = async (req, res) => {
    logger.info('User login attempt', { userName: req.body.userName });
    const user = await UserService.logInUser(req.body);
    if (!user) {
        logger.warn('Login failed for user', { userName: req.body.userName });
        throw new Error('Login failed!');
    }
    logger.auth('User logged in successfully', user._id, { userName: user.userName });

    const token = Util.createToken({ _id: user._id });
    res.status(200).json({ token, class: user.class });
};

const updateClassInUser = async (req, res) => {
    logger.business('User class update', { userId: req.user, newClassId: req.body.classId });
    await UserService.updateClassInUser(req.body, req.user);
    logger.info('User class updated successfully', { userId: req.user });
    res.status(200).json();
};

const updatePasswordInUser = async (req, res) => {
    logger.auth('User password update attempt', req.user);
    await UserService.updatePasswordInUser(req.body, req.user);
    logger.auth('User password updated successfully', req.user);
    res.status(200).json();
};

const updatePrivilege = async (req, res) => {
    logger.business('User privilege update', {
        targetUserId: req.body.userId,
        newPrivilegeId: req.body.privilegeId,
    });
    await UserService.updatePrivilege(req.body);
    logger.info('User privilege updated successfully', {
        targetUserId: req.body.userId,
    });
    res.status(200).json();
};

const forgotPassword = async (req, res) => {
    logger.auth('Password reset request', null, { email: req.body.email });
    const user = await UserService.forgotPassword(req.body);
    if (!user) {
        logger.warn('Password reset failed - user not found', { email: req.body.email });
        throw new Error('User not found!');
    }

    const token = Util.createTokenForPassword({ _id: user._id, email: user.email });
    const resetLink = `${Config.LT_HOST}/users/reset-password/${user._id}/${token}`;
    sendEmail(user.email, 'Reset password', resetLink);

    logger.auth('Password reset email sent', user._id, { email: user.email });
    res.status(200).json({ token, userId: user._id });
};

const resetPassword = async (req, res) => {
    logger.auth('Password reset completion', req.body.userId);
    await UserService.resetPassword(req.body);
    logger.auth('Password reset completed successfully', req.body.userId);
    res.status(200).json();
};

module.exports = {
    getUser,
    addNewUser,
    logInUser,
    updateClassInUser,
    updatePasswordInUser,
    updatePrivilege,
    getNotifictions,
    removeNotification,
    forgotPassword,
    resetPassword,
};
