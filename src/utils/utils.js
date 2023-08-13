////--------------------- MONGO ---------------------

require('dotenv').config();
const {connect} = require("mongoose");
const logger = require("./logger.js");

async function connectMongo() {
    try {
        const mongodbUrl = process.env.MONGODB_URL;
        await connect(mongodbUrl);
        logger.info("plug to mongo!");
    } catch (e) {
        logger.error(e);
        throw "can not connect to the db";
    }
}

exports.connectMongo = connectMongo;

//--------------------- SOCKET ---------------------
const {Server} = require('socket.io');
const {ChatModel} = require("../DAO/mongo/models/chats.model.js");
const {ProductService} = require("../services/products.service.js");

function connectSocket(httpServer){
    const socketServer = new Server(httpServer);

    socketServer.on('connection', (socket) => {
        logger.debug('New user connected');

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

//--------------------- FAKER ---------------------

const {faker} = require("@faker-js/faker");

faker.locale = "es";

exports.generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.imageUrl(),
        code: faker.random.alphaNumeric(10),
        stock: faker.random.numeric(3),
        category: faker.word.noun(),
    }
}