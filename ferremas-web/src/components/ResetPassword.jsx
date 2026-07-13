import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Capturamos el token de la URL
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [error, setError] = useState(null);
    const [exito, setExito] = useState(false);
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validación de QA en el Front-end
        if (!token) {
            setError("No se detectó un token de seguridad válido en la URL.");
            return;
        }

        if (password !== confirmarPassword) {
            setError("Las contraseñas no coinciden. Inténtalo de nuevo.");
            return;
        }

        setCargando(true);

        try {
            const response = await axios.post('http://localhost:3000/api/auth/reset-password', {
                token,
                nuevaPassword: password
            });

            setExito(true);

            // Redirigimos al login después de 3 segundos para que alcance a leer el mensaje
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || "Error al procesar la solicitud.");
            } else {
                setError("No se pudo conectar con el servidor.");
            }
        } finally {
            setCargando(false);
        }
    };

    if (exito) {
        return (
            <div className="flex justify-center items-center py-16 px-4">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-green-500 text-center animate-fade-in-down">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-2">¡Contraseña Actualizada!</h2>
                    <p className="text-gray-600 mb-6 font-medium">Tu contraseña se ha cambiado exitosamente. Redirigiendo al inicio de sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center py-16 px-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-purple-900">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">Nueva Contraseña</h2>
                    <p className="text-gray-500 mt-2 text-sm">Crea una contraseña segura para tu cuenta</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r font-medium text-sm">
                        {error}
                    </div>
                )}

                {!token && !error && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-800 p-4 mb-6 rounded-r font-medium text-sm">
                        Parece que el enlace está incompleto. Asegúrate de copiar todo el enlace del correo.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nueva Contraseña</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                            placeholder="Mínimo 6 caracteres"
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Confirmar Contraseña</label>
                        <input
                            type="password"
                            required
                            value={confirmarPassword}
                            onChange={(e) => setConfirmarPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                            placeholder="Repite tu nueva contraseña"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={cargando || !token}
                        className={`w-full font-black py-3 px-4 rounded shadow-md text-white transition-all mt-4 flex justify-center items-center ${cargando || !token ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-900 hover:bg-purple-800 active:scale-95'
                            }`}
                    >
                        {cargando ? 'Guardando...' : 'Cambiar Contraseña'}
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-gray-100 pt-6">
                    <Link to="/login" className="text-sm font-bold text-amber-600 hover:text-amber-500 transition-colors">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;