const express = require("express");
const app = express();
const port = 2000;
const {ProductManager} = require("./ProductManager")
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const productManager = new ProductManager("products.json");

app.get("/products", async (req,res) => {
    let products = await productManager.getProducts();
    const limit = req.query.limit;
    if (!limit) {
        return res.json(products);
    }else{
        return res.json(products.slice(0, limit));
    }
});

app.get("/products/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const products = await productManager.getProductById(id);
    if (!products) {
        return res.json("Product not found");
    }else{
        res.json(products);
    }
});

app.listen(port,() => {
    console.log(`Server running on port http://localhost:${port}`)
});