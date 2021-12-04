console.log(localStorage)


// On vérifie si les données de l'api sont déjà présentes dans le localStorage
if (localStorage.getItem("inventory")){
    let data = []; 
    data = JSON.parse(localStorage.getItem("inventory"));
    console.log("Inventaire présent dans localStorage");
    console.log(localStorage);
    let showProduct= () => {
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
    }
    showProduct();
    /*(function() {
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
    })();*/
}
else {
    // On récupère les données de l'api pour les stocker dans le localStorage
    console.log("Tentative de connexion à l'api");
    (async () => {
        try {
            console.log("Before")
            let response = await fetch ("http://localhost:3000/api/products");
            let inventoryRaw = await response.json();
            localStorage.setItem('inventory', JSON.stringify(inventoryRaw));
            //Revoir l'appel de fonction lors du 1er chargement de la page 
            await showProduct();
        }
        catch (e){
            console.error("Erreur d'accès à l'API");
        }
    })()

}


//Partie fonctionnelle mais pas opti car appel de l'api à chaque actualisation de la page
/*
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
    });*/

