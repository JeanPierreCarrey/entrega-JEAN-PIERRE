const {Schema, model} = require("mongoose");

const schema = new Schema({
    title: { type: String, required: true, max: 100, unique: true },
    description: { type: String, required: true, max: 100 },
    price: { type: String, required: true, max: 100 },
    thumbnail: { type: String, required: true, max: 100 },
    code: { type: String, required: true, max: 100 },
    stock: { type: String, required: true, max: 100 },
});

exports.ProductModel = model("products", schema);