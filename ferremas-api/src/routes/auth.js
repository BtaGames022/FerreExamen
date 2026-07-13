const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// ==========================================
// 1. INICIO DE SESIÓN (LOGIN)
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son obligatorios." });
        }

        const query = `SELECT id_usuario, nombre_completo, email, password_hash, id_rol FROM Usuario WHERE email = ?`;
        const [rows] = await db.execute(query, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "Credenciales incorrectas." });
        }

        const usuario = rows[0];

        const passwordValida = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordValida) {
            return res.status(401).json({ error: "Credenciales incorrectas." });
        }

        const payload = {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre_completo,
            id_rol: usuario.id_rol
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

        return res.status(200).json({
            mensaje: "Autenticación exitosa",
            token: token,
            usuario: payload
        });

    } catch (error) {
        console.error("Error en el proceso de Login:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
});

// ==========================================
// 2. REGISTRO DE CLIENTES NUEVOS
// ==========================================
router.post('/registro', async (req, res) => {
    try {
        const { nombre_completo, email, password } = req.body;

        if (!nombre_completo || !email || !password) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const query = `INSERT INTO Usuario (nombre_completo, email, password_hash, id_rol) VALUES (?, ?, ?, 5)`;
        await db.execute(query, [nombre_completo, email, passwordHash]);

        return res.status(201).json({ mensaje: "Cliente registrado con éxito." });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "El correo electrónico ya se encuentra registrado." });
        }
        console.error("Error en el registro:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
});

// ==========================================
// 3. SOLICITUD DE RECUPERACIÓN (EMAIL)
// ==========================================
router.post('/recuperar', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "El correo electrónico es obligatorio." });
        }

        const query = `SELECT id_usuario, nombre_completo FROM Usuario WHERE email = ?`;
        const [rows] = await db.execute(query, [email]);

        if (rows.length > 0) {
            const usuario = rows[0];

            const resetToken = jwt.sign(
                { id_usuario: usuario.id_usuario, proposito: 'recuperacion' },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );

            const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

            console.log('\n=============================================');
            console.log('📧 SIMULADOR DE CORREO ELECTRÓNICO (QA MODE)');
            console.log(`Para: ${email}`);
            console.log(`Asunto: FERREMAS - Recuperación de Contraseña`);
            console.log(`Hola ${usuario.nombre_completo},`);
            console.log(`Haz clic en el enlace para crear una nueva contraseña (válido 15 min):`);
            console.log(resetLink);
            console.log('=============================================\n');
        }

        return res.status(200).json({
            mensaje: "Si el correo está registrado, recibirás las instrucciones en breve."
        });

    } catch (error) {
        console.error("Error en recuperación de contraseña:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
});

// ==========================================
// 4. RESTABLECER CONTRASEÑA FINAL
// ==========================================
router.post('/reset-password', async (req, res) => {
    try {
        const { token, nuevaPassword } = req.body;

        if (!token || !nuevaPassword) {
            return res.status(400).json({ error: "Token y nueva contraseña son requeridos." });
        }

        if (nuevaPassword.length < 6) {
            return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." });
        }

        try {
            const decodificado = jwt.verify(token, process.env.JWT_SECRET);

            if (decodificado.proposito !== 'recuperacion') {
                return res.status(403).json({ error: "Token no válido para esta acción." });
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(nuevaPassword, salt);

            const query = `UPDATE Usuario SET password_hash = ? WHERE id_usuario = ?`;
            await db.execute(query, [passwordHash, decodificado.id_usuario]);

            return res.status(200).json({ mensaje: "Contraseña actualizada exitosamente." });

        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({ error: "El enlace ha expirado. Por favor, solicita uno nuevo." });
            }
            return res.status(403).json({ error: "Enlace de recuperación inválido." });
        }

    } catch (error) {
        console.error("Error al restablecer contraseña:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
});

module.exports = router;