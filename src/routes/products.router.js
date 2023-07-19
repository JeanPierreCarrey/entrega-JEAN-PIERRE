const express = require('express');
const productsRouter = express.Router();
const ProductsController = require('../controllers/products.controller.js');
const productsController = new ProductsController();

productsRouter.get('/', productsController.getAllProducts);
productsRouter.get('/:pid', productsController.getProductById);
productsRouter.post('/', productsController.createProduct);
productsRouter.put('/:id', productsController.updateProduct);
productsRouter.delete('/:id', productsController.deleteProduct);

module.exports = productsRouter;