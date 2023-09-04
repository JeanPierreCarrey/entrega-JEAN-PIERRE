const nodemailer = require("nodemailer");
require('dotenv').config();

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASS,
    },
})

exports.transport = transport;