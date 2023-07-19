const ViewsService = require('../services/views.service.js');
const viewsService = new ViewsService();

class ViewsController {
    async getHome(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            const queryParams = { limit, page, sort, query };
            const products = await viewsService.getHome(queryParams);
            return res.status(200).render('home', { products });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: 'error', msg: 'Error in server', products: {} });
        }
    }

    async getRealTimeProducts(req, res) {
        try {
            const products = await viewsService.getRealTimeProducts();
            return res.status(200).render('realTimeProducts', { products });
        } catch (error) {
            return res.status(500).json({ status: 'error', msg: 'Error in server', products: {} });
        }
    }

    async getProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            const queryParams = { limit, page, sort, query };
            const products = await viewsService.getProducts(queryParams);
            return res.render('products', products);
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Error in server' });
        }
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
        res.render('login');
    }
}

module.exports = ViewsController;