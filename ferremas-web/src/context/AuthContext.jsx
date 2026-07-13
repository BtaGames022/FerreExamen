import { createContext, useState, useEffect } from 'react';

// Creamos el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Al cargar la aplicación, verificamos si ya hay una sesión activa
    useEffect(() => {
        const token = localStorage.getItem('ferremas_token');
        const userObj = localStorage.getItem('ferremas_user');

        if (token && userObj) {
            setUsuario(JSON.parse(userObj));
        }
        setCargando(false);
    }, []);

    // Función para guardar los datos cuando el usuario inicia sesión exitosamente
    const login = (datosUsuario, token) => {
        localStorage.setItem('ferremas_token', token);
        localStorage.setItem('ferremas_user', JSON.stringify(datosUsuario));
        setUsuario(datosUsuario);
    };

    // Función para cerrar sesión y limpiar el almacenamiento seguro
    const logout = () => {
        localStorage.removeItem('ferremas_token');
        localStorage.removeItem('ferremas_user');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
            {children}
        </AuthContext.Provider>
    );
};