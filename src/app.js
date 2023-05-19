const express = require('express');
//const http = require('http');
//const path = require('path');
const {Server} = require('socket.io');
const {engine} = require('express-handlebars');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
//const {__dirname} = require("./utils.js")
//const {productRouterHtml} = require("./routes/home.router.js")
//const {realTimeRouterSockets} = require("./routes/realTimeProducts.router.js")
const productManager = require("./ProductManager.js");
const app = express();
const port = 8080

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("src/public"));//app.use(express.static(path.join(__dirname, "public")));

app.engine('handlebars', engine());
app.set('view engine', '.handlebars');
app.set('views', 'src/views'); //app.set('views', path.join(__dirname, 'views'));

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

/* app.get("*"), (req, res, next) => {
  res.status(404).json({status: "error", msg: "Not Found", data: {} })
}

module.exports = app; */








  /* socket.on('productCreated', async (req, res) => {
    const products = new ProductManager("./productos.json");
    await products.addProduct(req);
    io.emit("newProduct", req);
  });

  socket.on('productDeleted', async (req, res) => {
    const products = new ProductManager("./productos.json");
    await products.deleteProduct(req);
    io.emit("productDeleted", req);
  });
});

app.get("*"), (req, res, next) => {
  res.status(404).json({status: "error", msg: "Not Found", data: {} })
}
 */

/* const socketServer = new Server(httpServer);

const startSocketServer = async () => {
  socketServer.on('connection', async (socket) => {
    console.log('New socket connection:' + socket.id);
    socket.emit("mensaje", "Conectado");

    socketServer.emit('products', await productsRouter.getProducts());

    socketServer.on('productCreated', async (product) => {
      await productsRouter.addProduct(product);
      socketServer.emit('products', await productsRouter.getProducts());
    });

    socketServer.on('productDeleted', async (productId) => {
      await productsRouter.deleteProduct(productId);
      socketServer.emit('products', await productsRouter.getProducts());
    });
  });
};

startSocketServer(); */