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