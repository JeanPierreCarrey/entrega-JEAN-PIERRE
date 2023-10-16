const { ProductModel } = require("./models/products.model.js");

class ProductMongo{
    async createProduct(prod){
        const product = await ProductModel.create(prod);
        return product;
    };

    async deleteProduct(){
        const product = await ProductModel.deleteOne();
        return product;
    };

    async updateProduct(){
        const product = await ProductModel.updateOne();
        return product;
    };

    async getProduct(){
        const product = await ProductModel.findById();
        return product;
    }

    async findProduct(){
        const product = await ProductModel.findOne();
        return product
    }
};

module.exports = ProductMongo;