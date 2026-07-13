const axios = require('axios');

const obtenerDolarActual = async () => {
    try {
        // Consumimos la API pública que replica los datos del Banco Central
        const response = await axios.get('https://mindicador.cl/api/dolar');

        // Extraemos el valor más reciente (el índice 0 de la serie)
        const valorActual = response.data.serie[0].valor;
        return valorActual;
    } catch (error) {
        console.error("Error crítico al obtener el valor del dólar:", error.message);
        // Retornamos un fallback razonable en caso de que la API externa se caiga (ej. 950 CLP)
        return 950;
    }
};

module.exports = { obtenerDolarActual };