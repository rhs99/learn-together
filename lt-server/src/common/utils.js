const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const privateKey = process.env.SECRET_KEY;

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

module.exports = { createToken, createTokenForPassword, verityToken, sendEmail };
