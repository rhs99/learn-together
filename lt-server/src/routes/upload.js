const express = require('express');
const multer = require('multer');
const { extractAndVerifyToken } = require('../common/middlewares');
const Utils = require('../common/utils');

const router = express.Router();

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Utils.uuid() + '.webp');
    },
});

const upload = multer({ storage: storage });

router.post('/', extractAndVerifyToken, upload.array('files', 1), (req, res) => {
    if (!req.files || req.files.length !== 1) {
        return res.status(400).json({ msg: 'Upload a single file' });
    }

    const cb = (err, result) => {
        if (err) {
            res.status(400).json({ msg: err.message });
        } else {
            res.status(200).json(result);
        }
    };

    const file = req.files[0];
    Utils.uploadFile(file.path, file.filename, cb);
});

module.exports = router;
