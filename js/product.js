// Récupération de l'id dans l'url de la page
let idProduct = new URL(window.location.href).searchParams.get('id')
console.log(idProduct);

(async () => {
    try {
        //On récupère les données de l'api pour les stocker dans le localStorage si elles n'y sont pas présentes
        if (!localStorage.getItem("inventory")){
            console.log("Accès à l'api");
            let response = await fetch ("http://localhost:3000/api/products");
            let inventoryRaw = await response.json();
            localStorage.setItem('inventory', JSON.stringify(inventoryRaw));
        }
        let data = await JSON.parse(localStorage.getItem("inventory"));
        console.log(data);
        (displayproduct = () => {
            let product = data.find(data => data._id === idProduct);
            //Insertion des éléments dans la page
            let baliseImg = document.getElementsByClassName("item__img");
            baliseImg[0].innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
            document.getElementById("title").innerHTML = product.name;
            document.getElementById("price").innerHTML = product.price;
            document.getElementById("description").innerHTML = product.description;
            let selectColor = document.getElementById("colors");
            let colors = product.colors;
            colors.forEach((print, k) => {
                selectColor.insertAdjacentHTML('beforeend', `<option value="${colors[k]}">${colors[k]}</option>`);
            });
        })();
    }
    catch (error){
        console.error(error);
    }
})()
/*
fetch("http://localhost:3000/api/products")
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then((data) => {
        //Récupère les éléments correspondant à l'id du produit via l'api
        let i = 0;
        let img, name, price, description, altTxt, colors;
        while (i <= data.length) {
            if (data[i]._id === idProduct) {
                img = data[i].imageUrl;
                name = data[i].name;
                price = data[i].price;
                description = data[i].description;
                altTxt = data[i].altTxt;
                colors = data[i].colors;
                break;
            }
            else {
                i++;
            }
        }

        //Insertion des éléments dans la page
        let baliseImg = document.getElementsByClassName("item__img");
        baliseImg[0].innerHTML = `<img src="${img}" alt="${altTxt}">`;
        document.getElementById("title").innerHTML = name;
        document.getElementById("price").innerHTML = price;
        document.getElementById("description").innerHTML = description;
        console.log(colors)
        let selectColor = document.getElementById("colors");
        for (let k in colors) {
            selectColor.insertAdjacentHTML('beforeend', `<option value="${colors[k]}">${colors[k]}</option>`);
        }

    })
    .catch(function (err) {
        console.error("Erreur d'accès à l'API");
    });*/

// Gestion du localStorage
// Création d'un produit
let createProduct = () => {
    let quantity = document.getElementById("quantity");
    let colors = document.getElementById("colors");

    let saveProductLocalStorage = JSON.parse(localStorage.getItem('product'));

    let productJson = {
        _id: idProduct,
        qty: quantity.value,
        colors: colors.value,
    }

    // Ajout d'un produit dans le localStorage
    let addProductLocalStorage = () => {
        saveProductLocalStorage.push(productJson);
        localStorage.setItem('product', JSON.stringify(saveProductLocalStorage));
        console.log("Ajout dans le localStorage");
    }

    // Modifier un produit dans le localStorage
    let modifyProductLocalStorage = (index) => {
        saveProductLocalStorage[index].qty = parseInt(saveProductLocalStorage[index].qty);
        productJson.qty = parseInt(productJson.qty);

        // Vérification de la quantité maximale
        let totalProduct = productJson.qty + saveProductLocalStorage[index].qty;

        if (totalProduct > 100) {
            console.log("Limité à 100 exemplaires");
        }
        else {
            saveProductLocalStorage[index].qty += productJson.qty;
            localStorage.setItem('product', JSON.stringify(saveProductLocalStorage));
            console.log("Ajout de la quantité")
        }
    }

    // Si quantité inférieure ou égale à 0, ou supérieur à 100, ou absence de couleur alors l'ajout est impossible
    if (productJson.qty <= 0 || productJson.qty > 100 || productJson.colors == '') {
        console.log('Ajout impossible');
    }
    else {
        // Si pas de produit dans le localStorage création d'un produit et ajout dans le localStorage
        if (!saveProductLocalStorage) {
            saveProductLocalStorage = [];
            addProductLocalStorage();
            console.log("Création d'un produit");
        }

        // Vérification si le produit avec la même couleur est déjà présent
        else {
            const sameColorId = (s) => s.colors === productJson.colors && s._id === productJson._id;
            let index = saveProductLocalStorage.findIndex(sameColorId)

            // Si déjà présent on modifie la quantité
            if (index !== -1) {
                modifyProductLocalStorage(index);
                console.log("Déjà présent, quantité modifiée");
            }
            // Sinon ajout du produit
            else {
                addProductLocalStorage();
                console.log("Ajout du produit");
            }
        }
    }
    console.log("======");
    console.log("Current saveProductLocalStorage");
    console.log(saveProductLocalStorage);
    console.log("======");
    console.log("======");
    console.log("Current localStorage");
    console.log(localStorage);
    console.log("======");
}

let addCart = document.getElementById("addToCart");
addCart.addEventListener('click', (event) => {
    createProduct()
});