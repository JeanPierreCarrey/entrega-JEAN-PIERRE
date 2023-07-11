const {Schema, model} = require ("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const schema = new Schema({
    firstName: {type: String, required: true, max: 100},
    lastName: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100, unique: true},
    age: {type: Number, required: false},
    password: {type: String, max: 100},
    cartID: {type: String, required: false},
    role: {type: String, required: true, default: "user"},
    },
    {versionKey: false}
);

schema.plugin(mongoosePaginate);
exports.UserModel = model("users", schema);