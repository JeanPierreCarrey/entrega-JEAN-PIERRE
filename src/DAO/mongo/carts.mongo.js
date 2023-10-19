const {CartModel} = require("./models/carts.model.js");

class CartMongo {
    async createCart(cartData){
        const cart = await CartModel.create(cartData);
        return cart;
    };

    async getCart(cartId){
        const cart = await CartModel.findById(cartId).populate('products.product');
        return cart;
    }

    async updateCart(cartId, updatedCartData){
        const cart = await CartModel.findByIdAndUpdate(cartId, updatedCartData);
        return cart;
    }
};

module.exports = CartMongo;