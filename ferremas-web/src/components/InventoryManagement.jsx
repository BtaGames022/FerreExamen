import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const InventoryManagement = () => {
    const { usuario } = useContext(AuthContext);

    // Estados para almacenar datos de la API
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    // Estado del formulario (marca_nombre ahora es texto)
    const [form, setForm] = useState({
        sku: '',
        nombre: '',
        marca_nombre: '',
        id_categoria: '',
        precio_actual: '',
        stock: ''
    });

    // Estados de control de UI
    const [editando, setEditando] = useState(false);
    const [alerta, setAlerta] = useState(null);
    const [cargando, setCargando] = useState(false);

    const token = localStorage.getItem('ferremas_token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    const cargarDatosIniciales = async () => {
        setCargando(true);
        try {
            // Obtenemos productos y parámetros (categorías) en paralelo
            const [resProd, resParam] = await Promise.all([
                axios.get('http://localhost:3000/api/productos'),
                axios.get('http://localhost:3000/api/productos/parametros')
            ]);

            setProductos(resProd.data);
            setCategorias(resParam.data.categorias);

            // Si hay categorías, seleccionamos la primera por defecto para el formulario
            if (resParam.data.categorias.length > 0) {
                setForm(prev => ({
                    ...prev,
                    id_categoria: resParam.data.categorias[0].id_categoria
                }));
            }
        } catch (error) {
            console.error("Error en carga inicial:", error);
            mostrarAlerta('error', "Error al conectar con el servidor de inventario.");
        } finally {
            setCargando(false);
        }
    };

    const mostrarAlerta = (tipo, mensaje) => {
        setAlerta({ tipo, mensaje });
        setTimeout(() => setAlerta(null), 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                await axios.put(`http://localhost:3000/api/productos/${form.sku}`, form, config);
                mostrarAlerta('exito', 'Producto actualizado con éxito.');
            } else {
                await axios.post('http://localhost:3000/api/productos', form, config);
                mostrarAlerta('exito', 'Producto registrado exitosamente.');
            }
            limpiarFormulario();
            cargarDatosIniciales();
        } catch (err) {
            mostrarAlerta('error', err.response?.data?.error || "Error al procesar la solicitud.");
        }
    };

    const iniciarEdicion = (producto) => {
        // Buscamos el ID de la categoría basado en el nombre que viene del catálogo
        const cat = categorias.find(c => c.nombre === producto.categoria);

        setForm({
            sku: producto.sku,
            nombre: producto.nombre,
            marca_nombre: producto.marca, // Cargamos el nombre de la marca en el input de texto
            id_categoria: cat?.id_categoria || '',
            precio_actual: producto.precio_actual,
            stock: producto.stock
        });
        setEditando(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const eliminar = async (sku) => {
        if (window.confirm(`¿Estás seguro de eliminar el producto ${sku}?`)) {
            try {
                await axios.delete(`http://localhost:3000/api/productos/${sku}`, config);
                mostrarAlerta('exito', 'Producto eliminado.');
                cargarDatosIniciales();
            } catch (err) {
                mostrarAlerta('error', err.response?.data?.error || "No se pudo eliminar.");
            }
        }
    };

    const limpiarFormulario = () => {
        setEditando(false);
        setForm({
            sku: '',
            nombre: '',
            marca_nombre: '',
            id_categoria: categorias.length > 0 ? categorias[0].id_categoria : '',
            precio_actual: '',
            stock: ''
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8 border-b-4 border-amber-400 pb-2">
                <h2 className="text-3xl font-black text-purple-900 uppercase">Gestión de Bodega</h2>
                <p className="text-gray-500 font-medium">Control de stock y parámetros de productos</p>
            </div>

            {alerta && (
                <div className={`p-4 mb-6 rounded-md font-bold shadow-sm animate-bounce ${alerta.tipo === 'exito' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 'bg-red-100 text-red-800 border-l-4 border-red-500'
                    }`}>
                    {alerta.mensaje}
                </div>
            )}

            {/* Formulario Corporativo */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-10 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">SKU (ID Único)</label>
                        <input type="text" placeholder="Ej: PROD-100" disabled={editando} value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="border p-2.5 rounded bg-gray-50 focus:ring-2 focus:ring-purple-600 outline-none disabled:bg-gray-200" required />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Nombre del Producto</label>
                        <input type="text" placeholder="Nombre descriptivo" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="border p-2.5 rounded bg-gray-50 focus:ring-2 focus:ring-purple-600 outline-none" required />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Marca</label>
                        <input
                            type="text"
                            placeholder="Ej: Bosch, Stanley, Makita"
                            value={form.marca_nombre}
                            onChange={e => setForm({ ...form, marca_nombre: e.target.value })}
                            className="border p-2.5 rounded bg-gray-50 border-amber-200 focus:ring-2 focus:ring-amber-400 outline-none"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Categoría del Sistema</label>
                        <select
                            value={form.id_categoria}
                            onChange={e => setForm({ ...form, id_categoria: e.target.value })}
                            className="border p-2.5 rounded bg-gray-50 focus:ring-2 focus:ring-purple-600 outline-none"
                            required
                        >
                            <option value="" disabled>Seleccionar...</option>
                            {categorias.map(c => (
                                <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Precio Unitario (CLP)</label>
                        <input type="number" min="0" placeholder="0" value={form.precio_actual} onChange={e => setForm({ ...form, precio_actual: e.target.value })} className="border p-2.5 rounded bg-gray-50 focus:ring-2 focus:ring-purple-600 outline-none" required />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Stock Físico</label>
                        <input type="number" min="0" placeholder="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="border p-2.5 rounded bg-gray-50 focus:ring-2 focus:ring-purple-600 outline-none" required />
                    </div>
                </div>

                <div className="flex gap-4 mt-8">
                    <button type="submit" className={`flex-grow font-black py-3 rounded shadow-md text-white transition-all uppercase tracking-widest ${editando ? 'bg-amber-500 hover:bg-amber-600' : 'bg-purple-900 hover:bg-purple-800'}`}>
                        {editando ? 'Confirmar Cambios' : 'Ingresar Herramienta'}
                    </button>
                    {editando && (
                        <button type="button" onClick={limpiarFormulario} className="bg-gray-500 text-white font-bold py-3 px-8 rounded shadow-md hover:bg-gray-600">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* Listado de Inventario */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-purple-900 text-white">
                            <tr>
                                <th className="p-4 text-xs uppercase font-black">SKU</th>
                                <th className="p-4 text-xs uppercase font-black">Producto</th>
                                <th className="p-4 text-xs uppercase font-black">Marca / Cat.</th>
                                <th className="p-4 text-xs uppercase font-black text-center">Stock</th>
                                <th className="p-4 text-xs uppercase font-black">Precio</th>
                                <th className="p-4 text-xs uppercase font-black text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {productos.map(p => (
                                <tr key={p.sku} className="hover:bg-amber-50 transition-colors">
                                    <td className="p-4 font-mono text-sm">{p.sku}</td>
                                    <td className="p-4 font-bold text-gray-800">{p.nombre}</td>
                                    <td className="p-4 text-xs">
                                        <span className="font-bold text-purple-700 block">{p.marca}</span>
                                        <span className="text-gray-400">{p.categoria}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`font-black px-2 py-1 rounded text-xs ${p.stock < 15 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold">${Number(p.precio_actual).toLocaleString('es-CL')}</td>
                                    <td className="p-4 flex justify-center gap-3">
                                        <button onClick={() => iniciarEdicion(p)} className="text-amber-600 hover:text-amber-800 p-1 transition-colors" title="Editar">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2.5 2.5 0 113.536 3.536L12 17.207l-4 1 1-4 11.707-11.707z"></path></svg>
                                        </button>
                                        <button onClick={() => eliminar(p.sku)} className="text-red-500 hover:text-red-700 p-1 transition-colors" title="Eliminar">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryManagement;