const express = require('express');
const usersRoleRouter = express.Router();
const usersRoleController = require('../controllers/usersRole.controller.js');
const authController = require('../controllers/auth.controller.js');
const upload = require('../middlewares/multer');

usersRoleRouter.put('/premium/:uid', usersRoleController.toggleUserRole);
usersRoleRouter.post('/:uid/documents', upload.array('documents'), authController.uploadDocuments);

module.exports = usersRoleRouter;