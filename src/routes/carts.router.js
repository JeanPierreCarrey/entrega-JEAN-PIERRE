const express = require('express');
const cartsRouter = express.Router();
const CartsController = require('../controllers/carts.controller.js');
const cartsController = new CartsController();

cartsRouter.post('/', cartsController.createCart);
cartsRouter.get('/:cid', cartsController.getCart);
cartsRouter.post('/:cid/product/:pid', cartsController.addProductToCart);
cartsRouter.delete('/:cid/products/:pid', cartsController.removeProductFromCart);
cartsRouter.put('/:cid', cartsController.updateCart);
cartsRouter.put('/:cid/products/:pid', cartsController.updateProductQuantity);
cartsRouter.delete('/:cid', cartsController.clearCart);

module.exports = cartsRouter;

module.exports = cartsRouter;