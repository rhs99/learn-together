const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');

const PrivilegeController = require('../controllers/privilege');

router.get('/list', PrivilegeController.getPrivileges);
router.post('/create', extractAndVerifyToken, hasAdminPrivilege, PrivilegeController.addNewPrivilege);

module.exports = router;
