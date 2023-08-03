const {CartModel} = require("./models/carts.model.js");

class CartMongo {
    async createCart(){
        const cart = await CartModel.create({});
        return cart;
    };

    async getCart(){
        const cart = await CartModel.findById();
        return cart;
    }

    async updateCart(){
        const cart = await CartModel.findByIdAndUpdate();
        return cart;
    }
};

module.exports = CartMongo;