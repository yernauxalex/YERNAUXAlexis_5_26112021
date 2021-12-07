(async () => {
    try{
        //On récupère les données de l'api pour les stocker dans le localStorage si elles n'y sont pas présentes    
        if (!localStorage.getItem("inventory")){
            console.log("Accès à l'api");
            let response = await fetch ("http://localhost:3000/api/products");
            let inventoryRaw = await response.json();
            localStorage.setItem("inventory", JSON.stringify(inventoryRaw));
        }
        let data = await JSON.parse(localStorage.getItem("inventory"));
        let productLocalStorage = JSON.parse(localStorage.getItem("product"));
        console.log(productLocalStorage);  

        // Trouve l'objet correspondant à l'id dans le localStorage
        let findObject = id => {
            return data.find(data => data._id === id)
        }
        // Affiche tout les produits présent dans le panier
        let products = [];
        (showCart = () => {
            productLocalStorage.forEach((print, i) => {
                let id = productLocalStorage[i]._id;
                let productObject = findObject(id);
                let price = productObject.price * parseInt(productLocalStorage[i].qty);
                
                // Stockage des id produits présent dans le panier
                let productsId = [productLocalStorage[i]._id];
                products.push(productsId);

                // Insertion dans la page 
                let cart = document.getElementById("cart__items");
                cart.innerHTML += `
                        <article class="cart__item" data-id="${productLocalStorage[i]._id}" data-color="${productLocalStorage[i].colors}">
                            <div class="cart__item__img">
                                <img src="${productObject.imageUrl}" alt="${productObject.altTxt}">
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <h2>${productObject.name}</h2>
                                    <p>${productLocalStorage[i].colors}</p>
                                    <p class="priceProduct">${price}€</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Qté : </p>
                                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productLocalStorage[i].qty}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                            </div>
                        </article>`
            })
        })();

        // Supprimer un produit 
        (deleteProduct = () => {
            let tempLocalStorage = productLocalStorage;
            // On stock les boutons supprimer dans un tableau
            let deleteButton = [...document.getElementsByClassName("deleteItem")];
			let deleteItem = [...document.getElementsByClassName("cart__item")];
			
            // On écoute chaque bouton supprimer
            deleteButton.forEach((item, i) => {
                item.addEventListener("click", () => {
                    // On cherche l'index de l'objet en comparant sa couleur et son id
                    let indexDom = productLocalStorage.findIndex((k) => 
                        k.colors === deleteItem[i].dataset.color &&
                        k._id === deleteItem[i].dataset.id
                    );
                    console.log(deleteItem[i].dataset)
                    console.log(deleteItem[i].dataset.color)
                    console.log('Index dans le dom')
                    console.log(indexDom)
                    if (indexDom !== -1) {
                        // Suppression dans le localStorage
                        tempLocalStorage.splice(indexDom, 1);
                        localStorage.setItem("product", JSON.stringify(tempLocalStorage));
                        // Suppression dans le DOM
                        deleteItem[i].remove();
                        // Suppression de "product" dans le localStorage s'il est vide
                        if (productLocalStorage == '') {
                            localStorage.removeItem("product");
                            products = [];
                        }
                    }
                })
            })
        })();

        // Modifier la quantité d'un produit
        (modifyProduct = () => {
            // On stock les inputs à modifier
            let inputContainer = [...document.getElementsByClassName("itemQuantity")];
            // On écoute chaque champ input
            inputContainer.forEach((item, i) => {
                item.addEventListener("change", () => {
                    console.log('écoute du bouton')
                    // On modifie la quantité dans le localStorage et le DOM
                    if (inputContainer[i].value > 100) {
                        inputContainer[i].value = 100;
                        console.log("Quantité maximale atteinte");
                    }
                    else {
                        productLocalStorage[i].qty = inputContainer[i].value;
                        localStorage.setItem("product", JSON.stringify(productLocalStorage));
                    }
                    // Calcul du nouveau prix
                    (newPrice = () => {
                        let priceProduct = document.getElementsByClassName("priceProduct");
                        let myItem = findObject(productLocalStorage[i]._id);
                        let price = myItem.price * parseInt(productLocalStorage[i].qty);
                        priceProduct[i].innerHTML = `${price} €`;
                    })()
                })
            })
        })();
        /*
        (totalcost = () => {

        })()*/
    }
    catch (error){
        console.error(error);
    }
})()

/*
let products = [];
fetch("http://localhost:3000/api/products")
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then((data) => {
        // Trouve l'objet correspondant à l'id via l'api
        let findObject = id => {
            let i = 0;
            while (i <= data.length) {
                if (data[i]._id === id) {
                    return data[i];
                    break;
                }
                i++;
            }
        }

        // Affiche tout les produits présent dans le panier
        let showCart = () => {
            for (let i in productLocalStorage) {
                let id = productLocalStorage[i]._id;
                let productObject = findObject(id);
                let price = productObject.price * parseInt(productLocalStorage[i].qty);
                
                // Stockage des id produits
                let productsId = [productLocalStorage[i]._id];
                products.push(productsId);

                // Insertion dans la page 
                let cart = document.getElementById("cart__items");
                cart.innerHTML += `
                        <article class="cart__item" data-id="${productLocalStorage[i]._id}" data-color="${productLocalStorage[i].colors}">
                            <div class="cart__item__img">
                                <img src="${productObject.imageUrl}" alt="${productObject.altTxt}">
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <h2>${productObject.name}</h2>
                                    <p>${productLocalStorage[i].colors}</p>
                                    <p>${price}€</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Qté : </p>
                                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productLocalStorage[i].qty}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                            </div>
                        </article>`
            }
        }

        // Supprimer un produit 
        let deleteProduct = () => {
            
        }

        // Modifier la quantité d'un produit 
        let modifyProduct = () => {

        }

        let totalcost = () => {

        }

        showCart();
        // deleteProduct();
        // modifyProduct();
        // totalcost();
    })
    .catch(function (err) {
        console.error("Erreur d'accès à l'API");
    });
*/
