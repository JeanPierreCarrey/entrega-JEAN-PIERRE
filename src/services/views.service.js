const { ProductMongo } = require('../DAO/mongo/products.mongo');
const ProductService = require('../services/products.service.js');
const productService = new ProductService();
const CartService = require('../services/carts.service.js');
const cartService = new CartService();

class ViewsService {
    async getHome(queryParams) {
        try {
            const products = await productService.getAllProducts(queryParams);
            return products;
        } catch (error) {
            console.error(error);
            throw new Error('Error in server');
        }
    }

    async getRealTimeProducts() {
        try {
            const products = await productService.getAllProducts();
            return products;
        } catch (error) {
            throw new Error('Error in server');
        }
    }

    async getProducts(queryParams) {
        try {
            const {
                payload: products,
                totalPages,
                prevPage,
                nextPage,
                page: currentPage,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink,
            } = await productService.getAllProducts(queryParams);
            let productsSimplified = products.map((item) => ({
                _id: item._id.toString(),
                title: item.title,
                description: item.description,
                price: item.price,
                thumbnail: item.thumbnail,
                code: item.code,
                stock: item.stock,
                category: item.category,
            }));
            return {
                products: productsSimplified,
                totalPages,
                prevPage,
                nextPage,
                currentPage,
                hasPrevPage,
                hasNextPage,
                prevLink: prevLink?.substring(4) || '',
                nextLink: nextLink?.substring(4) || '',
            };
        } catch (error) {
            throw new Error('Error in server');
        }
    }

    async getProduct(pid) {
        try {
            const product = await ProductMongo.getProduct(pid);
            const productSimplified = {
                _id: product._id.toString(),
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock,
                category: product.category,
            };
            return productSimplified;
        } catch (error) {
            throw error;
        }
    }

    async getCart(cid) {
        try {
            const cart = await cartService.getCart(cid);
            const simplifiedCart = cart.products.map((item) => ({
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
            }));
            return simplifiedCart;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ViewsService;