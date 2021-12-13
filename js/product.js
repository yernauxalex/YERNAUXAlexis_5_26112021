(async () => {
    // Gestion du localStorage    
    // Création d'un produit
    let createProduct = () => {
        // Récupération de l'id dans l'url de la page
        let idProduct = new URL(window.location.href).searchParams.get('id')
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
            }

            // Vérification si le produit avec la même couleur est déjà présent
            else {
                const sameColorId = (s) => s.colors === productJson.colors && s._id === productJson._id;
                let index = saveProductLocalStorage.findIndex(sameColorId)

                // Si déjà présent on modifie la quantité
                if (index !== -1) {
                    modifyProductLocalStorage(index);
                }
                // Sinon ajout du produit
                else {
                    addProductLocalStorage();
                }
            }
        }
    }

    try {
        let data = await fetchProduct();
        (displayproduct = () => {
            // Récupération de l'id dans l'url de la page
            let idProduct = new URL(window.location.href).searchParams.get('id')
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

        let addCart = document.getElementById("addToCart");
        addCart.addEventListener('click', (event) => {
            createProduct()
        });
    }
    catch (error) {
        console.error(error);
    }
})()

