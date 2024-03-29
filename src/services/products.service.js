const { ProductModel } = require("../DAO/mongo/models/products.model.js");
const ProductMongo = require("../DAO/mongo/products.mongo.js");
const productMongo = new ProductMongo();
const ProductDTO = require("../DAO/DTO/products.dto.js");
const CustomError = require("../services/errors/custom-error.js");
const EErros = require("../services/errors/enums.js");

class ProductService{
    constructor(dao) {
        this.dao = dao;
    }
    
    validate(title, description, price, thumbnail, code, stock, category){
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            CustomError.createError({
                name: 'fields missing or incorrect',
                cause: 'fields missing or incorrect',
                message: 'validation error: please complete or correct all fields.',
                code: EErros.VALIDATION_ERROR,
            });
        }
    }

    async getAllProducts(queryParams){
        const { limit = 10, page = 1, sort, query } = queryParams;
        const filter = {};

        if (query) {
            filter.$or = [
                {category: query},
            ];
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort === "desc" ? "-price" : "price",
        };

        const result = await ProductModel.paginate(filter, options);

        const response = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.hasPrevPage ? result.prevPage : null,
            nextPage: result.hasNextPage ? result.nextPage : null,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}` : null,
        };
        return response;
    }

    async createProduct({title, description, price, thumbnail, code, stock, category, owner}){

        this.validate(title, description, price, thumbnail, code, stock, category);
        const productToCreate = new ProductDTO({title, description, price, thumbnail, code, stock, category, owner});
        const productCreated = await productMongo.createProduct(productToCreate);
        return productCreated;
    }

    async deleteProduct(_id){
        const deleted = await productMongo.deleteProduct({_id});
        if (deleted.deletedCount === 1) {
            return true;
        } else {
            CustomError.createError({
                name: '404 not found error',
                cause: deleted,
                message: 'Not Found',
                code: EErros.NOT_FOUND_ERROR,
            });
        }
    }

    async updateProduct(id, title, description, price, thumbnail, code, stock, category){
            this.validate(title, description, price, thumbnail, code, stock, category);
            const productUptaded = await productMongo.updateProduct({ _id: id }, {title, description, price, thumbnail, code, stock, category});
            return productUptaded;
    }

    async getProductByIdAndOwner(productId, ownerEmail) {
        const product = await productMongo.findProduct({
            _id: productId,
            owner: ownerEmail,
        });
        if (product){
            return product
        } else {
            CustomError.createError({
                name: '404 not found error',
                cause: deleted,
                message: 'Not Found',
                code: EErros.NOT_FOUND_ERROR,
            });
        }
    }
}

module.exports = ProductService;