import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
    const { usuario, logout } = useContext(AuthContext);
    const { totalItems } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="w-full font-sans">
            {/* Topbar */}
            <div className="bg-black text-white text-xs py-1.5 px-4 flex justify-between items-center">
                <span className="font-semibold tracking-wide">🚚 Despacho gratis por compras sobre $50.000</span>
                <div className="space-x-5 hidden sm:block">
                    <Link to="/contacto" className="hover:text-amber-400 transition-colors">Centro de Ayuda</Link>
                    <a href="#" className="hover:text-amber-400 transition-colors">Sigue tu pedido</a>
                </div>
            </div>

            {/* Navbar Principal */}
            <div className="bg-purple-900 text-white py-4 px-6 shadow-md">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-5">

                    <Link to="/" className="text-3xl font-black tracking-widest text-amber-400 hover:scale-105 transition-transform">
                        FERREMAS<span className="text-white">.</span>
                    </Link>

                    <div className="flex-grow max-w-2xl w-full flex shadow-sm">
                        <input
                            type="text"
                            placeholder="¿Qué herramienta o material buscas hoy?"
                            className="w-full py-2.5 px-4 rounded-l-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <button className="bg-amber-500 hover:bg-amber-600 text-black px-6 font-extrabold rounded-r-md transition-colors">
                            Buscar
                        </button>
                    </div>

                    <div className="flex items-center space-x-7">
                        {usuario ? (
                            <div className="flex items-center space-x-3 bg-purple-800 py-1.5 px-3 rounded-lg border border-purple-700 shadow-inner">
                                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black font-black text-sm uppercase">
                                    {usuario.nombre.charAt(0)}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-xs font-bold text-amber-400 leading-tight">Hola, {usuario.nombre.split(' ')[0]}</span>
                                    <button onClick={handleLogout} className="text-[10px] text-gray-300 hover:text-white transition-colors text-left font-semibold">
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="flex flex-col items-center hover:text-amber-400 transition-colors group">
                                <svg className="w-7 h-7 mb-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                <span className="text-xs font-bold">Iniciar Sesión</span>
                            </Link>
                        )}

                        <Link to="/carrito" className="flex flex-col items-center hover:text-amber-400 transition-colors relative group">
                            <svg className="w-7 h-7 mb-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            <span className="text-xs font-bold">Mi Carrito</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-2 bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md border border-purple-900">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Submenú Inferior */}
            <div className="bg-purple-950 text-gray-300 text-sm py-2 px-6 shadow-sm hidden md:block border-b border-purple-800">
                <div className="container mx-auto flex space-x-8">
                    <span className="font-bold text-white cursor-pointer flex items-center hover:text-amber-400 transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        Todas las Categorías
                    </span>

                    {/* RENDERIZADO CONDICIONAL POR ROL (ADMIN O BODEGUERO) */}
                    {(usuario?.id_rol === 1 || usuario?.id_rol === 4) && (
                        <Link to="/inventario" className="text-amber-400 font-black flex items-center animate-pulse hover:text-white transition-colors">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                            GESTIÓN DE BODEGA
                        </Link>
                    )}

                    <span className="cursor-pointer hover:text-amber-400 transition-colors">Herramientas Eléctricas</span>
                    <span className="cursor-pointer hover:text-amber-400 transition-colors">Herramientas Manuales</span>
                    <span className="cursor-pointer hover:text-amber-400 transition-colors">Fijaciones y Adhesivos</span>
                </div>
            </div>
        </header>
    );
};

export default Header;