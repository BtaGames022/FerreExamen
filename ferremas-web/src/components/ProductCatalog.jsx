import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CurrencyConverter from './CurrencyConverter';
import { CartContext } from '../context/CartContext'; // Importamos el contexto del carrito

const ProductCatalog = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Extraemos la función de agregar al carro desde el contexto global
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/productos');
                setProductos(response.data);
                setCargando(false);
            } catch (err) {
                console.error("Error al cargar el catálogo:", err);
                setError("No se pudo conectar con el servidor de catálogo.");
                setCargando(false);
            }
        };
        fetchProductos();
    }, []);

    if (cargando) {
        return (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-900"></div>
                <p className="text-gray-600 font-semibold">Cargando inventario seguro...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 font-bold p-10 bg-red-50 rounded border border-red-200">{error}</div>;
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-6 border-b-2 border-gray-200 pb-2">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wide border-b-4 border-amber-400 inline-block -mb-[10px] pb-2">
                    Herramientas Destacadas
                </h2>
                <span className="text-sm text-gray-500 font-semibold">{productos.length} productos en stock</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productos.map((producto, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group relative">

                        {producto.stock < 20 && (
                            <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase rounded z-10 animate-pulse">
                                ¡Solo {producto.stock}!
                            </span>
                        )}

                        <div className="h-48 bg-gray-100 flex justify-center items-center relative overflow-hidden border-b border-gray-100">
                            <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm z-10 tracking-widest">
                                {producto.marca}
                            </span>
                            <svg className="w-24 h-24 text-gray-300 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                            <p className="text-[11px] text-gray-500 mb-1 font-mono">SKU: {producto.sku}</p>
                            <h3 className="text-md font-bold text-gray-800 leading-snug mb-1 line-clamp-2">
                                {producto.nombre}
                            </h3>
                            <p className="text-xs text-purple-700 font-semibold mb-4">{producto.categoria}</p>

                            <div className="mt-auto">
                                <div className="flex flex-col mb-4">
                                    <span className="text-2xl font-black text-purple-900 leading-none">
                                        ${Number(producto.precio_actual).toLocaleString('es-CL')}
                                    </span>
                                    <CurrencyConverter precioCLP={producto.precio_actual} />
                                </div>

                                {/* Botón Funcional conectado al Contexto */}
                                <button
                                    onClick={() => addToCart(producto)}
                                    className="w-full bg-amber-500 text-black font-extrabold py-2.5 rounded-md hover:bg-amber-600 active:scale-95 transition-all shadow-sm flex justify-center items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    Agregar al Carro
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductCatalog;