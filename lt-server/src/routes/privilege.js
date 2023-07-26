const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');

const PrivilegeController = require('../controllers/privilege');

router.get('/', PrivilegeController.getPrivileges);
router.post('/', extractAndVerifyToken, hasAdminPrivilege, PrivilegeController.addNewPrivilege);

module.exports = router;
