const {Schema, model} = require("mongoose");
const { ProductModel } = require("./products.model.js");

const schema = new Schema({
    products: [
        {
            product: {type: Schema.Types.ObjectId, ref: ProductModel, required: true},
            quantity: {type: Number, default: 1},
        },
    ],
});

exports.CartModel = model("carts", schema);