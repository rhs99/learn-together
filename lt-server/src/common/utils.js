const Minio = require('minio');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Config = require('../config');
const fs = require('fs');
const sharp = require('sharp');

const privateKey = process.env.SECRET_KEY;

const minioClient = new Minio.Client({
    endPoint: Config.MINIO_HOST,
    port: Config.MINIO_PORT,
    useSSL: false,
    accessKey: '',
    secretKey: '',
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
            host: 'smtp.gmail.com',
            port: 465,
            service: 'gmail',
            secure: true,
            auth: {
                user: 'learntogether3009@gmail.com',
                pass: 'owavaxkroqemknvc',
            },
        });

        await transporter.sendMail({
            from: 'learntogether3009@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });

        console.log('email sent sucessfully');
    } catch (error) {
        console.log(error, 'email not sent');
    }
};

const uploadFile = async (filePath, fileName, cb) => {
    const metaData = {
        'Content-Type': 'application/octet-stream',
    };

    try {
        const fileStream = await sharp(filePath).resize({ width: 600 }).webp({ minSize: true, loop: 1 }).toBuffer();
        minioClient.putObject(Config.MINIO_BUCKET, fileName, fileStream, metaData, (err, etag) => {
            fs.unlinkSync(filePath);
            if (err) {
                cb(err, null);
            }
            cb(null, { fileName: fileName });
        });
    } catch (err) {
        cb(err, null);
    }
};

const getFileUrl = (fileName) => {
    return `http://${Config.MINIO_HOST}:${Config.MINIO_PORT}/${Config.MINIO_BUCKET}/${fileName}`;
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

module.exports = {
    createToken,
    createTokenForPassword,
    verityToken,
    sendEmail,
    uploadFile,
    getFileUrl,
    deleteFile,
    uuid,
};
