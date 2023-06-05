const { ProductModel } = require("../DAO/models/products.model.js");

class ProductService{
    
    validate(title, description, price, thumbnail, code, stock){
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("validation error: please complete all fields.");
            throw new Error("validation error: please complete all fields.");
        }
    }

    async get(id){
        if (id) {
            const product = await ProductModel.findById(id);
            return product;
        } else {
            const products = await ProductModel.find({});
            return products;
        }
    }

    async createOne(title, description, price, thumbnail, code, stock){
        this.validate(title, description, price, thumbnail, code, stock);
        const productCreated = await ProductModel.create({title, description, price, thumbnail, code, stock});
        return productCreated;
    }

    async deleteOne(_id){
        const deleted = await ProductModel.deleteOne({_id});
        if (deleted.deletedCount === 1) {
            return true;
        } else {
            throw new Error("Product not found");
        }
    }

    async updateOne(id, title, description, price, thumbnail, code, stock){
            this.validate(title, description, price, thumbnail, code, stock);
            const productUptaded = await ProductModel.updateOne({ _id: id }, {title, description, price, thumbnail, code, stock});
            return productUptaded;
    }
}

module.exports = ProductService;