const express = require('express');
const productsRouter = express.Router();

const ProductService = require('../services/products.service.js');
const service = new ProductService();

productsRouter.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await service.get(limit);
        return res.status(200).json({
            status: "success",
            msg: "listado de productos",
            data: products,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await service.get(pid);
        return res.status(200).json({
            status: "success",
            msg: "producto",
            data: product,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});


productsRouter.post("/", async (req, res) => {
    try {
        const {title, description, price, thumbnail, code, stock} = req.body;
        const productCreated = await service.createOne(title, description, price, thumbnail, code, stock);
        return res.status(201).json({
            status: "success",
            msg: "product created",
            data: productCreated,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});

productsRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, thumbnail, code, stock } = req.body;
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("validation error: please complete all fields.");
            return res.status(400).json({
                status: "error",
                msg: "validation error: please complete all fields.",
                data: {},
            });
        }

    const productUpdated = await service.updateOne(id, title, description, price, thumbnail, code, stock);
    return res.status(200).json({
        status: "success",
        msg: "product updated",
        data: productUpdated,
    });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});

productsRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const productDeleted = await service.deleteOne(id);
        return res.status(200).json({
            status: "success",
            msg: "product deleted",
            data: {},
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});

module.exports = productsRouter;