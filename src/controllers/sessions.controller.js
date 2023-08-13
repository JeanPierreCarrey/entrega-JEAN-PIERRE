const passport = require('passport');
const UserDTO = require("../DAO/DTO/user.dto");
const logger = require("../utils/logger.js");

const renderGitHubLogin = (req, res) => {
    return passport.authenticate('github', { scope: ['user:email'] })(req, res);
};

const handleGitHubCallback = (req, res, next) => {
    passport.authenticate('github', { failureRedirect: '/login' })(req, res, (err) => {
        if (err) {
            logger.error('Error in auth GitHub callback:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.redirect('/');
    });
};

const renderSessionView = (req, res) => {
    return res.send(JSON.stringify(req.session));
};

const getCurrentUser = (req, res) => {
    const user = new UserDTO(req.session);
    return res.status(200).json({ user });
};

module.exports = {
    renderGitHubLogin,
    handleGitHubCallback,
    renderSessionView,
    getCurrentUser,
};
