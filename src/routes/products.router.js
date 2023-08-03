const express = require('express');
const productsRouter = express.Router();
const ProductsController = require('../controllers/products.controller.js');
const productsController = new ProductsController();
const { isAdmin } = require('../middlewares/auth.js');

productsRouter.get('/', productsController.getAllProducts);
productsRouter.get('/:pid', productsController.getProductById);
productsRouter.post('/', isAdmin, productsController.createProduct);
productsRouter.put('/:id', isAdmin, productsController.updateProduct);
productsRouter.delete('/:id', isAdmin, productsController.deleteProduct);

module.exports = productsRouter;