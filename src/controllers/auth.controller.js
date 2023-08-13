const { UserModel } = require("../DAO/mongo/models/users.model.js");
const {CustomError} = require("../services/errors/custom-error.js");
const EErros = require("../services/errors/enums.js");
const logger = require("../utils/logger.js");

const renderSessionView = (req, res) => {
    return res.send(JSON.stringify(req.session));
};

const renderLoginView = (req, res) => {
    return res.render("login", {});
};

const handleLogin = (req, res) => {
    if (!req.user) {
        CustomError.createError({
            name: 'fields missing or incorrect',
            cause: 'there was an error in one of the methods',
            message: 'validation error: please complete or correct all fields.',
            code: EErros.VALIDATION_ERROR,
        });
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

const handleLogout = (req, res) => {
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

module.exports = {
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
};