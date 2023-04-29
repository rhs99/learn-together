import express from 'express';
const router = express.Router();

import PrivilegeController from '../controllers/privilege';

router.get('/list', PrivilegeController.getPrivileges);
router.post('/create', PrivilegeController.addNewPrivilege);

export default router;
