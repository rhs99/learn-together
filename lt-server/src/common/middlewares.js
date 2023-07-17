const Util = require('./utils');
const User = require('../models/user');

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

const hasAdminPrivilege = async (req, res, next) => {
    const userId = req.user;
    let isAdmin = false;

    if (userId) {
        const user = await User.findById(userId).populate('privileges').exec();
        if (user) {
            user.privileges.forEach((privilege) => {
                if (privilege.name === 'admin') {
                    isAdmin = true;
                }
            });
        }
    }

    console.log(isAdmin);

    if (isAdmin) {
        next();
    } else {
        res.status(401).json();
    }
};

module.exports = { extractAndVerifyToken, hasAdminPrivilege };
