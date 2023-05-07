const fs = require("fs");

class ProductManager{
    #lastId = 0;
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            const codeExists = products.some((p) => p.code === product.code);
            if(codeExists) {
                throw new Error("Product with the same code already exists");
            }
    
            if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                throw new Error ("All fields are mandatory")
            }
    
            const newId = ++this.#lastId
    
            const newProduct = {id: newId, ...product};
            products.push(newProduct);
            await this.writeProducts(products);
            return newProduct;
        }
        catch (err){
            throw new Error ("addProduct method failed")
        }
    }
    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, "utf8");
            return JSON.parse(data);
        } catch (err) {
            return [];
            }
    }
    async getProductById(productId) {
        try {
            const products = await this.getProducts();
            const product = products.find((p) => p.id === productId);
            if (product) {
                return product;
            }else{
                throw new Error('Product not found');
            }
        }catch (err) {
            throw new Error ("getProductById method failed")
        }
    }
    async updateProduct(productId, update){
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex((p) => p.id === productId);
            if (productIndex === -1) {
                throw new Error("Product with the specified id not found");
            }
    
            const updatedProduct = {...products[productIndex], ...update};
            products[productIndex] = updatedProduct;
            await this.writeProducts(products);
            return updatedProduct;
        }catch (err){
            throw new Error ("updateProduct method failed")
        }
    }
    async deleteProduct(productId) {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex((p) => p.id === productId);
            if (productIndex === -1) {
                throw new Error('Product not found');
            }
    
            products.splice(productIndex, 1);
            await this.writeProducts(products);
        }catch (err) {
            throw new Error ("deleteProduct method failed")
        }
    }

    async writeProducts(products) {
        try{
            await fs.promises.writeFile(this.path, JSON.stringify(products));
        }catch (err){
            throw new Error(`Error writing products to file: ${err}`);
        }
        
    }
}

const productManager = new ProductManager("products.json");

/* async function asyncProductManager() {
    await productManager.deleteProduct(1)
};

asyncProductManager(); */

module.exports = {ProductManager};

/* async function asyncProductManager() {
        await productManager.addProduct({
            title: 'coca cola',
            description: 'Refresco sabor cola de la marca Coca Cola',
            price: 150,
            thumbnail: 'https://www.distribuidorabebidas.com.uy/wp-content/uploads/sites/31/2018/01/funda_coca_cola_225_litros.jpg',
            code: 'coke100',
            stock: 20,
        });
    } */