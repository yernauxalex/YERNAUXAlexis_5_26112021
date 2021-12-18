(async () => {
    // Fonction qui affiche le contenu du localStorage
    showProduct = (data) => {
        const items = document.getElementById("items");
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
        let data = await fetchProduct();
        showProduct(data);
    }
    catch (error) {
        console.error(error);
    }
})()