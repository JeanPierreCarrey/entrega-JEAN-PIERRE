const ViewsService = require('../services/views.service.js');
const viewsService = new ViewsService();
const {CustomError} = require("../services/errors/custom-error.js");
const EErros = require("../services/errors/enums.js");
const logger = require("../utils/logger.js");
const ProductService = require('../services/products.service.js');

class ViewsController {
    async getHome(req, res) {
            const productService = new ProductService();
            const { limit = 10, page = 1, sort, query } = req.query;
            const queryParams = { limit, page, sort, query };
            const products = await productService.getAllProducts(queryParams)
            if (products instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: products,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }
            return res.status(200).render('home', { products: JSON.parse(JSON.stringify(products.payload)) });
    }

    async getRealTimeProducts(req, res) {
            const products = await viewsService.getRealTimeProducts();
            if (products instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: products,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }
            return res.status(200).render('realTimeProducts', { products });
    }

    async getProducts(req, res) {
            const { limit = 10, page = 1, sort, query } = req.query;
            const queryParams = { limit, page, sort, query };
            const products = await viewsService.getProducts(queryParams);
            if (products instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: products,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }
            return res.render('products', products);
    }

    async getProduct(req, res, next) {
        try {
            const { pid } = req.params;
            const product = await viewsService.getProduct(pid);
            res.render('product', { product });
        } catch (error) {
        next(error);
        }
    }

    async getCart(req, res, next) {
        try {
            const { cid } = req.params;
            const cart = await viewsService.getCart(cid);
            res.render('cart', { cart });
        } catch (error) {
            next(error);
        }
    }

    async getLogin(req, res) {
        if(req.session.user) {
            res.render('/')
            return
        }
        res.render('login');
    }

    async loggerTest(req, res) {
        logger.debug('Debug log for testing');
        logger.info('Info log for testing');
        logger.warn('Warning log for testing');
        logger.error('Error log for testing');
        logger.fatal('Fatal log for testing');
    
        res.status(200).json({ message: 'Logs tested successfully' });
    };
};

module.exports = ViewsController;