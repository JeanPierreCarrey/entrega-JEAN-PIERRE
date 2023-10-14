const express = require('express');
const usersRoleRouter = express.Router();
const UsersRoleController = require('../controllers/usersRole.controller.js');
const usersRoleController = new UsersRoleController();
const authController = require('../controllers/auth.controller.js');
const upload = require('../middlewares/multer');

usersRoleRouter.put('/premium/:uid', usersRoleController.toggleUserRole);
usersRoleRouter.post('/:uid/documents', upload.fields([{name: 'identification', maxCount: 1}, {name: 'address', maxCount: 1}, {name: 'stateaccount', maxCount: 1}]), authController.uploadDocuments);

module.exports = usersRoleRouter;