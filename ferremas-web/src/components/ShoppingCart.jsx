import { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ShoppingCart = () => {
    // Extraemos todo lo necesario del contexto global
    const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useContext(CartContext);
    const [cargandoPago, setCargandoPago] = useState(false);
    const [error, setError] = useState(null);

    const costoDespacho = subtotal > 50000 ? 0 : 4990; // Despacho gratis sobre $50.000
    const totalCLP = subtotal + costoDespacho;

    const iniciarPagoWebpay = async () => {
        if (cart.length === 0) return;
        setCargandoPago(true);
        setError(null);
        try {
            const payload = {
                ordenCompra: `ORD-${Math.floor(Math.random() * 10000)}`,
                sessionId: `SESS-${Date.now()}`,
                monto: totalCLP
            };

            const response = await axios.post('http://localhost:3000/api/pagos/iniciar', payload);
            const { url, token } = response.data;

            const form = document.createElement('form');
            form.action = url;
            form.method = 'POST';

            const inputToken = document.createElement('input');
            inputToken.type = 'hidden';
            inputToken.name = 'token_ws';
            inputToken.value = token;

            form.appendChild(inputToken);
            document.body.appendChild(form);
            form.submit();
        } catch (err) {
            setError("Error al iniciar pago. Verifica el servidor.");
            setCargandoPago(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-4xl mx-auto mt-12 text-center bg-white p-12 rounded-lg shadow-sm border border-gray-200">
                <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <h2 className="text-2xl font-black text-gray-700 mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-500 mb-6">Parece que aún no has agregado herramientas a tu proyecto.</p>
                <Link to="/" className="inline-block bg-purple-900 text-white font-bold py-3 px-8 rounded shadow-md hover:bg-purple-800 transition-colors">
                    Ir al Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-6">
            <div className="flex justify-between items-center mb-8 border-b-2 border-gray-200 pb-4">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-wide flex items-center">
                    <svg className="w-8 h-8 mr-3 text-purple-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    Tu Carrito ({totalItems})
                </h2>
                <Link to="/" className="text-purple-700 font-bold hover:text-amber-500 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Seguir comprando
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Columna Izquierda: Lista Dinámica */}
                <div className="md:w-2/3 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    {cart.map((item) => (
                        <div key={item.sku} className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                            <div className="flex items-center gap-4 w-1/2">
                                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
                                </div>
                                <div>
                                    <h3 className="text-md font-bold text-gray-800 line-clamp-2 leading-tight">{item.nombre}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{item.marca} | SKU: {item.sku}</p>
                                </div>
                            </div>

                            {/* Controles de Cantidad */}
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md">
                                <button onClick={() => updateQuantity(item.sku, -1)} className="px-3 py-1 text-gray-600 hover:bg-gray-200 font-bold">-</button>
                                <span className="px-3 text-sm font-semibold">{item.cantidad}</span>
                                <button onClick={() => updateQuantity(item.sku, 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-200 font-bold">+</button>
                            </div>

                            <div className="flex flex-col items-end w-1/4">
                                <span className="text-lg font-black text-purple-900">${(item.precio_actual * item.cantidad).toLocaleString('es-CL')}</span>
                                {/* Botón de Eliminar */}
                                <button onClick={() => removeFromCart(item.sku)} className="text-xs text-red-500 hover:text-red-700 font-bold mt-1 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    Quitar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Columna Derecha: Resumen de Compra Dinámico */}
                <div className="md:w-1/3">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 sticky top-8">
                        <h3 className="text-xl font-black mb-6 text-gray-800 border-b-2 border-gray-100 pb-2">Resumen</h3>

                        <div className="space-y-4 text-sm text-gray-600 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span className="font-semibold">${subtotal.toLocaleString('es-CL')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Despacho a domicilio:</span>
                                <span className="font-semibold text-green-600">{costoDespacho === 0 ? '¡Gratis!' : `$${costoDespacho.toLocaleString('es-CL')}`}</span>
                            </div>
                            <div className="flex justify-between items-center text-xl font-black text-gray-900 pt-4 border-t-2 border-gray-100">
                                <span>Total:</span>
                                <span className="text-amber-500">${totalCLP.toLocaleString('es-CL')}</span>
                            </div>
                        </div>

                        {error && <p className="text-xs text-red-500 font-bold mb-3 text-center bg-red-50 p-2 rounded">{error}</p>}

                        <button
                            onClick={iniciarPagoWebpay}
                            disabled={cargandoPago}
                            className={`w-full font-extrabold py-4 px-4 rounded-md text-white transition-all shadow-md flex justify-center items-center text-lg ${cargandoPago ? 'bg-gray-400 cursor-wait' : 'bg-green-600 hover:bg-green-700 active:scale-95'
                                }`}
                        >
                            {cargandoPago ? 'Conectando con el Banco...' : 'Pagar con Webpay'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;