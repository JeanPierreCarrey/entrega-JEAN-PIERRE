const express = require('express');
const productsRouter = express.Router();
const ProductsController = require('../controllers/products.controller.js');
const productsController = new ProductsController();
const { isAdmin, isPremium } = require('../middlewares/auth.js');

productsRouter.get('/mockingproducts', productsController.mock);
productsRouter.get('/', productsController.getAllProducts);
productsRouter.get('/:pid', productsController.getProductById);
productsRouter.post('/', isPremium, isAdmin, productsController.createProduct);
productsRouter.put('/:id', isAdmin, productsController.updateProduct);
productsRouter.delete('/:id', isPremium, isAdmin, productsController.deleteProduct);

module.exports = productsRouter;