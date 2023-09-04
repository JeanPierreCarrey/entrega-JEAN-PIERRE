const {CodesModel} = require('../DAO/mongo/models/codes.model');
const {UserModel} = require('../DAO/mongo/models/users.model.js');
const { v4: uuidv4 } = require('uuid');
const {transport} = require("../utils/mailer.js");
require('dotenv').config();

class CodeService {
    async generateCode(email) {
        const code = uuidv4();
        const codeCreated = await CodesModel.create({email, code, expire: Date.now()+3600000});
        transport.sendMail({
            from: process.env.GOOGLE_EMAIL,
            to: email,
            subject: 'reset',
            html: `
                <div>
                    <p>Your code is: ${code}</p>
                    <a href="http://localhost:${process.env.PORT}/auth/resetPassword?code=${code}&email=${email}">click to reset</a>
                </div>
            `,
        });
    };

    async findCode(email, code) {
        const foundCode = await CodesModel.findOne({email, code});
        if(foundCode && foundCode.expire > Date.now()){
            return true;
        } else {
            return false;
        };
    };

    async updateUser(password) {
        const updateUser = await UserModel.updateOne({email}, {password});
    }
};

module.exports = CodeService;