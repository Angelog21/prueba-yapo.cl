const axios = require('axios');
const cheerio = require('cheerio');

const getInmueblePrice = async ( id ) => {
    const response = await axios.get(`https://www.infocasas.com.uy/property/${id}`);

    const $ = cheerio.load(response.data);
    
    // Selecciona el elemento span con clase 'price'
    const priceElement = $('.price');
    if (!priceElement || !priceElement.text()){
        throw new Error("No se ha encontrado el precio.");
    }

    // Extrae el texto y limpia los espacios en blanco alrededor
    const priceText = priceElement.text().trim();
    
    // se elimina la coma
    const priceDefinitive = priceText.replace(",",'');

    return `${priceDefinitive}`;
};

// Se comprueba si hay parámetros ingresados
if (process.argv.length < 3) {
    console.log("Falta un parámetro, por favor use el comando: node index2.js [ID_PROPIEDAD]");
    process.exit(1);
}

// Se obtiene el parámetro id del input
const id = process.argv[2];

getInmueblePrice( id ).then( res => {
    console.log(res);
}).catch(err => {
    console.log("Error",err);
})