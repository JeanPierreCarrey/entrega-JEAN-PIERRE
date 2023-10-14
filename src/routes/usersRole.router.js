const express = require('express');
const usersRoleRouter = express.Router();
const UsersController = require('../controllers/usersRole.controller.js');
const usersController = new UsersController();
const authController = require('../controllers/auth.controller.js');
const upload = require('../middlewares/multer');

usersRoleRouter.put('/premium/:uid', usersController.toggleUserRole);
usersRoleRouter.delete('/:uid', usersController.deleteUser);
usersRoleRouter.post('/:uid/documents', upload.fields([{name: 'identification', maxCount: 1}, {name: 'address', maxCount: 1}, {name: 'stateaccount', maxCount: 1}]), authController.uploadDocuments);

module.exports = usersRoleRouter;