const express = require('express');
const { extractAndVerifyToken } = require('../common/middlewares');
const Utils = require('../common/utils');
const logger = require('../config/logger');

const router = express.Router();

router.post('/presigned-url', extractAndVerifyToken, (req, res) => {
    const data = {
        fileName: req.body.fileName,
        userId: req.user,
    };

    logger.business('Presigned URL request', {
        fileName: req.body.fileName,
        userId: req.user,
    });

    const cb = (err, info) => {
        if (err) {
            logger.error('Failed to generate presigned URL', {
                error: err.message,
                fileName: req.body.fileName,
                userId: req.user,
            });
            return res.status(400).json();
        } else {
            logger.info('Presigned URL generated successfully', {
                fileName: req.body.fileName,
                userId: req.user,
            });
            return res.status(200).json(info);
        }
    };

    Utils.getPresignedUrl(data, cb);
});

module.exports = router;
