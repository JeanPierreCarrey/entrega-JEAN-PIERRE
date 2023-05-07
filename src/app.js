const express = require("express");
const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const productsRouter = require('./routes/products.router.js');
app.use('/api/products', productsRouter);

const cartsRouter = require('./routes/carts.router.js')
app.use('/api/carts', cartsRouter);

app.listen(port,() => {
    console.log(`Server running on port http://localhost:${port}`)
});