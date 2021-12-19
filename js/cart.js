(async () => {
    // Trouve l'objet correspondant à l'id dans le localStorage
    const findObject = (id, data) => {
        return data.find(data => data._id === id)
    }
    // Affiche tout les produits présent dans le panier
    let showCart = (data, productLocalStorage, products) => {
        if (localStorage.getItem('product')) {
            productLocalStorage.forEach((print) => {
                const id = print._id;
                const productObject = findObject(id, data);
                const price = productObject.price * parseInt(print.qty);

                // Stockage des id produits présent dans le panier pour la requête POST
                const productsId = [print._id];
                products.push(productsId);

                // Insertion dans la page 
                const cart = document.getElementById("cart__items");
                cart.innerHTML += `
                        <article class="cart__item" data-id="${print._id}" data-color="${print.colors}">
                            <div class="cart__item__img">
                                <img src="${productObject.imageUrl}" alt="${productObject.altTxt}">
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <h2>${productObject.name}</h2>
                                    <p>${print.colors}</p>
                                    <p class="priceProduct">${price}€</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Qté : </p>
                                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${print.qty}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                            </div>
                        </article>`;
            })
        }
        totalcost(data, productLocalStorage);
    };

    // Afficher le coût total et le nombre d'objet du panier
    let totalcost = (data, productLocalStorage) => {
        let sumProduct = 0;
        let sumPrice = 0;
        const totalQuantity = document.getElementById('totalQuantity');
        const totalPrice = document.getElementById('totalPrice');

        if (localStorage.getItem('product')) {
            productLocalStorage.forEach((item) => {
                const myItemTotal = findObject(item._id, data);

                const tempQuantity = parseInt(item.qty);
                sumProduct += tempQuantity;

                const tempPrice = parseInt(myItemTotal.price);
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
    let deleteProduct = (data, productLocalStorage, products) => {
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
                    showCart(data, productLocalStorage, products);
                    modifyProduct(data, productLocalStorage);
                    deleteProduct(data, productLocalStorage, products);
                    // Suppression de "product" dans le localStorage s'il est vide
                    if (productLocalStorage == '') {
                        localStorage.removeItem("product");
                        products = [];
                    }
                }
                totalcost(data, productLocalStorage);
            })
        })
    };

    // Modifier la quantité d'un produit
    let modifyProduct = (data, productLocalStorage) => {
        // On stock les inputs à modifier pour la modification de quantité
        const inputContainer = [...document.getElementsByClassName("itemQuantity")];
        // On écoute chaque champ input
        inputContainer.forEach((item, i) => {
            item.addEventListener("change", () => {
                productLocalStorage = JSON.parse(localStorage.getItem("product"));
                // On modifie la quantité dans le localStorage et le DOM
                if (item.value > 100) {
                    item.value = 100;
                    alert("Ajout au panier impossible quantité maximale atteinte");
                }
                else {
                    productLocalStorage[i].qty = item.value;
                    localStorage.setItem("product", JSON.stringify(productLocalStorage));
                }
                // Calcul du nouveau prix
                const priceProduct = document.getElementsByClassName("priceProduct");
                const myItem = findObject(productLocalStorage[i]._id, data);
                const price = myItem.price * parseInt(productLocalStorage[i].qty);
                priceProduct[i].innerHTML = `${price} €`;
                totalcost(data, productLocalStorage);
            })
        })
    };

    // Vérification de la validité du prénom
    function validFirstName() {
        const tempFirstName = document.getElementById("firstName").value;
        const textStatus = document.getElementById("firstNameErrorMsg");
        // Regex
        const pattern = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
        const number = /^[a-zA-Z\-1-9]+$/;

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
        const tempLastName = document.getElementById("lastName").value;
        const textStatus = document.getElementById("lastNameErrorMsg");
        // Regex
        const pattern = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
        const number = /^[a-zA-Z\-1-9]+$/;

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
        const tempAddress = document.getElementById("address").value;
        const textStatus = document.getElementById("addressErrorMsg");
        // Regex
        const pattern = /^[#.0-9a-z\s,-]+$/i;

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
        const tempCity = document.getElementById("city").value;
        const textStatus = document.getElementById("cityErrorMsg");
        // Regex
        const pattern = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/i;

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
        const tempEmail = document.getElementById("email").value;
        const textStatus = document.getElementById("emailErrorMsg");
        // Regex
        const pattern = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;

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

    // Création de l'objet contact 
    let createContact = () => {
        if (validLastName() && validFirstName() && validMail() && validAddress() && validCity()) {
            const contact = {
                firstName: validFirstName(),
                lastName: validLastName(),
                address: validAddress(),
                city: validCity(),
                email: validMail(),
            };
            return contact;
        }
    };

    // Ajout du contact dans le localStorage
    let addContactLocalStorage = (contactLocalStorage, contact) => {
        if (!contactLocalStorage) {
            contactLocalStorage = [];
            contactLocalStorage.push(contact);
            localStorage.setItem("contact", JSON.stringify(contactLocalStorage));
            return contactLocalStorage;
        }
        contactLocalStorage = contact;
        localStorage.setItem("contact", JSON.stringify(contactLocalStorage));
        return contactLocalStorage;
    };

    // Requête POST vers l'API
    async function postApi(contact, products, productLocalStorage) {
        const toSend = {
            contact,
            products,
        };
        const response = await fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify(toSend),
            headers: {
                "Content-type": "application/json",
            },
        });

        // Traitement de la réponse de l'API
        const content = await response.json();
        if (response.ok && productLocalStorage) {
            window.location = `../html/confirmation.html?id=${content.orderId}`;
            localStorage.clear();
        }
        else {
            console.log(response.status);
        }
    };

    // Gestion du formulaire de commande
    let validButton = (productLocalStorage, contactLocalStorage, products) => {
        addEventListener("change", () => {
            const orderButton = document.getElementById("order");
            orderButton.addEventListener("click", (e) => {
                e.preventDefault();
                let contact = createContact();
                addContactLocalStorage(contactLocalStorage, contact);
                postApi(contact, products, productLocalStorage);
            })
        })
    };

    // Vérification de la validité des informations du formulaire
    let validContact = (productLocalStorage, contactLocalStorage) => {
        addEventListener("change", () => {
            validFirstName();
            validLastName();
            validAddress();
            validCity();
            validMail();
            createContact(productLocalStorage, contactLocalStorage);
        })
    };

    try {
        const data = await fetchProduct();
        const products = [];
        const productLocalStorage = JSON.parse(localStorage.getItem("product"));
        const contactLocalStorage = JSON.parse(localStorage.getItem("contact"));

        showCart(data, productLocalStorage, products);
        deleteProduct(data, productLocalStorage, products);
        modifyProduct(data, productLocalStorage);
        validContact(productLocalStorage, contactLocalStorage);
        validButton(productLocalStorage, contactLocalStorage, products);


        //Affichage de l'id de la commande dans la page confirmation
        if (document.URL.includes("confirmation.html")) {
            const orderId = new URL(window.location.href).searchParams.get("id");
            document.getElementById("orderId").innerHTML = orderId;
        }
    }
    catch (error) {
        console.error(error);
    }
})();