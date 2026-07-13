import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes
import Header from './components/Header';
import ProductCatalog from './components/ProductCatalog';
import ShoppingCart from './components/ShoppingCart';
import PaymentResult from './components/PaymentResult';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import InventoryManagement from './components/InventoryManagement';
import Contacto from './components/Contacto';

// Contextos Globales
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#f3f4f6]">

            <Header />

            {/* Banner Hero Promocional */}
            <div className="bg-gradient-to-r from-purple-800 to-purple-600 text-white py-12 px-6 text-center shadow-inner border-b-4 border-amber-400">
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">CyberTools <span className="text-amber-400">2026</span></h2>
              <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto">Construye tus proyectos con las mejores herramientas. Hasta un 40% de descuento en marcas seleccionadas.</p>
            </div>

            <main className="flex-grow container mx-auto mt-8 px-4 pb-12">
              {/* Aquí es donde React Router inyecta las vistas */}
              <Routes>
                <Route path="/" element={<ProductCatalog />} />
                <Route path="/carrito" element={<ShoppingCart />} />
                <Route path="/pago/resultado" element={<PaymentResult />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/inventario" element={<InventoryManagement />} />
                <Route path="/contacto" element={<Contacto />} />
              </Routes>
            </main>

            <footer className="bg-black text-gray-400 py-6 text-center text-sm mt-auto">
              <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
                <p>© 2026 FERREMAS. Todos los derechos reservados.</p>
                <div className="space-x-4 mt-4 md:mt-0">
                  <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
                  <a href="#" className="hover:text-white transition-colors">Políticas de Privacidad</a>
                </div>
              </div>
            </footer>

          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;