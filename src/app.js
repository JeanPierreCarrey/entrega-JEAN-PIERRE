const express = require('express');
const {engine} = require('express-handlebars');
const {Server} = require('socket.io');

const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');

const {ProductManager} = require("./ProductManager.js");
const productManager = new ProductManager("products.json");

const app = express();
const port = 8080

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("src/public"));

app.engine('handlebars', engine());
app.set('view engine', '.handlebars');
app.set('views', 'src/views');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const httpServer = app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`)
})

const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('addProduct', async entries => {
    const product = await productManager.addProduct(entries);
    socketServer.emit('addedProduct', product)
  })

  socket.on('deleteProduct', async id => {
    await productManager.deleteProduct(id);
    socketServer.emit('deletedProduct', id)
  })
});