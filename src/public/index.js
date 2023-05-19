const addProductForm = document.getElementById("addProductForm");
const addProductFormReal = document.getElementById("addProductFormReal");
const productsList = document.getElementById("productsList");

async function deleteProduct(id) {
    const response = await fetch(`/api/products/${id}`, {
        method: "delete",
    })
    if(response.ok){
        const li = document.getElementById(id);
        li.remove();
    }else{
        alert("Product couldn't be deleted")
    }
};

function deleteProductSocket(id) {
    socket.emit('deleteProduct', id)
};

try {
    addProductForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(addProductForm);
        const entries = Object.entries(formData.entries());
        const response = await fetch("/api/products", {
            method: "post",
            body: JSON.stringify(entries),
            headers: {
                "content-type": "application/json"
            }
        })
        //const bodyResponse = await response.json();
        //const product = bodyResponse
        const product = await response.json();
        if(response.ok) {
            const li = `
            <li id="${product.id}">
                <div>
                    <p>${product.title} - ${product.description} - ${product.price} - ${product.thumbnail} -${product.code} -${product.stock}</p>
                    <button onclick="deleteProduct("${product.id}")">Delete</button>
                </div>
            </li>
            `
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
                <p>${product.title} - ${product.description} - ${product.price} - ${product.thumbnail} -${product.code} -${product.stock}</p>
                <button onclick="deleteProductSocket("${product.id}")">Delete</button>
            </div>
        </li>
        `
        productsList.innerHTML += li
    });

    socket.on('deletedProduct', (id) => {
        const li = document.getElementById(id);
        li.remove();
    });

    addProductFormReal.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(addProductForm);
        const entries = Object.entries(formData.entries());

        socket.emit('addProduct', entries);
        addProductFormReal.reset();
    });
}catch(error){};