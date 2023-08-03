const { ProductModel } = require("./models/products.model.js");

class ProductMongo{
    async createProduct(){
        const product = ProductModel.create();
        return product;
    };

    async deleteProduct(){
        const product = ProductModel.deleteOne();
        return product;
    };

    async updateProduct(){
        const product = ProductModel.updateOne();
        return product;
    };

    async getProduct(){
        const product = ProductModel.findById();
        return product;
    }
};

module.exports = ProductMongo;