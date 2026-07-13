const express = require('express');
const router = express.Router();
const axios = require('axios');

// 1. Credenciales oficiales de Integración (Pruebas) de Transbank
const TBK_API_KEY_ID = '597055555532';
const TBK_API_KEY_SECRET = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
const TBK_URL_BASE = 'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions';

// 2. Configuración de cabeceras de seguridad requeridas por el banco
const headers = {
    'Tbk-Api-Key-Id': TBK_API_KEY_ID,
    'Tbk-Api-Key-Secret': TBK_API_KEY_SECRET,
    'Content-Type': 'application/json'
};

// POST /api/pagos/iniciar
router.post('/iniciar', async (req, res) => {
    try {
        const { ordenCompra, sessionId, monto } = req.body;

        if (!ordenCompra || !sessionId || !monto || monto <= 0) {
            return res.status(400).json({ error: "Datos incompletos para procesar el pago." });
        }

        const returnUrl = 'http://localhost:3000/api/pagos/confirmar';

        // 3. Llamada DIRECTA a la API de Transbank (Bypass al SDK)
        const payload = {
            buy_order: ordenCompra,
            session_id: sessionId,
            amount: monto,
            return_url: returnUrl
        };

        const response = await axios.post(TBK_URL_BASE, payload, { headers });

        return res.status(200).json({
            url: response.data.url,
            token: response.data.token
        });

    } catch (error) {
        console.error("❌ Error API Transbank (Iniciar):", error.response?.data || error.message);
        return res.status(500).json({ error: "No se pudo inicializar Webpay directamente." });
    }
});

// POST /api/pagos/confirmar
router.post('/confirmar', async (req, res) => {
    try {
        let token_ws = req.body.token_ws || req.query.token_ws;

        // Si el usuario canceló la transacción en la web del banco
        if (req.body.TBK_TOKEN || req.query.TBK_TOKEN || !token_ws) {
            return res.redirect('http://localhost:5173/pago/resultado?status=cancelado');
        }

        // 4. Confirmación DIRECTA a la API (Se utiliza el método PUT según documentación oficial)
        const commitUrl = `${TBK_URL_BASE}/${token_ws}`;
        const response = await axios.put(commitUrl, {}, { headers });

        const commitResponse = response.data;

        // response_code === 0 significa que los fondos fueron retenidos y el pago es exitoso
        if (commitResponse.response_code === 0) {
            return res.redirect(`http://localhost:5173/pago/resultado?status=exito&monto=${commitResponse.amount}&orden=${commitResponse.buy_order}&auth=${commitResponse.authorization_code}`);
        } else {
            return res.redirect('http://localhost:5173/pago/resultado?status=rechazado');
        }

    } catch (error) {
        console.error("❌ Error API Transbank (Confirmar):", error.response?.data || error.message);
        return res.redirect('http://localhost:5173/pago/resultado?status=error');
    }
});

module.exports = router;