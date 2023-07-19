const express = require('express');
const passport = require('passport');
const sessionsRouter = express.Router();
const sessionsController = require('../controllers/sessions.controller');

sessionsRouter.get('/login/github', sessionsController.renderGitHubLogin);
sessionsRouter.get('/githubcallback', sessionsController.handleGitHubCallback);
sessionsRouter.get('/show', sessionsController.renderSessionView);
sessionsRouter.get('/current', sessionsController.getCurrentUser);

module.exports = sessionsRouter;
