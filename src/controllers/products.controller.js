const ProductService = require('../services/products.service.js');
const productService = new ProductService();
const {CustomError} = require("../services/errors/custom-error.js");
const EErros = require("../services/errors/enums.js");
const {generateProduct} = require("../utils/utils.js");
const nodemailer = require("nodemailer");
require('dotenv').config();
const UserDTO = require("../DAO/DTO/user.dto");

class ProductsController {
    async getAllProducts(req, res) {
            const queryParams = req.query;
            const response = await productService.getAllProducts(queryParams);
            if (response instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: response,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }
            return res.status(200).json(response);
    }

    async getProductById(req, res) {
            const { pid } = req.params;
            const product = await productService.getAllProducts(pid);
            if (product instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: product,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }
            return res.status(200).json({
                status: 'success',
                msg: 'producto',
                data: product,
            });
        }
    
    async createProduct(req, res) {
            const { title, description, price, thumbnail, code, stock, category } = req.body;
            const userEmail = req.user.email;
            const productToCreate = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category,
                owner: userEmail,
            };
            const productCreated = await productService.createProduct(productToCreate);
            if (productCreated instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: productCreated,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }
            return res.status(201).json({
                status: 'success',
                msg: 'product created',
                data: productCreated,
            });
    }
    
    async updateProduct(req, res) {
            const { id } = req.params;
            const { title, description, price, thumbnail, code, stock, category } = req.body;
            if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                CustomError.createError({
                    name: 'fields missing or incorrect',
                    cause: 'there was an error in one or more of the fields',
                    message: 'validation error: please complete or correct all fields.',
                    code: EErros.VALIDATION_ERROR,
                });
            }
    
            const productUpdated = await productService.updateProduct(id, title, description, price, thumbnail, code, stock, category);
            if (productUpdated instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: productUpdated,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }
            return res.status(200).json({
                status: 'success',
                msg: 'product updated',
                data: productUpdated,
            });
    }
    
    async deleteProduct(req, res) {
        const { id } = req.params;
        const user = new UserDTO(req.session)
        const userEmail = user.email;

        if (user.role === 'admin') {
            const productDeleted = await productService.deleteProduct(id);
            if (productDeleted instanceof Error) {
                CustomError.createError({
                    name: 'Controller message error',
                    cause: productDeleted,
                    message: 'something went wrong :(',
                    code: EErros.INTERNAL_SERVER_ERROR,
                });
            }

            return res.status(200).json({
                status: 'success',
                msg: 'product deleted',
                data: {},
            });
        }

        const product = await productService.getProductByIdAndOwner(id, userEmail);
        if (!product) {
            return res.status(403).json({
                status: 'error',
                msg: 'You do not have permission to delete this product.',
            });
        }

        const productDeleted = await productService.deleteProduct(id);
        if (productDeleted instanceof Error) {
            CustomError.createError({
                name: 'Controller message error',
                cause: productDeleted,
                message: 'something went wrong :(',
                code: EErros.INTERNAL_SERVER_ERROR,
            });
        }

        if (user.role === 'premium') {
            this.sendProductDeletionEmail(user.email, product.name);
        }

        return res.status(200).json({
            status: 'success',
            msg: 'product deleted',
            data: {},
        });
    }

    sendProductDeletionEmail = async (email, productName) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GOOGLE_EMAIL,
                pass: process.env.GOOGLE_PASS,
            },
        });

        const mailOptions = {
            from: process.env.GOOGLE_EMAIL,
            to: email,
            subject: 'Your product has been deleted',
            html: `
            <p>Hello,</p>
            <p>Your product "${productName}" has been deleted.</p>
            <p>If you have any questions or concerns, please contact our support team.</p>
            <p>Best regards,</p>
            <p>Your Application Team</p>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Product deletion email sent: ' + info.response);
            }
        });
    }

    async mock(req, res) {
        const products = [];
        for (let i = 0; i < 100; i++) {
            products.push(generateProduct());
        }
        res.send({ status: "success", payload: products });
    }
}

module.exports = ProductsController;