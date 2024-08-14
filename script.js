const productsContainer = document.querySelector(".box");
const apiUrl = "https://66b99baffa763ff550f8d5e8.mockapi.io/apiBack/ApiBack";
const addModal = document.querySelector(".addModal");
const plus = document.querySelector(".plus");
const btnAdd = document.querySelector(".btnAdd");
const titleAdd = document.querySelector(".titleAdd");
const imageAdd = document.querySelector(".imageAdd");
const priceAdd = document.querySelector(".priceAdd");
const descriptionAdd = document.querySelector(".descriptionAdd");
const editModal = document.querySelector(".editModal");
const titleEdit = document.querySelector(".titleEdit");
const imageEdit = document.querySelector(".imageEdit");
const priceEdit = document.querySelector(".priceEdit");
const descriptionEdit = document.querySelector(".descriptionEdit");
const btnEditSave = document.querySelector(".btnEditSave");
const closeInfoModal = document.querySelector('.closeInfoModal');
const infoModal = document.querySelector('.infoModal');
const closeAddModal = document.querySelector('.closeAddModal');
const closeEditModal = document.querySelector('.closeEditModal');
let idx = null;
let status = null;

btnAdd.onclick = async () => {
    const obj = {
        name: titleAdd.value,
        image: imageAdd.value,
        price: priceAdd.value,
        description: descriptionAdd.value,
        status: false,
    };
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
            body: JSON.stringify(obj),
        });
    } catch (error) {
        console.error(error);
    }
    await getProducts();
    clearAddForm();
    addModal.style.display = "none";
};

function clearAddForm() {
    titleAdd.value = "";
    imageAdd.value = "";
    priceAdd.value = "";
    descriptionAdd.value = "";
}

const getProducts = async () => {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        AddTask(data);
    } catch (error) {
        console.error(error);
    }
};

const updateProduct = async (id, updatedProduct) => {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        });
    } catch (error) {
        console.error(error);
    }
    await getProducts();
};

const deleteProduct = async (id) => {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
        });
    } catch (error) {
        console.error(error);
    }
    await getProducts();
};

const AddTask = (products) => {
    productsContainer.innerHTML = "";
    products.forEach((product) => {
        const productDiv = document.createElement("div");
        const productContent = document.createElement("div");
        const checkbox = document.createElement("input");
        const productName = document.createElement("h3");
        const productImage = document.createElement("img");
        const productPrice = document.createElement("p");
        const infoButton = document.createElement("button");
        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");
        productDiv.classList.add("product-card");
        productContent.classList.add("product");
        checkbox.type = "checkbox";
        checkbox.onclick = () => Check(checkbox, product.id);
        productName.id = `product-name-${product.id}`;
        productName.innerHTML = product.name;
        productImage.src = product.image;
        productImage.alt = product.name;
        productPrice.innerHTML = `$${product.price}`;
        infoButton.innerHTML = "🛈";
        infoButton.onclick = () => showInfo(product.id);
        editButton.innerHTML = "✏️";
        editButton.onclick = () => openEditModal(product.id);
        deleteButton.innerHTML = "🗑️";
        deleteButton.onclick = () => deleteProduct(product.id);
        productContent.append(productImage, productName, productPrice, deleteButton, editButton, checkbox, infoButton);
        productDiv.appendChild(productContent);
        productsContainer.appendChild(productDiv);
    });
};

const showInfo = async (id) => {
    const product = await ProductId(id);
    const modal = document.querySelector(".infoModal");
    modal.querySelector(".modal-title").innerText = product.name;
    modal.querySelector(".modal-body").innerHTML = `
        <p>Price: $${product.price}</p>
        <p>Description: ${product.description}</p>
    `;
    modal.style.display = "block";
};

const ProductId = async (id) => {
    const response = await fetch(`${apiUrl}/${id}`);
    const product = await response.json();
    return product;
};

const closeModal = (modal) => {
    modal.style.display = "none";
};

closeInfoModal.onclick = () => closeModal(infoModal);;
infoModal.onclick = (e) => {
    if (e.target === infoModal) {
        closeModal(infoModal);
    }
};

closeAddModal.onclick = () => closeModal(addModal);
addModal.onclick = (e) => {
    if (e.target === addModal) {
        closeModal(addModal);
    }
};

closeEditModal.onclick = () => closeModal(editModal);
editModal.onclick = (e) => {
    if (e.target === editModal) {
        closeModal(editModal);
    }
};

plus.onclick = () => {
    addModal.style.display = "block";
};

btnEditSave.onclick = async () => {
    const updatedProduct = {
        name: titleEdit.value,
        image: imageEdit.value,
        price: priceEdit.value,
        description: descriptionEdit.value,
        status: status,
    };
    await updateProduct(idx, updatedProduct);
    editModal.style.display = "none";
};

const openEditModal = async (id) => {
    const product = await ProductId(id);
    idx = product.id;
    titleEdit.value = product.name;
    imageEdit.value = product.image;
    priceEdit.value = product.price;
    descriptionEdit.value = product.description;
    status = product.status;
    editModal.style.display = "block";
};

const Check = (checkbox, id) => {
    const productName = document.querySelector(`#product-name-${id}`);
    if (checkbox.checked) {
        productName.style.textDecoration = "line-through";
    } else {
        productName.style.textDecoration = "none";
    }
};

document.addEventListener("DOMContentLoaded", getProducts);