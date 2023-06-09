////--------------------- MONGO ---------------------

require('dotenv').config();
const {connect} = require("mongoose");

async function connectMongo() {
    try {
        const mongodbUrl = process.env.MONGODB_URL;
        await connect(mongodbUrl);
        console.log("plug to mongo!");
    } catch (e) {
        console.log(e);
        throw "can not connect to the db";
    }
}

exports.connectMongo = connectMongo;

/* const mongoose = require('mongoose');
require("dotenv").config();

const config = {
    mongoDB: {
        URL: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@backendcoder.nkbcjia.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        },
    },
};

const connectMongo = async () => {
    try {
        await mongoose.connect(config.mongoDB.URL, config.mongoDB.options);
        console.log("Connected to Mongo Atlas");
    } catch (error) {
        console.log("Error en la conexión con Mongo Atlas", error);
    }
};

exports.connectMongo = connectMongo */

//--------------------- SOCKET ---------------------
const {Server} = require('socket.io');
const {ChatModel} = require("./DAO/models/chats.model.js");
const {ProductService} = require("./services/products.service.js");

function connectSocket(httpServer){
    const socketServer = new Server(httpServer);

    socketServer.on('connection', (socket) => {
        console.log('New user connected');

        socket.on('addProduct', async (entries) => {
        const product = await ProductService.createOne(entries);
        socketServer.emit('addedProduct', product)
        })

        socket.on('deleteProduct', async id => {
        await ProductService.deleteOne(id);
        socketServer.emit('deletedProduct', id)
        })

        socket.on('msg_front_to_back', async (msg) => {
            const msgCreated = await ChatModel.create(msg);
            const messages = await ChatModel.find({});
            socketServer.emit('msg_back_to_front', messages);
        });
    });
}

exports.connectSocket = connectSocket;

//--------------------- BCRYPT ---------------------

const bcrypt = require('bcrypt');

function createHash(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

function isValidPassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
}

exports.createHash = createHash;
exports.isValidPassword = isValidPassword;