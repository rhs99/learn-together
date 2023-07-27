const express = require('express');
const router = express.Router();

const TagController = require('../controllers/tag');

router.get('/', TagController.getAllTags);
router.post('/', TagController.addNewTag);

module.exports = router;
