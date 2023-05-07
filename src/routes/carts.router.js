const express = require('express');
const cartsRouter = express.Router();
const {v4: uuidv4} = require('uuid');
let carts = require("../../carts.json");

cartsRouter.post('/', (req, res) => {
    try {
        const newCart = {
            id: uuidv4(),
            products: [],
        };
        carts.push(newCart);
        require('fs').writeFileSync('./carts.json', JSON.stringify(carts))
        res.status(201).json(newCart)
    }catch(err){
        res.status(500).json({message: 'Internal Server Error'});
    }
});

cartsRouter.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    const cart = carts.find((cart) => cart.id === cartId);
    if (!cart) {
        return res.status(404).json({message: 'Cart not found'});
    }else{
        res.status(200).json(cart.products);
    }
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    const cart = carts.find((cart) => cart.id === cartId);
    if (!cart) {
        return res.status(404).json({message: 'Cart not found'});
    }

    const existingProduct = cart.products.find((product) => product.id === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    }else{
        cart.products.push({id: productId, quantity});
    }

    require('fs').writeFileSync('./carts.json', JSON.stringify(carts));
    res.status(200).json(cart);
});

module.exports = cartsRouter;