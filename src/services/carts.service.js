const CartMongo = require("../DAO/mongo/carts.mongo.js");
const cartMongo = new CartMongo();
const ProductMongo = require("../DAO/mongo/products.mongo.js");
const productMongo = new ProductMongo();
const TicketService = require('./tickets.service.js');
const ticketService = new TicketService();
const CustomError = require("../services/errors/custom-error.js");
const EErros = require("../services/errors/enums.js");

const { v4: uuidv4 } = require('uuid');
function generateUniqueTicketCode() {
    return uuidv4();
}

class CartService{
    async createCart(){
        const cartCreated = await cartMongo.createCart({});
        return cartCreated;
    }

    async getCart(cartId){
        const cart = await cartMongo.getCart(cartId)
        if(!cart){
            CustomError.createError({
                name: '404 not found error',
                cause: cart,
                message: 'Not Found',
                code: EErros.NOT_FOUND_ERROR,
            });
        }
        return cart
    }

    async addProductToCart(cartId, productId, user) {
        try {
            const cart = await cartMongo.getCart(cartId);
            const product = await productMongo.getProduct(productId);

            if (!cart) {
                throw new Error('Cart not found');
            }

            if (!product) {
                throw new Error('Product not found');
            }

            if (user.role === 'premium' && product.owner === user.email) {
                throw new Error('Premium users cannot add their own products to the cart');
            }
            
            cart.products.push({product: product._id, quantity: 1});
            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async updateCart(cartId, products) {
        try {
            const cart = await cartMongo.updateCart(cartId, {products}, {new: true});
            return cart;
        } catch (error) {
            throw new Error('Error updating cart in database');
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await cartMongo.getCart(cartId);
            const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);
            if (productIndex === -1) {
                throw new Error('Product not found in cart');
            }
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error updating product quantity in cart');
        }
    }

    async removeProduct(cartId, productId) {
        try {
            const cart = await cartMongo.getCart(cartId);
            const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);
            if (productIndex === -1) {
                throw new Error('Product not found in cart');
            }
            cart.products.splice(productIndex, 1);
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error removing product from cart');
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await cartMongo.getCart(cartId);
            cart.products = [];
            await cart.save();
        } catch (error) {
            throw new Error('Error clearing cart');
        }
    }

    async checkoutCart(cartId) {
        try {
            const cart = await cartMongo.getCart(cartId).populate('products.product');
            let totalAmount = 0;
            for (const product of cart.products) {
                totalAmount += product.quantity * product.product.price;
            }

            const ticket = await ticketService.createTicket(
                generateUniqueTicketCode(),
                totalAmount,
                cart.user
                );

                cart.products = [];
                await cart.save();
                return ticket;
        } catch (error) {
            throw new Error('Error checking out cart: ' + error.message);
        }
    }

    async processPurchase(cart) {
        const productsNotProcessed = [];
        for (const cartProduct of cart.products) {
            const product = await productMongo.getProduct(cartProduct.productId);
            if (product.stock >= cartProduct.quantity) {
                product.stock -= cartProduct.quantity;
                await product.save();
            } else {
                productsNotProcessed.push(cartProduct.productId);
            }
        }
        return productsNotProcessed;
    }

    calculateTotalAmount(cart) {
        return cart.products.reduce((total, cartProduct) => {
            const product = cartProduct.productId;
            return total + product.price * cartProduct.quantity;
        }, 0);
    }

    async removeProcessedProducts(cart, productsNotProcessed) {
        cart.products = cart.products.filter(
            (cartProduct) => !productsNotProcessed.includes(cartProduct.productId)
        );
        await cart.save();
    }
}

module.exports = CartService;