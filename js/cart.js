let productLocalStorage = JSON.parse(localStorage.getItem('product'));
console.log(productLocalStorage);

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

