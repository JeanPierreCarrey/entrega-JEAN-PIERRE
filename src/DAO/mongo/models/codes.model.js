const {Schema, model} = require("mongoose");

const schema = new Schema({
    code: { type: String, required: true },
    email: { type: String, required: true },
    expire: { type: Number, required: true },
});

exports.CodesModel = model('codes', schema);