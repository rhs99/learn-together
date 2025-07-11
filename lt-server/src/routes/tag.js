const express = require('express');
const router = express.Router();

const TagController = require('../controllers/tag');
const { validate } = require('../common/validation');
const { getTagsSchema, createTagSchema } = require('../validations/tag');

router.get('/', validate(getTagsSchema), TagController.getAllTags);
router.post('/', validate(createTagSchema), TagController.addNewTag);

module.exports = router;
