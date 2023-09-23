const passport = require('passport');
const { UserModel } = require("../DAO/mongo/models/users.model.js");
const {CustomError} = require("../services/errors/custom-error.js");
const EErros = require("../services/errors/enums.js");
const logger = require("../utils/logger.js");
const CodeService = require("../services/code.service.js");
const codeService = new CodeService();
const {createHash} = require('../utils/utils.js');

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
        throw CustomError.createError({
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
    return res.redirect('/api/products');
};

const renderFailLoginView = async (req, res) => {
    return res.json({ error: 'fail to login' });
};

const renderRegisterView = (req, res) => {
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
    const user = { email: req.session.email, isAdmin: req.session.isAdmin };
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

const renderAdministrationView = (req, res) => {
    return res.send('Data');
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
    const { uid } = req.params;
    const { files } = req;

    const user = await UserModel.findById(uid);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const documents = [];

    for (const file of files) {
        documents.push({
            name: file.originalname,
            reference: `/uploads/${file.filename}`,
            status: 'uploaded'
        });
    }

    user.documents = documents;
    await user.save();
    return res.status(200).json({ message: 'Documents uploaded successfully.' });
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
    renderAdministrationView,
    recoverPassword,
    checkEmail,
    resetPassword,
    resetPasswordComplete,
    uploadDocuments,
};