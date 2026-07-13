const express = require('express');
const router = express.Router();
const db = require('../config/database');
const jwt = require('jsonwebtoken');

// ==========================================
// 1. RUTAS DE CONSULTA PÚBLICAS
// ==========================================

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.codigo_ferremas as sku, 
                p.marca, 
                p.nombre, 
                p.stock, 
                c.nombre_categoria as categoria,
                h.valor as precio_actual
            FROM Producto p
            JOIN Categoria c ON p.id_categoria = c.id_categoria
            LEFT JOIN Historial_Precio h ON p.id_producto = h.id_producto
            WHERE h.fecha = (
                SELECT MAX(fecha) FROM Historial_Precio WHERE id_producto = p.id_producto
            )
            ORDER BY c.nombre_categoria ASC, p.nombre ASC;
        `;
        const [rows] = await db.execute(query);
        return res.status(200).json(rows);
    } catch (error) {
        console.error("Error al obtener el catálogo:", error);
        return res.status(500).json({ error: "Error interno al procesar el catálogo." });
    }
});

router.get('/parametros', async (req, res) => {
    try {
        const [categorias] = await db.execute('SELECT id_categoria, nombre_categoria as nombre FROM Categoria ORDER BY nombre_categoria ASC');

        // Devolvemos un array vacío en 'marcas' para que React no falle, y las categorías reales.
        res.status(200).json({ marcas: [], categorias });
    } catch (error) {
        console.error("Error al obtener parámetros:", error);
        res.status(500).json({ error: "Error interno al cargar parámetros." });
    }
});

// ==========================================
// 2. MIDDLEWARE DE SEGURIDAD (Roles 1 y 3)
// ==========================================

const verificarPrivilegios = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });

    try {
        const usuario = jwt.verify(token, process.env.JWT_SECRET);
        if (usuario.id_rol === 1 || usuario.id_rol === 3) {
            req.usuario = usuario;
            next();
        } else {
            return res.status(403).json({ error: "No tienes permisos para realizar esta acción." });
        }
    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado." });
    }
};

// ==========================================
// 3. RUTAS DE GESTIÓN PROTEGIDAS
// ==========================================

// AGREGAR PRODUCTO
router.post('/', verificarPrivilegios, async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { sku, nombre, marca_nombre, id_categoria, precio_actual, stock } = req.body;

        // 1. Insertar en Producto (Insertamos la marca directamente como texto)
        const [prodResult] = await connection.execute(
            `INSERT INTO Producto (codigo_ferremas, nombre, marca, id_categoria, stock) VALUES (?, ?, ?, ?, ?)`,
            [sku, nombre, marca_nombre, id_categoria, stock]
        );
        const id_producto = prodResult.insertId;

        // 2. Insertar el precio en el Historial
        await connection.execute(
            `INSERT INTO Historial_Precio (id_producto, valor, fecha) VALUES (?, ?, NOW())`,
            [id_producto, precio_actual]
        );

        await connection.commit();
        res.status(201).json({ mensaje: "Producto registrado exitosamente." });
    } catch (error) {
        await connection.rollback();
        console.error("Error al insertar:", error);
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "El código SKU ya existe." });
        res.status(500).json({ error: "Error interno del servidor." });
    } finally {
        connection.release();
    }
});

// ACTUALIZAR PRODUCTO
router.put('/:sku', verificarPrivilegios, async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { sku } = req.params;
        const { nombre, marca_nombre, id_categoria, precio_actual, stock } = req.body;

        // 1. Actualizar datos básicos (la marca entra como texto directo)
        await connection.execute(
            `UPDATE Producto SET nombre = ?, marca = ?, id_categoria = ?, stock = ? WHERE codigo_ferremas = ?`,
            [nombre, marca_nombre, id_categoria, stock, sku]
        );

        // 2. Obtener el id_producto para el historial
        const [prod] = await connection.execute('SELECT id_producto FROM Producto WHERE codigo_ferremas = ?', [sku]);
        const id_p = prod[0].id_producto;

        // 3. Insertar nuevo precio en el historial
        await connection.execute(
            `INSERT INTO Historial_Precio (id_producto, valor, fecha) VALUES (?, ?, NOW())`,
            [id_p, precio_actual]
        );

        await connection.commit();
        res.status(200).json({ mensaje: "Producto actualizado." });
    } catch (error) {
        await connection.rollback();
        console.error("Error al actualizar:", error);
        res.status(500).json({ error: "Error al actualizar los datos." });
    } finally {
        connection.release();
    }
});

// ELIMINAR PRODUCTO
router.delete('/:sku', verificarPrivilegios, async (req, res) => {
    try {
        const { sku } = req.params;
        await db.execute(`DELETE FROM Producto WHERE codigo_ferremas = ?`, [sku]);
        res.status(200).json({ mensaje: "Producto eliminado del sistema." });
    } catch (error) {
        console.error("Error al eliminar:", error);
        res.status(500).json({ error: "Error al eliminar. Verifique si tiene dependencias." });
    }
});

module.exports = router;