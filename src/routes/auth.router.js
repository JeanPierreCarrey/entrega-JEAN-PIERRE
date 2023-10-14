const express = require('express');
const authRouter = express.Router();
const { isUser, isAdmin, roles } = require("../middlewares/auth.js");
const passport = require('passport');
const authController = require('../controllers/auth.controller.js');
const { ROLES } = require('../utils/constants.js');

authRouter.get('/login/github', authController.renderGitHubLogin);
authRouter.get('/githubcallback', authController.handleGitHubCallback);
authRouter.get('/session', authController.renderSessionView);
authRouter.get('/login', authController.renderLoginView);
authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), authController.handleLogin);
authRouter.get('/faillogin', authController.renderFailLoginView);
authRouter.get('/register', authController.renderRegisterView);
authRouter.post('/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }), authController.handleRegister);
authRouter.get('/failregister', authController.renderFailRegisterView);
authRouter.get('/products', authController.renderProductsView);
authRouter.get('/profile', isUser, authController.renderProfileView);
authRouter.get('/logout', authController.handleLogout);
authRouter.get('/administration', isUser, isAdmin, authController.renderAdministrationView);
authRouter.get('/recoverPassword', authController.recoverPassword);
authRouter.post('/checkEmail', authController.checkEmail);
authRouter.get('/resetPassword', authController.resetPassword);
authRouter.post('/resetPasswordComplete', authController.resetPasswordComplete);
authRouter.get('/', authController.getAllUsers);
authRouter.delete('/', authController.deleteInactiveUsers);
authRouter.get('/roleManager', authController.roleManager);

module.exports = authRouter;