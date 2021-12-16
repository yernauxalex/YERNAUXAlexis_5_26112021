(async () => {
    // Définition des variables pour les fonctions
    let data, productLocalStorage, contactLocalStorage;

    // Trouve l'objet correspondant à l'id dans le localStorage
    let findObject = id => {
        return data.find(data => data._id === id)
    }
    // Affiche tout les produits présent dans le panier
    let products = [];
    let showCart = () => {
        if (localStorage.getItem('product')) {
            productLocalStorage.forEach((print, i) => {
                let id = productLocalStorage[i]._id;
                let productObject = findObject(id);
                let price = productObject.price * parseInt(productLocalStorage[i].qty);

                // Stockage des id produits présent dans le panier pour la requête POST
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
                        </article>`;
            })
        }
        totalcost();
    };

    // Afficher le coût total et le nombre d'objet du panier
    let totalcost = () => {
        let sumProduct = 0;
        let sumPrice = 0;
        let totalQuantity = document.getElementById('totalQuantity');
        let totalPrice = document.getElementById('totalPrice');

        if (localStorage.getItem('product')) {
            productLocalStorage.forEach((item, k) => {
                let myItemTotal = findObject(productLocalStorage[k]._id);

                let tempQuantity = parseInt(productLocalStorage[k].qty);
                sumProduct += tempQuantity;

                let tempPrice = parseInt(myItemTotal.price);
                sumPrice += tempPrice * tempQuantity;
            })
            totalQuantity.innerHTML = sumProduct;
            totalPrice.innerHTML = sumPrice;
        }
        else {
            if (!document.URL.includes("confirmation.html")) {
                totalQuantity.innerHTML = 0;
                totalPrice.innerHTML = 0;
            }
        }

    }

    // Supprimer un produit 
    let deleteProduct = () => {
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

                if (indexDom !== -1) {
                    // Suppression dans le localStorage
                    tempLocalStorage.splice(indexDom, 1);
                    localStorage.setItem("product", JSON.stringify(tempLocalStorage));
                    productLocalStorage = JSON.parse(localStorage.getItem("product"));
                    // Suppression du cart dans le DOM
                    let cart = document.getElementById("cart__items");
                    cart.innerHTML = "";
                    // Appel des fonctions d'affichage et listeners
                    showCart();
                    modifyProduct();
                    deleteProduct();
                    // Suppression de "product" dans le localStorage s'il est vide
                    if (productLocalStorage == '') {
                        localStorage.removeItem("product");
                        products = [];
                    }
                }
                totalcost();
            })
        })
    };

    // Modifier la quantité d'un produit
    let modifyProduct = () => {
        // On stock les inputs à modifier pour la modification de quantité
        let inputContainer = [...document.getElementsByClassName("itemQuantity")];
        // On écoute chaque champ input
        inputContainer.forEach((item, i) => {
            item.addEventListener("change", () => {
                productLocalStorage = JSON.parse(localStorage.getItem("product"));
                // On modifie la quantité dans le localStorage et le DOM
                if (inputContainer[i].value > 100) {
                    inputContainer[i].value = 100;
                    alert("Ajout au panier impossible quantité maximale atteinte");
                }
                else {
                    productLocalStorage[i].qty = inputContainer[i].value;
                    localStorage.setItem("product", JSON.stringify(productLocalStorage));
                }
                // Calcul du nouveau prix
                let priceProduct = document.getElementsByClassName("priceProduct");
                let myItem = findObject(productLocalStorage[i]._id);
                let price = myItem.price * parseInt(productLocalStorage[i].qty);
                priceProduct[i].innerHTML = `${price} €`;
                totalcost();
            })
        })
    };

    // Vérification de la validité du prénom
    function validFirstName() {
        let tempFirstName = document.getElementById("firstName").value;
        let textStatus = document.getElementById("firstNameErrorMsg");
        // Regex
        let pattern = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
        let number = /^[a-zA-Z\-1-9]+$/;

        if (tempFirstName.match(pattern)) {
            textStatus.innerHTML = "Prénom valide";
            textStatus.style.color = "white";
            return tempFirstName;
        }
        else {
            if (tempFirstName.match(number)) {
                textStatus.innerHTML = "Les chiffres ne sont pas tolérés";
                textStatus.style.color = "#ff4a4a";
            }
            else {
                textStatus.innerHTML = "Merci de renseigner un prénom valide";
                textStatus.style.color = "#ff4a4a";
            }
        }
        if (tempFirstName == "") {
            textStatus.innerHTML = "";
        }
    };

    // Vérification de la validité du nom
    function validLastName() {
        let tempLastName = document.getElementById("lastName").value;
        let textStatus = document.getElementById("lastNameErrorMsg");
        // Regex
        let pattern = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
        let number = /^[a-zA-Z\-1-9]+$/;

        if (tempLastName.match(pattern)) {
            textStatus.innerHTML = "Nom valide";
            textStatus.style.color = "white";
            return tempLastName;
        }
        else {
            if (tempLastName.match(number)) {
                textStatus.innerHTML = "Les chiffres ne sont pas tolérés";
                textStatus.style.color = "#ff4a4a";
            }
            else {
                textStatus.innerHTML = "Merci de renseigner un nom valide";
                textStatus.style.color = "#ff4a4a";
            }
        }
        if (tempLastName == "") {
            textStatus.innerHTML = "";
        }
    };

    // Vérification de la validité de l'adresse postale
    function validAddress() {
        let tempAddress = document.getElementById("address").value;
        let textStatus = document.getElementById("addressErrorMsg");
        // Regex
        let pattern = /^[#.0-9a-z\s,-]+$/i;

        if (tempAddress.match(pattern)) {
            textStatus.innerHTML = "Adresse postale valide";
            textStatus.style.color = "white";
            return tempAddress;
        }
        else {
            textStatus.innerHTML = "Merci de renseigner une adresse valide";
            textStatus.style.color = "#ff4a4a";
        }
        if (tempAddress == "") {
            textStatus.innerHTML = "";
        }
    };

    // Vérification de la validité de la ville
    function validCity() {
        let tempCity = document.getElementById("city").value;
        let textStatus = document.getElementById("cityErrorMsg");
        // Regex
        let pattern = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/i;

        if (tempCity.match(pattern)) {
            textStatus.innerHTML = "Ville valide";
            textStatus.style.color = "white";
            return tempCity;
        }
        else {
            textStatus.innerHTML = "Merci de renseigner une ville valide";
            textStatus.style.color = "#ff4a4a";
        }
        if (tempCity == "") {
            textStatus.innerHTML = "";
        }
    };

    // Vérification de la validité de l'email
    function validMail() {
        let tempEmail = document.getElementById("email").value;
        let textStatus = document.getElementById("emailErrorMsg");
        // Regex
        let pattern = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;

        if (tempEmail.match(pattern)) {
            textStatus.innerHTML = "Adresse email valide";
            textStatus.style.color = "white";
            return tempEmail;
        }
        else {
            textStatus.innerHTML = "Merci de renseigner une adresse email valide";
            textStatus.style.color = "#ff4a4a";
        }
        if (tempEmail == "") {
            textStatus.innerHTML = "";
        }
    };

    // Création de l'objet contact et ajout dans le localStorage
    let createContact = () => {
        let orderButton = document.getElementById("order");
        orderButton.addEventListener("click", (e) => {
            e.preventDefault();
            if (validLastName() && validFirstName() && validMail() && validAddress() && validCity()) {
                let contact = {
                    firstName: validFirstName(),
                    lastName: validLastName(),
                    address: validAddress(),
                    city: validCity(),
                    email: validMail(),
                };

                if (!contactLocalStorage) {
                    (addContactLocalStorage = () => {
                        contactLocalStorage = [];
                        contactLocalStorage.push(contact);
                        localStorage.setItem("contact", JSON.stringify(contactLocalStorage));
                    })();
                }
                else {
                    (modifyContactLocalStorage = () => {
                        contactLocalStorage = contact;
                        localStorage.setItem("contact", JSON.stringify(contactLocalStorage));
                    })()
                }

                // Requête POST vers l'API
                let toSend = {
                    contact,
                    products,
                };
                const promise = fetch("http://localhost:3000/api/products/order", {
                    method: "POST",
                    body: JSON.stringify(toSend),
                    headers: {
                        "Content-type": "application/json",
                    },
                });

                //Traitement de la réponse de l'API
                promise.then(async (response) => {
                    try {
                        let content = await response.json();
                        if (response.ok && productLocalStorage) {
                            window.location = `../html/confirmation.html?id=${content.orderId}`;
                            localStorage.clear();
                        }
                        else {
                            console.log(response.status);
                        }
                    }
                    catch (error) {
                        console.error(error);
                    }
                })
            }
        });
    };

    // Gestion du formulaire de commande
    let validContact = () => {
        addEventListener("change", () => {
            validFirstName();
            validLastName();
            validAddress();
            validCity();
            validMail();
            createContact();
        })
    };

    try {
        data = await fetchProduct();
        productLocalStorage = JSON.parse(localStorage.getItem("product"));
        contactLocalStorage = JSON.parse(localStorage.getItem("contact"));

        showCart();
        deleteProduct();
        modifyProduct();
        validContact();

        //Affichage de l'id de la commande dans la page confirmation
        if (document.URL.includes("confirmation.html")) {
            let orderId = new URL(window.location.href).searchParams.get("id");
            document.getElementById("orderId").innerHTML = orderId;
        }
    }
    catch (error) {
        console.error(error);
    }
})();