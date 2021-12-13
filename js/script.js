(async () => {
    try {
        let data = await fetchProduct();
        console.log(data);
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
        })();
    }
    catch (error) {
        console.error(error);
    }
})()