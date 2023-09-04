const express = require('express');
const sessionsRouter = express.Router();
const sessionsController = require('../controllers/sessions.controller');

sessionsRouter.get('/show', sessionsController.renderSessionView);
sessionsRouter.get('/current', sessionsController.getCurrentUser);

module.exports = sessionsRouter;
