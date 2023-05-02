const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

router.get('/', UserController.getUser);
router.post('/create', UserController.addNewUser);
router.post('/login', UserController.logInUser);

module.exports = router;
