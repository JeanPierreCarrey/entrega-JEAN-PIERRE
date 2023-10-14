const {Schema, model} = require ("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { ROLES } = require("../../../utils/constants");

const schema = new Schema({
    firstName: {type: String, required: true, max: 100},
    lastName: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100, unique: true},
    age: {type: Number, required: false},
    password: {type: String, max: 100},
    cartID: {type: String, required: false},
    role: {type: String, enum: [ROLES.USER, ROLES.ADMIN, ROLES.PREMIUM], required: true, default: ROLES.USER},
    documents: [{ name: String, reference: String }],
    last_connection: {type: Date},
    },
    {versionKey: false}
);

schema.plugin(mongoosePaginate);
exports.UserModel = model("users", schema);