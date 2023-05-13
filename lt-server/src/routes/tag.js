const express = require('express');
const router = express.Router();

const TagController = require('../controllers/tag');

router.get('/list', TagController.getAllTags);
router.post('/create', TagController.addNewTag);
router.delete('/_id', TagController.softDeleteTag);

module.exports = router;
