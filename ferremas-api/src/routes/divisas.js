const express = require('express');
const router = express.Router();
const { obtenerDolarActual } = require('../services/bancoCentral');

// GET /api/divisas/dolar -> Devuelve el valor actual del dólar en pesos chilenos
router.get('/dolar', async (req, res) => {
    try {
        const valorDolar = await obtenerDolarActual();

        return res.status(200).json({
            moneda: "USD",
            valor_clp: valorDolar,
            fecha_actualizacion: new Date().toISOString()
        });
    } catch (error) {
        return res.status(503).json({ error: "Servicio de conversión temporalmente no disponible." });
    }
});

module.exports = router;