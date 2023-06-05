const {CartModel} = require("../DAO/models/carts.model.js");

class CartService{

    async createOne(){
        const cartCreated = await CartModel.create({});
        return cartCreated;
    }

    async get(cartId){
        const cart = await CartModel.findById(cartId).populate('products.product');
        if(!cart){
            throw new Error('Cart not found');
        }
        return cart;
    }

    async addToCart(cartId, productId, quantity = 1){
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        
        const existingProduct = cart.products.find((product) => product.product.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        return cart;
    }
}

module.exports = CartService;