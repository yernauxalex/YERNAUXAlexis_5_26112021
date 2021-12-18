(async () => {
    // Gestion du localStorage
    // Ajout d'un produit dans le localStorage
    let addProductLocalStorage = (saveProductLocalStorage, productJson) => {
        saveProductLocalStorage.push(productJson);
        localStorage.setItem('product', JSON.stringify(saveProductLocalStorage));
        return alert("Ajout du produit au panier");
    }

    // Modifier un produit dans le localStorage
    let modifyProductLocalStorage = (index, saveProductLocalStorage, productJson) => {
        saveProductLocalStorage[index].qty = parseInt(saveProductLocalStorage[index].qty);
        productJson.qty = parseInt(productJson.qty);

        // Vérification de la quantité maximale
        const totalProduct = productJson.qty + saveProductLocalStorage[index].qty;

        if (totalProduct > 100) {
            return alert("Limité à 100 exemplaires");
        }
        // On ajoute le nombre d'exemplaire au localStorage
        saveProductLocalStorage[index].qty += productJson.qty;
        localStorage.setItem('product', JSON.stringify(saveProductLocalStorage));
        return alert("Ajout du produit au panier");
    }    

    // Création d'un produit
    let createProduct = () => {
        // Récupération de l'id dans l'url de la page
        const idProduct = new URL(window.location.href).searchParams.get('id')
        const quantity = document.getElementById("quantity");
        const colors = document.getElementById("colors");

        let saveProductLocalStorage = JSON.parse(localStorage.getItem('product'));

        let productJson = {
            _id: idProduct,
            qty: quantity.value,
            colors: colors.value,
        }

        // Si quantité inférieure ou égale à 0, ou supérieur à 100, ou absence de couleur alors l'ajout est impossible
        if (productJson.qty <= 0 || productJson.qty > 100 || productJson.colors == '') {
            return alert("Ajout au panier impossible");
        }
        // Si pas de produit dans le localStorage création d'un produit et ajout dans le localStorage
        if (!saveProductLocalStorage) {
            saveProductLocalStorage = [];
            return addProductLocalStorage(saveProductLocalStorage, productJson);
        }

        // Vérification si le produit avec la même couleur est déjà présent
        const sameColorId = (s) => s.colors === productJson.colors && s._id === productJson._id;
        const index = saveProductLocalStorage.findIndex(sameColorId)

        // Si déjà présent on modifie la quantité
        if (index !== -1) {
            return modifyProductLocalStorage(index, saveProductLocalStorage, productJson);
        }
        // Sinon ajout du produit
        return addProductLocalStorage(saveProductLocalStorage, productJson);
    }

    // Fonction qui affiche la page du produit
    let displayproduct = (data) => {
        // Récupération de l'id dans l'url de la page
        const idProduct = new URL(window.location.href).searchParams.get('id')
        const product = data.find(data => data._id === idProduct);
        //Insertion des éléments dans la page
        let baliseImg = document.getElementsByClassName("item__img");
        baliseImg[0].innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
        document.getElementById("title").textContent = product.name;
        document.getElementById("price").textContent = product.price;
        document.getElementById("description").textContent = product.description;
        const selectColor = document.getElementById("colors");
        const colors = product.colors;
        colors.forEach((print) => {
            selectColor.insertAdjacentHTML('beforeend', `<option value="${print}">${print}</option>`);
        });
    };

    try {
        let data = await fetchProduct();
        displayproduct(data);

        const addCart = document.getElementById("addToCart");
        addCart.addEventListener('click', createProduct);
    }
    catch (error) {
        console.error(error);
    }
})()

