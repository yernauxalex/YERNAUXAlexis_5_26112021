/*  If localStorage[inventory].length > 1 
        on récupère l'inventaire dans le localstorage
    else 
        async getInventory () {
            try {
                localStorage[inventory] = await fetch ('url') 
            }
            catch (e){
                console.error('')
            }
        }
    
        affichage de l'inventaire()
*/ 


fetch("http://localhost:3000/api/products")
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then((data) => {
        // Affiche tout les produits contenu dans l'API grâce à forEach
        (function() {
            let items = document.getElementById("items");
            data.forEach((print, p) => {
                items.innerHTML += `
                <a href="./product.html?id=${data[p]._id}">
                    <article>
                    <img src="${data[p].imageUrl}" alt="${data[p].altTxt}"></img>
                    <h3 class="productName">${data[p].name}</h3>
                    <p class="productDescription">${data[p].description}</p></>
                </article>
            </a>`;
            });
        })();
    })
    .catch(function (err) {
        console.error("Erreur d'accès à l'API");
    });

