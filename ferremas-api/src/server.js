require('dotenv').config();
const app = require('./app');

// Aquí conectamos el motor de la base de datos al arrancar
require('./config/database');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});