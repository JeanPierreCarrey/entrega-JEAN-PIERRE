const express = require('express');
const productsRouter = express.Router();
const {v4: uuidv4} = require('uuid');
const {ProductManager} = require("../ProductManager.js");
const productManager = new ProductManager("products.json");

productsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const limit = req.query.limit;
        if (!limit) {
            return res.status(200).json(products);
        }else{
            return res.status(200).json(products.slice(0, limit));
        }
    }catch(err){
        return res.status(500).json({message: "Internal Server Error"})
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const products = await productManager.getProductById(id);
        if (!products) {
            return res.status(404).json("Product not found");
        }else{
            res.status(200).json(products);
        }
    }catch(err){
        return res.status(404).json({message: "Product not found"})
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const {title, description, code, price, stock, category, thumbnail} = req.body;
        const newProduct = {
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnail: thumbnail || []
        };
        //await productManager.addProduct(newProduct);
        const productCreated = await productManager.addProduct(newProduct);
        return res.status(201).json(productCreated);
    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
});

productsRouter.put('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const update = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(productId, update);
        res.status(200).json(updatedProduct);
    }catch(error){
        res.status(400).json({error: "Invalid request: product with the specified id not found"});
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    try{
        const deletedProduct = await productManager.deleteProduct(id);
        res.status(200).json(deletedProduct);
    }catch(err){
        res.status(404).json({error: err.message});
    }
});

module.exports = productsRouter