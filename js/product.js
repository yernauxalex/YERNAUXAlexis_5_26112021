// Récupération de l'id dans l'url de la page
let idProduct = new URL(window.location.href).searchParams.get('id')
console.log(idProduct);

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
    });

// Gestion du localStorage
// Création d'un produit
let createProduct = () => {
    let quantity = document.getElementById("quantity").value;

    let saveProductLocalStorage = JSON.parse(localStorage.getItem('product'));

    let productJson = {
        _id: idProduct,
        qty: quantity,
        colors: colors,
    }
    
    // Ajout d'un produit dans le localStorage
    let addProductLocalStorage = () => {
        saveProductLocalStorage.push(productJson);
        let productLinea = JSON.stringify(productJson);
        localStorage.setItem('product', productLinea)
    }

    // Modifier un produit dans le localStorage
    let modifyProductLocalStorage = (index) => {
        saveProductLocalStorage[index] = parseInt(saveProductLocalStorage[index].qty);
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
            console.log(productJson);
        }
        // Vérification si le produit avec la même couleur est déjà présent
        /*
        Erreur avec findIndex , revoir le type de saveProductLocalStorage
        
        
        */
        else {
            const sameColorId = (s) => s.colors === productJson.colors && s._id === productJson._id;
            let index = saveProductLocalStorage.findIndex(sameColorId);
            // Si déjà présent on modifie la quantité
            if (index !== -1) {
                modifyProductLocalStorage(index);
                console.log(productJson);
            }
            // Sinon ajout du produit
            else {
                addProductLocalStorage();
                console.log("Ajout du produit");
                console.log(productJson);
            }
        }
    }
}

let addCart = document.getElementById("addToCart");
addCart.addEventListener('click', (event) => {
    createProduct()
});

