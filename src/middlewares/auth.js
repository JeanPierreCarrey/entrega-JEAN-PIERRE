const { ROLES } = require("../utils/constants");

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === ROLES.ADMIN) {   
        return next();
    } else {
        return res.status(403).json({ error: 'Access denied. Only admins are allowed.' });
    }
};

const isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === ROLES.USER) {
        return next();
    } else {
        return res.status(403).json({ error: 'Access denied. Only users are allowed.' });
    }
};

function isPremium(req, res, next) {
    const user = req.user;
    if (user && user.role === ROLES.PREMIUM) {
        return next();
    }
    return res.status(403).json({ message: 'You do not have permission to perform this action.' });
};

function isLoggedIn(req, res, next) {
    if(!req.session.user) {
        res.redirect('/login');
        return;
    }
    next();
} 

function roles (roles) {
    return (req, res, next) => {
        const user = req.user;
        if(roles.includes(user.role)) {
            return next();
        }
        return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    }
}

module.exports = {
    isAdmin,
    isUser,
    isPremium,
    roles,
    isLoggedIn
};