import { useState } from 'react';
import { Link } from 'react-router-dom';

const Contacto = () => {
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        asunto: 'consulta',
        mensaje: ''
    });

    const [enviando, setEnviando] = useState(false);
    const [exito, setExito] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setEnviando(true);
        setExito(false);

        // Simulamos el tiempo de petición al servidor (1.5 segundos)
        setTimeout(() => {
            setEnviando(false);
            setExito(true);
            setForm({ nombre: '', email: '', asunto: 'consulta', mensaje: '' });
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            {/* Cabecera */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-purple-900 uppercase tracking-tight mb-4">
                    Centro de <span className="text-amber-500">Ayuda</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    ¿Tienes dudas sobre herramientas, necesitas cotizar por mayor o requieres soporte técnico? Nuestro equipo de vendedores expertos está listo para ayudarte.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Columna Izquierda: Información de Contacto */}
                <div className="lg:w-1/3 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-900">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                            Contacto Directo
                        </h3>
                        <div className="space-y-4 text-gray-600">
                            <p className="flex items-start">
                                <span className="font-bold mr-2 text-gray-800">Mesa Central:</span>
                                +56 2 2345 6789
                            </p>
                            <p className="flex items-start">
                                <span className="font-bold mr-2 text-gray-800">Ventas Empresa:</span>
                                ventas@ferremas.cl
                            </p>
                            <p className="flex items-start">
                                <span className="font-bold mr-2 text-gray-800">Soporte Web:</span>
                                soporte@ferremas.cl
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-amber-400">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-purple-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Horario de Atención
                        </h3>
                        <ul className="space-y-2 text-gray-600">
                            <li className="flex justify-between border-b border-gray-100 pb-1">
                                <span>Lunes a Viernes</span>
                                <span className="font-semibold text-gray-800">08:30 - 18:30 hrs</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-100 pb-1">
                                <span>Sábados</span>
                                <span className="font-semibold text-gray-800">09:00 - 14:00 hrs</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Domingos y Festivos</span>
                                <span className="font-semibold text-red-500">Cerrado</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Columna Derecha: Formulario de Contacto */}
                <div className="lg:w-2/3 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-black text-gray-800 mb-6 border-b-2 border-gray-100 pb-4">
                        Envíanos un mensaje
                    </h3>

                    {exito ? (
                        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-6 rounded text-center animate-fade-in-down">
                            <svg className="w-12 h-12 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <h4 className="text-xl font-bold mb-2">¡Mensaje Enviado!</h4>
                            <p>Un vendedor de FERREMAS se contactará contigo a la brevedad.</p>
                            <button
                                onClick={() => setExito(false)}
                                className="mt-6 bg-purple-900 text-white px-6 py-2 rounded font-bold hover:bg-purple-800 transition-colors"
                            >
                                Enviar otro mensaje
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        required
                                        value={form.nombre}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                                        placeholder="Ej: Juan Pérez"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                                        placeholder="ejemplo@correo.cl"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Motivo del contacto</label>
                                <select
                                    name="asunto"
                                    value={form.asunto}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                                >
                                    <option value="consulta">Consulta General / Stock</option>
                                    <option value="cotizacion">Cotización para Empresas</option>
                                    <option value="soporte">Soporte Técnico / Garantías</option>
                                    <option value="reclamo">Reclamos y Sugerencias</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mensaje</label>
                                <textarea
                                    name="mensaje"
                                    required
                                    rows="4"
                                    value={form.mensaje}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all resize-none"
                                    placeholder="Detalla tu consulta para que un vendedor pueda ayudarte mejor..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={enviando}
                                className={`w-full font-black py-4 px-4 rounded shadow-md text-white transition-all flex justify-center items-center text-lg ${enviando ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 active:scale-95 text-black'
                                    }`}
                            >
                                {enviando ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Enviando solicitud...
                                    </span>
                                ) : (
                                    'Enviar Mensaje al Vendedor'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Botón rápido para volver */}
            <div className="mt-8 text-center">
                <Link to="/" className="text-purple-700 font-bold hover:text-amber-500 transition-colors inline-flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Volver al Catálogo de Productos
                </Link>
            </div>
        </div>
    );
};

export default Contacto;