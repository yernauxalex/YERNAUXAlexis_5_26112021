(async () => {
    // Définition de variable pour la fonction
    let data;
    // Fonction qui affiche le contenu du localStorage
    showProduct = () => {
        let items = document.getElementById("items");
        data.forEach((print) => {
            items.innerHTML += `
            <a href="./product.html?id=${print._id}">
                <article>
                <img src="${print.imageUrl}" alt="${print.altTxt}"></img>
                <h3 class="productName">${print.name}</h3>
                <p class="productDescription">${print.description}</p></>
                </article>
            </a>`;
        });
    };
    try {
        data = await fetchProduct();
        showProduct();
    }
    catch (error) {
        console.error(error);
    }
})()