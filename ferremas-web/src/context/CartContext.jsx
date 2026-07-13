import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Inicializamos el carrito buscando si hay datos previos guardados
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('ferremas_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Cada vez que el carrito cambia, lo guardamos en LocalStorage
    useEffect(() => {
        localStorage.setItem('ferremas_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (producto) => {
        setCart(prevCart => {
            const existingProduct = prevCart.find(item => item.sku === producto.sku);
            if (existingProduct) {
                // Si ya existe, sumamos 1 a la cantidad
                return prevCart.map(item =>
                    item.sku === producto.sku ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            // Si es nuevo, lo agregamos con cantidad 1
            return [...prevCart, { ...producto, cantidad: 1 }];
        });
    };

    const removeFromCart = (sku) => {
        setCart(prevCart => prevCart.filter(item => item.sku !== sku));
    };

    const updateQuantity = (sku, amount) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.sku === sku) {
                const newQuantity = item.cantidad + amount;
                // Evitamos que baje de 1. Si quiere 0, debe usar el botón de eliminar.
                return newQuantity > 0 ? { ...item, cantidad: newQuantity } : item;
            }
            return item;
        }));
    };

    // Cálculos derivados automáticos
    const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const subtotal = cart.reduce((acc, item) => acc + (Number(item.precio_actual) * item.cantidad), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, totalItems, subtotal }}>
            {children}
        </CartContext.Provider>
    );
};