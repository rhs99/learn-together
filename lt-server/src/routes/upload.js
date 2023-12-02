const express = require('express');
const multer = require('multer');
const { extractAndVerifyToken } = require('../common/middlewares');
const Utils = require('../common/utils');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { files: 1 } });

router.post('/', extractAndVerifyToken, upload.array('files', 1), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded.' });
    }

    const file = req.files[0];

    const cb = (err, result) => {
        if (err) {
            res.status(400).json({ msg: err.message });
        } else {
            res.status(200).json(result);
        }
    };
    Utils.uploadFile(file, cb);
});

module.exports = router;
