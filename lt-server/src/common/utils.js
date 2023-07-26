const jwt = require('jsonwebtoken');

const privateKey = '69h441HbITlmUTQJ5atXpJ7Givt1utqjeSf3VrNNUfY=';

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

module.exports = { createToken, createTokenForPassword, verityToken };
