const express = require('express');
const { extractAndVerifyToken } = require('../common/middlewares');
const Utils = require('../common/utils');

const router = express.Router();

router.post('/presigned-url', extractAndVerifyToken, (req, res) => {
    const data = {
        fileName: req.body.fileName,
        userId: req.user,
    };

    const cb = (err, info) => {
        if (err) {
            return res.status(400).json();
        } else {
            return res.status(200).json(info);
        }
    };

    Utils.getPresignedUrl(data, cb);
});

module.exports = router;
