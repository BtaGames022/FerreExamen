const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
// Agregamos soporte para formularios URL-encoded (Requerido por Transbank)
app.use(express.urlencoded({ extended: true }));

// Importación de las rutas
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const divisasRoutes = require('./routes/divisas');
const pagosRoutes = require('./routes/pagos');

// Asignación de prefijos a las rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/divisas', divisasRoutes);
app.use('/api/pagos', pagosRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ estado: 'OK', mensaje: 'API de FERREMAS funcionando correctamente 🚀' });
});

module.exports = app;