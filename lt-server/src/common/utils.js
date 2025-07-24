const Minio = require('minio');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Config = require('../config');

const privateKey = process.env.SECRET_KEY;

const minioClient = new Minio.Client({
    endPoint: 'play.min.io',
    port: 9000,
    useSSL: true,
    accessKey: 'Q3AM3UQ867SPQQA43P2F',
    secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
});

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
            host: process.env.ADMIN_EMAIL_HOST,
            port: process.env.ADMIN_EMAIL_PORT,
            service: process.env.ADMIN_EMAIL_SERVICE,
            secure: true,
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: subject,
            text: text,
        });

        console.log('Email sent sucessfully');
    } catch (error) {
        console.log(error, 'Error sending email');
    }
};

const getFileUrl = (fileName) => {
    return `https://${Config.MINIO_HOST}:${Config.MINIO_PORT}/${Config.MINIO_BUCKET}/${fileName}`;
};

const getPresignedUrl = (data, cb) => {
    const key = data.userId + '/' + uuid() + data.fileName;
    minioClient.presignedPutObject(Config.MINIO_BUCKET, key, (err, uploadUrl) => {
        if (err) {
            return cb(err);
        }
        cb(null, { uploadUrl, key });
    });
};

const deleteFile = (fileNames) => {
    if (fileNames.length === 0) {
        return;
    }

    minioClient.removeObjects(Config.MINIO_BUCKET, fileNames, (err) => {
        if (err) {
            console.log(err);
        }
    });
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
