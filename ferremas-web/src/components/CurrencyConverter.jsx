import { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyConverter = ({ precioCLP }) => {
    const [valorDolar, setValorDolar] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchDolar = async () => {
            try {
                // Consumimos nuestra propia API que ya está conectada a mindicador.cl
                const response = await axios.get('http://localhost:3000/api/divisas/dolar');
                setValorDolar(response.data.valor_clp);
            } catch (error) {
                console.error("Error al obtener el dólar:", error);
                setValorDolar(950); // Fallback en caso de error
            } finally {
                setCargando(false);
            }
        };

        fetchDolar();
    }, []);

    if (cargando) return <span className="text-xs text-gray-400 animate-pulse">Calculando USD...</span>;

    const precioUSD = (precioCLP / valorDolar).toFixed(2);

    return (
        <span className="text-sm font-semibold text-gray-500">
            Aprox. <span className="text-green-600">US$ {precioUSD}</span>
        </span>
    );
};

export default CurrencyConverter;