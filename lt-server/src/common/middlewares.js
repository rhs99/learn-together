const Util = require('./utils');

const extractAndVerifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    let user = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        try {
            const data = Util.verityToken(token);
            user = data._id;
        } catch (error) {
            console.log(error.message);
        }
    }
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(401).json();
    }
};

module.exports = { extractAndVerifyToken };
