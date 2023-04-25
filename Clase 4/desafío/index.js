const fs = require("fs");

class ProductManager{
    #lastId = 0;
    constructor(path) {
        this.path = path;
        this.products = [];
        const productsString = fs.readFileSync(this.path, "utf-8");
        const products /* ? */ = JSON.parse(productsString);
/*         this.products = products */
    }
    async addProduct(product) {
        const codeExists = this.products.some((p) => p.code === product.code);
            if(codeExists) {
                throw new Error("Product with the same code already exists");
            }

        if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            throw new Error ("All fields are mandatory")
        }

        const newId = ++this.#lastId

        const newProduct = {id: newId, title: product.title, description: product.description, price: product.price, thumbnail: product.thumbnail, code: product.code, stock: product.stock};
        this.products.push(newProduct);
        const productsString = JSON.stringify(this.products);
        await fs.promises.writeFileSync("products.json", productsString)
        return "newProduct"
        }
    async getProducts() {
        return this.products;
        }
    async getProductById(productId) {
            for (const product of this.products) {
                if (product.id === productId) {
                    return product;
                }
            }
            return 'Not found';
        }
    async updateProduct(){
        fs.writeFileSync("products.json", productsString)
        }
    async deleteProduct(){
        fs.writeFileSync("products.json", productsString)
        }
}

const product1 = {
    title: 'coca cola',
    description: 'Refresco sabor cola de la marca Coca Cola',
    price: 150,
    thumbnail: 'https://www.distribuidorabebidas.com.uy/wp-content/uploads/sites/31/2018/01/funda_coca_cola_225_litros.jpg',
    code: 'coke100',
    stock: 20,
};

const product2 = {
    title: 'pepsi',
    description: 'Refresco sabor cola de la marca Pepsi',
    price: 125,
    thumbnail: 'https://discouy.vtexassets.com/arquivos/ids/1266779-800-auto?v=638162340142100000&width=800&height=auto&aspect=true',
    code: 'pepsi50',
    stock: 10,
};

const productManager = new ProductManager("products.json");
console.log(productManager.addProduct(product1));
console.log(productManager.addProduct(product2));
console.log(productManager.getProducts());
console.log(productManager.getProductById(3));