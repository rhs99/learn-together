const express = require('express');
const { extractAndVerifyToken } = require('../common/middlewares');
const Utils = require('../common/utils');

const router = express.Router();

router.post('/presigned-url', extractAndVerifyToken, (req, res) => {
    const data = req.body;

    const cb = (err, url) => {
        if (err) {
            return res.status(400).json();
        } else {
            return res.status(200).json({ uploadUrl: url });
        }
    };

    Utils.getPresignedUrl(data.fileName, cb);
});

module.exports = router;
