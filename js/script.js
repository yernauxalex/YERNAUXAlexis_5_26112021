(async () => {
    try {
        console.log(localStorage)
        //On récupère les données de l'api pour les stocker dans le localStorage si elles n'y sont pas présentes
        if (!localStorage.getItem("inventory")){
            console.log("Accès à l'api");
            let response = await fetch ("http://localhost:3000/api/products");
            let inventoryRaw = await response.json();
            localStorage.setItem('inventory', JSON.stringify(inventoryRaw));
        }
        let data = await JSON.parse(localStorage.getItem("inventory"));
        // Fonction qui affiche le contenu du localStorage
        (showProduct = () => {
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
        })()
    }
    catch (error){
        console.error(error);
    }
})()