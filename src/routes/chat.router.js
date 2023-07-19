const express = require("express");
const chatRouter = express.Router();
const chatController = require("../controllers/chats.controller.js");

chatRouter.get("/", chatController.renderChatView);

module.exports = chatRouter;