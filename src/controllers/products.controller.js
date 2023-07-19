const ProductService = require('../services/products.service.js');
const productService = new ProductService();

class ProductsController {
    async getAllProducts(req, res) {
        try {
            const queryParams = req.query;
            const response = await productService.get(queryParams);
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong :(',
                data: {},
            });
        }
    }

    async getProductById(req, res) {
        try {
            const { pid } = req.params;
            const product = await productService.get(pid);
            return res.status(200).json({
                status: 'success',
                msg: 'producto',
                data: product,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong :(',
                data: {},
            });
        }
    }
    
    async createProduct(req, res) {
        try {
            const { title, description, price, thumbnail, code, stock, category } = req.body;
            const productCreated = await productService.createOne(title, description, price, thumbnail, code, stock, category);
            return res.status(201).json({
                status: 'success',
                msg: 'product created',
                data: productCreated,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong :(',
                data: {},
            });
        }
    }
    
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { title, description, price, thumbnail, code, stock, category } = req.body;
            if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                console.log('validation error: please complete all fields.');
                return res.status(400).json({
                    status: 'error',
                msg: 'validation error: please complete all fields.',
                data: {},
                });
            }
    
            const productUpdated = await productService.updateOne(id, title, description, price, thumbnail, code, stock, category);
            return res.status(200).json({
                status: 'success',
                msg: 'product updated',
                data: productUpdated,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong :(',
                data: {},
            });
        }
    }
    
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const productDeleted = await productService.deleteOne(id);
            return res.status(200).json({
                status: 'success',
                msg: 'product deleted',
                data: {},
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong :(',
                data: {},
            });
        }
    }
}

module.exports = ProductsController;