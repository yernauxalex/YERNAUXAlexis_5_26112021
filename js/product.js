// Récupération de l'id dans l'url de la page
let idProduct = new URL(window.location.href).searchParams.get('id')
console.log(idProduct);

fetch("http://localhost:3000/api/products")
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then((data) => {
        //Récupère les éléments correspondant à l'id du produit via l'api
        let i = 0;
        let img, name, price, description, altTxt, colors;
        while (i <= data.length) {
            if (data[i]._id === idProduct) {
                img = data[i].imageUrl;
                name = data[i].name;
                price = data[i].price;
                description = data[i].description;
                altTxt = data[i].altTxt;
                colors = data[i].colors;
                break;
            }
            else {
                i++;
            }
        }

        //Insertion des éléments dans la page
        let baliseImg = document.getElementsByClassName("item__img");
        baliseImg[0].innerHTML = `<img src="${img}" alt="${altTxt}">`;
        document.getElementById("title").innerHTML = name;
        document.getElementById("price").innerHTML = price;
        document.getElementById("description").innerHTML = description;
        console.log(colors)
        let selectColor = document.getElementById("colors");
        for (let k in colors) {
            selectColor.insertAdjacentHTML('beforeend', `<option value="${colors[k]}">${colors[k]}</option>`);
        }

    })
    .catch(function (err) {
        console.error("Erreur d'accès à l'API");
    });

