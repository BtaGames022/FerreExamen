const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
    // Buscamos el token en las cabeceras HTTP
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Acceso denegado. Token faltante o malformado." });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verificamos la firma criptográfica usando tu secreto del .env
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decodificado; // Inyectamos la carga útil (payload) en la request
        next(); // El token es legítimo, dejamos pasar la petición
    } catch (error) {
        return res.status(403).json({ error: "Token inválido, manipulado o expirado." });
    }
};

const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        // Verificamos si el ID del rol del usuario está dentro de los permitidos para esta ruta
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.id_rol)) {
            return res.status(403).json({ error: "Privilegios insuficientes para realizar esta acción." });
        }
        next();
    };
};

module.exports = { verificarToken, verificarRol };