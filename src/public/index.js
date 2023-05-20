const addProductForm = document.getElementById("addProductForm");
const addProductFormReal = document.getElementById("addProductFormReal");
const productsList = document.getElementById("productsList");

try{
async function deleteProduct(id) {
    const response = await fetch(`/api/products/${id}`, {
        method: "delete",
    })
    if(response.ok){
        const li = document.getElementById(id);
        li.remove();
    }else{
        console.error()
        alert("Product couldn't be deleted")
    }
}}catch(error){
    console.error(error)
};

function deleteProductSocket(id) {
    socket.emit('deleteProduct', id)
};

try {
    addProductForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(addProductForm);
        const entries = Array.from(formData.entries());
        const formDataObject = entries.reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
        const response = await fetch("/api/products", {
            method: "post",
            body: JSON.stringify(formDataObject),
            headers: {
                "content-type": "application/json"
            }
        })
        const product = await response.json();
        if(response.ok) {
            const li = `
            <li id="${product.id}">
                <div>
                    <p>${product.title} - ${product.description} - ${product.price} - ${product.thumbnail} - ${product.code} - ${product.stock}</p>
                    <button onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
            </li>
            `;
            productsList.innerHTML += li
            addProductForm.reset();
        }else{
            alert("Error, product not loaded");
        }
    });
}catch(error){};

try {
    socket.on('connect', () => {
        console.log("Successful connection");
    });
    socket.on('addedProduct', product => {
        const li = `
        <li id="${product.id}">
            <div>
                <p>${product.title} - ${product.description} - ${product.price} - ${product.thumbnail} - ${product.code} - ${product.stock}</p>
                <button onclick="deleteProductSocket('${product.id}')">Delete</button>
            </div>
        </li>
        `;
        productsList.innerHTML += li
    });

    socket.on('deletedProduct', (id) => {
        const li = document.getElementById(id);
        li.remove();
    });

addProductFormReal.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(addProductFormReal);
    const entries = Array.from(formData.entries());
    const formDataObject = entries.reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
    socket.emit('addProduct', formDataObject);
});
        addProductFormReal.reset();
}catch(error){};