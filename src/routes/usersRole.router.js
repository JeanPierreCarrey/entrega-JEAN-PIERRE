const express = require('express');
const usersRoleRouter = express.Router();
const usersRoleController = require('../controllers/usersRole.controller.js');

usersRoleRouter.put('/premium/:uid', usersRoleController.toggleUserRole);

module.exports = usersRoleRouter;