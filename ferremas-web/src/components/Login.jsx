import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    // Control de vistas: 'login', 'registro', o 'recuperar'
    const [vistaActual, setVistaActual] = useState('login');

    const [nombreCompleto, setNombreCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);
    const [exito, setExito] = useState(null);
    const [cargando, setCargando] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setExito(null);
        setCargando(true);

        try {
            if (vistaActual === 'login') {
                const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
                login(response.data.usuario, response.data.token);
                navigate('/');
            }
            else if (vistaActual === 'registro') {
                await axios.post('http://localhost:3000/api/auth/registro', {
                    nombre_completo: nombreCompleto, email, password
                });
                setExito("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
                setPassword('');
                setVistaActual('login');
            }
            else if (vistaActual === 'recuperar') {
                const response = await axios.post('http://localhost:3000/api/auth/recuperar', { email });
                setExito(response.data.mensaje);
                setEmail(''); // Limpiamos el correo por seguridad
                setVistaActual('login'); // Volvemos al login tras solicitar el reseteo
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) setError("Correo o contraseña incorrectos.");
                else if (err.response.status === 400) setError(err.response.data.error || "Datos inválidos.");
                else setError("Error en el servidor. Intente más tarde.");
            } else {
                setError("Error de conexión con el servidor.");
            }
        } finally {
            setCargando(false);
        }
    };

    const cambiarVista = (nuevaVista) => {
        setVistaActual(nuevaVista);
        setError(null);
        setExito(null);
        setPassword('');
    };

    return (
        <div className="flex justify-center items-center py-12 px-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-purple-900 transition-all duration-300">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">
                        {vistaActual === 'login' && 'Iniciar Sesión'}
                        {vistaActual === 'registro' && 'Crear Cuenta'}
                        {vistaActual === 'recuperar' && 'Recuperar Contraseña'}
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        {vistaActual === 'login' && 'Ingresa tus credenciales de FERREMAS'}
                        {vistaActual === 'registro' && 'Únete a nuestra plataforma de herramientas'}
                        {vistaActual === 'recuperar' && 'Ingresa tu correo y te enviaremos instrucciones'}
                    </p>
                </div>

                {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r font-medium text-sm">{error}</div>}
                {exito && <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r font-medium text-sm">{exito}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {vistaActual === 'registro' && (
                        <div className="animate-fade-in-down">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
                            <input type="text" required value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} className="w-full px-4 py-3 rounded bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" placeholder="Ej: Juan Pérez" />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" placeholder="ejemplo@ferremas.cl" />
                    </div>

                    {vistaActual !== 'recuperar' && (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-bold text-gray-700">Contraseña</label>
                                {vistaActual === 'login' && (
                                    <button type="button" onClick={() => cambiarVista('recuperar')} className="text-xs font-bold text-amber-600 hover:text-amber-500 transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                )}
                            </div>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" placeholder={vistaActual === 'login' ? "••••••••" : "Mínimo 6 caracteres"} minLength={vistaActual === 'login' ? 1 : 6} />
                        </div>
                    )}

                    <button type="submit" disabled={cargando} className={`w-full font-black py-3 px-4 rounded shadow-md text-white transition-all mt-4 flex justify-center items-center ${cargando ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-900 hover:bg-purple-800 active:scale-95'}`}>
                        {cargando ? 'Procesando...' : (
                            vistaActual === 'login' ? 'Entrar a mi cuenta' :
                                vistaActual === 'registro' ? 'Registrarme ahora' :
                                    'Enviar enlace de recuperación'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <p className="text-sm text-gray-600">
                        {vistaActual === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                        <button type="button" onClick={() => cambiarVista(vistaActual === 'login' ? 'registro' : 'login')} className="ml-2 font-bold text-amber-600 hover:text-amber-500 transition-colors">
                            {vistaActual === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;