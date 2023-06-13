const express = require('express');
const viewsRouter = express.Router();
const ProductService = require('../services/products.service.js');
const productService = new ProductService();
const CartService = require('../services/carts.service.js');
const cartService = new CartService();

viewsRouter.get('/', async (req, res) => {
    try{
        const { limit = 10, page = 1, sort, query } = req.query;
        const queryParams = { limit, page, sort, query };
        const products = await productService.get(queryParams);
        console.log(products); //BORRAR
        return res.status(200).render('home', {products});
    }catch(err){
        console.error(err);
        return res.status(500).json({status: "error", msg: "Error in server", products:{}})
    }
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
    try{
        const products = await productService.get();
        return res.status(200).render('realTimeProducts', {products});
    }catch(err){
        return res.status(500).json({status: "error", msg: "Error in server", products:{}})
    }
});

viewsRouter.get('/products', async (req, res) => {
    try {
        const {limit = 10, page = 1, sort, query} = req.query;
        const queryParams = {limit, page, sort, query};
        
        const {payload: products, totalPages} = await productService.get(queryParams);
        return res.render('products', { products, totalPages });
    } catch (error) {
        return res.status(500).json({status: 'error', message: 'Error in server'});
    }
});

viewsRouter.get('/carts/:cid', async (req, res, next) => {
    try {
        const {cid} = req.params;
        const cart = await cartService.get(cid);
        res.render('cart', {cart});
    } catch (error) {
        next(error);
    }
});

module.exports = viewsRouter;