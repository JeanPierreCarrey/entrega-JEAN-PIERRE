const express = require('express');
const productsRouter = express.Router();
const ProductsController = require('../controllers/products.controller.js');
const productsController = new ProductsController();
const { isAdmin } = require('../middlewares/auth.js');

productsRouter.get('/mockingproducts', productsController.mock);
productsRouter.get('/', productsController.getAllProducts);
productsRouter.get('/:pid', productsController.getProductById);
productsRouter.post('/'/* , isPremium, isAdmin */, productsController.createProduct);
productsRouter.put('/:pid', isAdmin, productsController.updateProduct);
productsRouter.delete('/:pid'/* , isAdmin */, productsController.deleteProduct);

module.exports = productsRouter;