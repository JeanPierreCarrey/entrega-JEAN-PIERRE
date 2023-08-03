const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ error: 'Access denied. Only admins are allowed.' });
    }
};

const isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') {
        return next();
    } else {
        return res.status(403).json({ error: 'Access denied. Only users are allowed.' });
    }
};

module.exports = {
    isAdmin,
    isUser,
};

/* function isUser(req, res, next) {
    if (req.session?.email) {
        return next();
    }
    return res.status(401).render('error', {error: 'Authentication error'});
};

function isAdmin(req, res, next) {
    if (req.session?.isAdmin) {
        return next();
    }
    return res.status(403).render('error', {error: 'Authorization error'});
};

module.exports = {isUser, isAdmin}; */