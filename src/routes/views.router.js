const express = require('express');
const viewsRouter = express.Router();
const ViewsController = require('../controllers/views.controller.js');
const { isLoggedIn } = require('../middlewares/auth.js');
const viewsController = new ViewsController();

viewsRouter.get('/', isLoggedIn, viewsController.getHome);
viewsRouter.get('/realtimeproducts', isLoggedIn, viewsController.getRealTimeProducts);
viewsRouter.get('/products', isLoggedIn, viewsController.getProducts);
viewsRouter.get('/products/:pid', isLoggedIn, viewsController.getProduct);
viewsRouter.get('/carts/:cid', isLoggedIn, viewsController.getCart);
viewsRouter.get('/login', viewsController.getLogin);
viewsRouter.get('/loggerTest', viewsController.loggerTest);

module.exports = viewsRouter;