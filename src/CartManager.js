const fs = require("fs");
const {v4: uuidv4} = require('uuid');

class CartManager{
    constructor() {
        this.carts = [];
    }

    async createCart() {
        const newCart = {
            id: uuidv4(),
            products: [],
        };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCart(cartId) {
        const cart = this.carts.find((cart) => cart.id === cartId);
        if (!cart) {
            throw new Error ("Cart not found")
        }else{
            return cart;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCart(cartId);
        const productIndex = cart.products.findIndex((product) => product.product === productId);
        if (productIndex === -1) {
            cart.products.push({product: productId, quantity});
        }else{
            cart.products[productIndex].quantity += quantity;
        }
        await this.saveCarts();
        return cart;
    }

    async saveCarts() {
        try{
            await fs.promises.writeFile("../carts.json", JSON.stringify({carts: this.carts}));
        }catch (error){
            console.error("Error saving carts:", error)
        }
    }
}

module.exports = CartManager;