async function fetchProduct() {
    console.log(localStorage)
    //On récupère les données de l'api pour les stocker dans le localStorage si elles n'y sont pas présentes
    if (!localStorage.getItem("inventory")) {
        console.log("Accès à l'api");
        const response = await fetch("http://localhost:3000/api/products");
        const inventoryRaw = await response.json();
        localStorage.setItem('inventory', JSON.stringify(inventoryRaw));
    }
    const data = await JSON.parse(localStorage.getItem("inventory"));
    return data;
};
