
fetch("http://localhost:3000/api/products")
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then((data) => {
        // Affiche tout les produits contenu dans l'API grâce à une boucle
        (function() {
            let items = document.getElementById("items");
            //cf méthode foreach
            for (let p in data) {
                items.innerHTML += `
                <a href="./product.html?id=${data[p]._id}">
                    <article>
                    <img src="${data[p].imageUrl}" alt="${data[p].altTxt}"></img>
                    <h3 class="productName">${data[p].name}</h3>
                    <p class="productDescription">${data[p].description}</p></>
                </article>
            </a>`;
            }
        })();
    })
    .catch(function (err) {
        console.error("Erreur d'accès à l'API");
    });

