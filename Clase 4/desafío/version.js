const fs = require("fs");

/**
 * @author Ilan Emanuel Fritzler
 * @tutor Ivan Passalia
 */
// En esta entrega decidi utilizar solo console.error en lugar de lanzar errores con throw new Error('mensaje');
// Ya que esto aligera el proceso de testeo para el tutor. Dejaré en formato de comentario la forma ideal de trabajar con new Error
// Mas adelante creo ideal poder centralizar los errores en interceptores y middlewares cuando se comienze con express.
// Los comentarios pueden ser excesivos para tan poco codigo, pero va con la intencion de ir al grano en lo que pide la consigna 
// y dar cuenta de que no falta nada de lo que se pide ademas de agregar el proceso de pensamiento de la entrega.

class ProductManager {
    // Debe crearse desde su constructor con el elemento products, el cual será un arreglo vacío
    constructor(path) {
        this.path = path;
    }
    // Debe contar con un método “addProduct” el cual agregará un producto al arreglo de productos inicial.
    async addProduct(productData) {
        const { title, description, price, thumbnail, code, stock } = productData;
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return "Product data is not valid";
        }
        // debe arrojar error en caso de querer sumar un producto con un codigo existente.
        const products = await this.getProducts()
        // Valido que el codigo no exista.
        if (products.some(product => product.code === code)) {
            return `The code ${code} is already exists. Please try again with different code.`;
        }
        // Al agregarlo, debe crearse con un id autoincrementable
        // Uso el operador "optional chaining (?.)" para evitar posible error de acceso por desborde y asignar por default el valor 1 al id.
        const id = products[products.length - 1]?.id + 1 || 1;
        const newProduct = {
            id, title, description, price, thumbnail, code, stock
        };
        products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        // Mas adelante devolver el nuevo producto con su id puede ser de utilidad para no repetir una query a base de datos.
        return newProduct;
    }
    // Debe contar con un método “getProducts” el cual debe devolver 
    // el arreglo con todos los productos creados hasta ese momento
    async getProducts() {
        let products = []
        if(fs.existsSync(this.path)) {
            const filedata = await fs.promises.readFile(this.path, 'utf-8');
            products = JSON.parse(filedata);
        }
        return products
    }
    // getProductById debe devolver error si no encuentra el producto o el producto mismo en caso de encontrarlo
    async getProductById(pid) {
       const products = await this.getProducts();
       const productFound = products.find(product => product.id === pid);
       if(!productFound) {
            return `Product with id ${pid} is not found.`; 
       }
       return productFound;
    }

    async updateProduct(pid, changes) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id === pid);
        if(productIndex === -1) {
            return `Product with id ${pid} is not found.`; 
        }
        const productFound = products[productIndex];
        if (productFound.code === code) {
            return `The code ${code} is already exists. Please try again with different code.`;
        }
        const productUpdated = {...productFound, ...changes}
        products[productIndex] = productUpdated
        fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    async deleteProduct(pid) {
        const products = await this.getProducts()
        if(!products.some(product => product.id === pid)) {
            return `Product with id ${pid} is not found.`; 
        }
        const newProducts = products.filter(product => product.id !== pid);
        await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, 2));
    }
}

/**
 * @test
 * Testeando el entregable
 */
// Se creará una instancia de la clase “ProductManager”
const productManager = new ProductManager("products.json");

const testProduct = {
    title: "Prueba 1",
    description: "Description 1",
    price: 50,
    stock: 25,
    thumbnail: "nohayimagen",
    code: "#XXX151"
}
productManager.addProduct(testProduct).then(response => {
    console.log(response);
})