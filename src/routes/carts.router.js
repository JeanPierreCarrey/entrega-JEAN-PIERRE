const express = require('express');
const cartsRouter = express.Router();

const CartService = require('../services/carts.service.js');
const service = new CartService();

cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await service.createOne();
        res.status(201).json(newCart);
    }catch (error){
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try{
        const cart = await service.get(req.params.cid)
        res.status(200).json(cart);
    }catch (error){
        res.status(404).json({message: error.message})
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try{
        const cart = await service.addToCart(req.params.cid, req.params.pid, req.body.quantity);
        res.status(200).json(cart);
    }catch (error){
        res.status(404).json({error: error.message})
    }
});

module.exports = cartsRouter;