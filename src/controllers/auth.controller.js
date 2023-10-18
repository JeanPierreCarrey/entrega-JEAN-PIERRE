const passport = require('passport');
const { UserModel } = require("../DAO/mongo/models/users.model.js");
const {CustomError} = require("../services/errors/custom-error.js");
const EErros = require("../services/errors/enums.js");
const logger = require("../utils/logger.js");
const CodeService = require("../services/code.service.js");
const codeService = new CodeService();
const AuthService = require("../services/auth.service.js");
const authService = new AuthService();
const {createHash} = require('../utils/utils.js');
const { ROLES } = require('../utils/constants.js');

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

const renderLoginView = (req, res) => {
    return res.render("login", {});
};

const handleLogin = async (req, res) => {
    if (!req.user) {
        CustomError.createError({
            name: 'fields missing or incorrect',
            cause: 'there was an error in one of the methods',
            message: 'validation error: please complete or correct all fields.',
            code: EErros.VALIDATION_ERROR,
        });
    }
    const user = await UserModel.findById(req.user._id);
    if (user) {
        user.last_connection = new Date();
        await user.save();
    }
    req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, age: req.user.age, role: req.user.role };
    return res.redirect('/');
};

const renderFailLoginView = async (req, res) => {
    return res.json({ error: 'fail to login' });
};

const renderRegisterView = (req, res) => {
    if(req.session.user) {
        res.redirect('/');
        return
    }
    return res.render("register", {});
};

const handleRegister = (req, res) => {
    if (!req.user) {
            CustomError.createError({
                name: 'Controller message error',
                cause: 'there was an error in one of the methods',
                message: 'something went wrong :(',
                code: EErros.INTERNAL_SERVER_ERROR,
            });
    }
    req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, age: req.user.age, isAdmin: req.user.isAdmin };
    return res.json({ msg: 'ok', payload: req.user });
};

const renderFailRegisterView = async (req, res) => {
    return res.json({ error: 'fail to register' });
};

const renderProductsView = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.session.email });
        if (user) {
            const userData = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                age: user.age,
                cartID: user.cartID,
                role: user.role,
            };
            logger.debug('Rendering products view with user data:', userData);
            return res.render('products', { user: userData });
        } else {
            logger.debug('Rendering products view with no user data');
            return res.render('products', { user: null });
        }
    } catch (error) {
        logger.error('Error retrieving user data:', error);
        return res.render('products', { user: null, error: 'Error retrieving user data' });
    }
};

const renderProfileView = (req, res) => {
    const user = { email: req.session.user.email, isAdmin: req.session.user.role === ROLES.ADMIN ? 'SI': 'NO', _id: String(req.session.user._id) };
    return res.render('profile', { user: user });
};

const handleLogout = async (req, res) => {
    const user = await UserModel.findById(req.session.user._id);
    if (user) {
        user.last_connection = new Date();
        await user.save();
    };

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).render('error', { error: 'session couldnt be closed' });
        }
        return res.redirect('/auth/login');
    });
};

const recoverPassword = (req, res) => {
    res.render('recoverPassword');
};

const checkEmail = async (req, res) => {
    const {email} = req.body;
    await codeService.generateCode(email);
    res.render('checkEmail');
};

const resetPassword = async (req, res) => {
    const {email, code} = req.query;
    const isValidCode = await codeService.findCode(email, code);
    if (isValidCode) {
        res.render('resetPassword', { email, code });
    } else {
        res.render('error');
    }
};

const resetPasswordComplete = async (req, res) => {
    const { password, email } = req.body;
    const passwordHash = createHash(password)
    const updatedUser = await codeService.updateUser(email, passwordHash);
    res.redirect('/auth/login')
}

const uploadDocuments = async (req, res) => {
    try {
        const { uid } = req.params;
        const { files } = req;

        const response = await authService.uploadDocuments(uid, files);
        return res.status(200).json({ message: 'ok' });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, 'name email role');
        res.status(200).json({ users });
    } catch (error) {
        CustomError.createError({
            name: 'Controller message error',
            cause: 'there was an error in one of the methods',
            message: 'something went wrong :(',
            code: EErros.INTERNAL_SERVER_ERROR,
        });
    }
};

const deleteInactiveUsers = async (req, res) => {
    try {
        const result = await authService.deleteInactiveUsers();
        res.status(200).json({ message: 'Inactive users deleted and notifications sent.', result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete inactive users.', error: error.message });
    }
}

const roleManager = async (req, res) => {
    try {
        const user = req.session.user;
        if(user.role !== ROLES.ADMIN) {
            res.render('permissionDenied')
            return
        }
        let users = await UserModel.find({}, 'name email role').lean();
        users = users.filter(user => user.role !== ROLES.ADMIN)
        res.render('roleManager', { users });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    renderGitHubLogin,
    handleGitHubCallback,
    renderSessionView,
    renderLoginView,
    handleLogin,
    renderFailLoginView,
    renderRegisterView,
    handleRegister,
    renderFailRegisterView,
    renderProductsView,
    renderProfileView,
    handleLogout,
    recoverPassword,
    checkEmail,
    resetPassword,
    resetPasswordComplete,
    uploadDocuments,
    getAllUsers,
    deleteInactiveUsers,
    roleManager,
};