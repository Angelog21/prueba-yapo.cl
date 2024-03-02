const axios = require('axios');

const globalVariables = require('./variables.json');

//Se declara la funcion a usar para obtener los datos necesarios
const getInmueblePrice = async ( id ) => {
    try {

        const instance = axios.create({
            headers: {
                'Origin': globalVariables.INFOCASAS_ORIGIN_URL,
                'X-Origin': globalVariables.INFOCASAS_XORIGIN_URL,
            }
        });
    

        const response = await instance.post(globalVariables.INFOCASAS_GRAPHQL_URL,
            [
                {
                    "operationName":"getProperty",
                    "variables":{"propertyId":id},
                    "query":
                    `query getProperty( $propertyId: ID! ) { 
                        property( id: $propertyId ) { 
                            id, 
                            title, 
                            price {
                                amount, 
                                currency {
                                    name
                                }
                            } 
                        }
                    }`
                }
            ]
        );

        //Se valida si el servicio responde con el objeto data
        if ( !response.data ) {
            return "No se ha recibido la data del servicio.";
        }

        let { property } = response.data[0].data;

        //Se retorna en caso de que el objeto property no tenga contenido
        if( !property ) {
            return "No se ha encontrado el inmueble solicitado.";
        }
        
        //Se retorna el titulo de la propiedad, el precio y la moneda
        return `El precio de la propiedad\x1b[33m ${property.title}\x1b[0m es:\x1b[32m ${property.price?.currency?.name} ${property.price?.amount} \x1b[0m`

    } catch ( error ) {

        throw new Error(error.message)

    }
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
