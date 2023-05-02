const express = require('express');
const router = express.Router();

const PrivilegeController = require('../controllers/privilege');

router.get('/list', PrivilegeController.getPrivileges);
router.post('/create', PrivilegeController.addNewPrivilege);
router.put('/softDelete', PrivilegeController.softDeletePrivilege);

module.exports = router;
