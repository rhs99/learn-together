const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Config = require('../config');
const logger = require('../config/logger');

const privateKey = Config.SECRET_KEY;

const supabase = createClient(Config.SUPABASE_URL, Config.SUPABASE_SERVICE_ROLE_KEY);

const createToken = (data) => {
    const token = jwt.sign(data, privateKey);
    return token;
};

const createTokenForPassword = (data) => {
    const token = jwt.sign(data, privateKey, { expiresIn: '60m' });
    return token;
};

const verityToken = (token) => {
    const data = jwt.verify(token, privateKey);
    return data;
};

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: Config.ADMIN_EMAIL_HOST,
            port: Config.ADMIN_EMAIL_PORT,
            service: Config.ADMIN_EMAIL_SERVICE,
            secure: true,
            auth: {
                user: Config.ADMIN_EMAIL,
                pass: Config.ADMIN_EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: Config.ADMIN_EMAIL,
            to: email,
            subject: subject,
            text: text,
        });

        logger.info('Email sent sucessfully');
    } catch (error) {
        logger.error('Error sending email', { error });
    }
};

const getFileUrl = (fileName) => {
    const { data } = supabase.storage.from(Config.SUPABASE_STORAGE_BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
};

const getPresignedUrl = async (data, cb) => {
    const key = data.userId + '/' + uuid() + data.fileName;

    try {
        const { data: uploadData, error } = await supabase.storage
            .from(Config.SUPABASE_STORAGE_BUCKET)
            .createSignedUploadUrl(key);

        if (error) {
            return cb(error);
        }

        cb(null, { uploadUrl: uploadData.signedUrl, key });
    } catch (err) {
        cb(err);
    }
};

const deleteFile = async (fileNames) => {
    if (fileNames.length === 0) {
        return;
    }

    try {
        const { error } = await supabase.storage.from(Config.SUPABASE_STORAGE_BUCKET).remove(fileNames);

        if (error) {
            logger.error('Error deleting file from storage', { error });
        }
    } catch (err) {
        logger.error('Error deleting file from storage', { error: err });
    }
};

const uuid = () => {
    return uuidv4();
};

const formatTagName = (name) => {
    const newName = name.charAt(0).toUpperCase() + name.slice(1);
    return newName.trim().split(/\s+/).join('-');
};

module.exports = {
    createToken,
    createTokenForPassword,
    verityToken,
    sendEmail,
    getFileUrl,
    deleteFile,
    uuid,
    getPresignedUrl,
    formatTagName,
};
