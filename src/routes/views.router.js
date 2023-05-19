/* const express = require('express');
const viewsRouter = express.Router();
const { getProducts, addProduct, deleteProduct } = require('../ProductManager.js');

// Route to render the home view with a list of all products
viewsRouter.get('/', (req, res) => {
  const products = getProducts();
  res.render('home', { products });
});

// Route to render the realTimeProducts view
viewsRouter.get('/realtimeproducts', (req, res) => {
  const products = getProducts();
  res.render('realTimeProducts', { products });
});

// Handle addProduct event
viewsRouter.post('/addProduct', (req, res) => {
    const product = req.body;
    addProduct(product);
    // Emit updated products list to all clients
    req.app.get('io').emit('productsUpdated', getProducts());
    res.sendStatus(200);
  });

  viewsRouter.delete('/deleteProduct/:productId', (req, res) => {
    const { productId } = req.params;
    deleteProduct(productId);
    // Emit updated products list to all clients
    req.app.get('io').emit('productsUpdated', getProducts());
    res.sendStatus(200);
});

module.exports = viewsRouter;

 */



/////////// (io) =>



/* // Socket.io events to handle adding and deleting products
module.exports = (io) => {
  io.on('connection', (socket) => {
    // Listen for addProduct event
    socket.on('addProduct', (product) => {
      addProduct(product);
      // Emit updated products list to all clients
      io.emit('productsUpdated', getProducts());
    });

    // Listen for deleteProduct event
    socket.on('deleteProduct', (productId) => {
      deleteProduct(productId);
      // Emit updated products list to all clients
      io.emit('productsUpdated', getProducts());
    });
  });
};

 */




/////////////////////////////////




const express = require('express');
const viewsRouter = express.Router();
const {ProductManager} = require("../ProductManager.js");
const productManager = new ProductManager('products.json')

viewsRouter.get('/', async (req, res) => {
  try{
    const products = await productManager.getProducts();
    return res.status(200).render('home', {products});
  }catch(err){
    return res.status(500).json({status: "error", msg: "Error in server", products:{}})
  }
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
  try{
    const products = await productManager.getProducts();
    return res.status(200).render('realTimeProducts', {products});
  }catch(err){
    return res.status(500).json({status: "error", msg: "Error in server", products:{}})
  }
});

module.exports = viewsRouter;