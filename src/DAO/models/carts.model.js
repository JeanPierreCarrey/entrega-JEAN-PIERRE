const {Schema, model} = require("mongoose");

const schema = new Schema({
    products: [
        {
            product: {type: Schema.Types.ObjectId, ref: "Product", required: true},
            quantity: {type: Number, default: 1},
        },
    ],
});

exports.CartModel = model("carts", schema);