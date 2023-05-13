const express = require('express');
const cartsRouter = express.Router();
const CartManager = require ("../CartManager")
const cartManager = new CartManager();

cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    }catch (error){
    res.status(500).json({message: "Internal Server Error"});
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try{
        const cart = await cartManager.getCart(req.params.cid)
        res.status(200).json(cart);
    }catch (error){
        res.status(404).json({message: error.message})
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try{
        const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid, req.body.quantity);
        res.status(200).json(cart);
    }catch (error){
        res.status(404).json({error: error.message})
    }
});

module.exports = cartsRouter;