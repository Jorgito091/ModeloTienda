import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Login from './auth/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ManagePage from './pages/ManagePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NotAuthorized from './pages/NotAuthorized.jsx';
import ProductCRUD from './pages/ProductCRUD.jsx';
import Checkout from './pages/Checkout.jsx';
import EditUser from './pages/EditUser.jsx';
import SaleManagementPage from './pages/SalesManagementPage.jsx';
import Register from './components/Register.jsx';
const noHeaderRoutes = ['/login'];

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [auth, setAuth] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Estado para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    text: '',       // ← AÑADIDO: para permitir búsqueda por texto
    priceMin: '',
    priceMax: '',
    theme: ''
  });

  const location = useLocation();

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (token && user) {
        setAuth({ token, user });
      }
    } catch {
      setAuth(null);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setAuth(null);
    setCart([]);
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const productInCart = prevCart.find((item) => item.id === product.id);
      if (productInCart) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const buyProduct = (productId, quantity) => {
    if (quantity <= 0) return;
    alert(`Comprando producto ${productId} cantidad: ${quantity}`);
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - quantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const showHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && (
        <Header
          setAuth={setAuth}
          cart={cart}
          setCart={setCart}
          buyProduct={buyProduct}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filter={filter}
          setFilter={setFilter}
        />
      )}
      <Routes>
        <Route path="/" element={<h1>Página de Inicio</h1>} />

        <Route
          path="/login"
          element={
            auth ? (
              <Navigate to={auth.user.role === 'admin' ? '/manage' : '/dashboard'} />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

       <Route
  path="/edit-user"
  element={
    <ProtectedRoute auth={auth} allowedRoles={['user', 'admin']}>
      <EditUser />
    </ProtectedRoute>
  }
/>


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute auth={auth} allowedRoles={['user', 'admin']}>
              <Dashboard
                cart={cart}
                addToCart={addToCart}
                searchTerm={searchTerm}
                filter={filter}
              />
            </ProtectedRoute>
          }
        />
<Route
  path="/register"
  element={auth ? (
    <Navigate to={auth.user.role === 'admin' ? '/manage' : '/dashboard'} />
  ) : (
    <Register />
  )}
/>
        <Route
          path="/checkout"
          element={
            <ProtectedRoute auth={auth} allowedRoles={['user', 'admin']}>
              <Checkout cart={cart} setCart={setCart} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage"
          element={
            <ProtectedRoute auth={auth} allowedRoles={['admin']}>
              <ManagePage handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage/products"
          element={
            <ProtectedRoute auth={auth} allowedRoles={['admin']}>
              <ProductCRUD
                handleLogout={handleLogout}
                searchTerm={searchTerm}
                filter={filter}           // ← AÑADIDO AQUÍ
              />
            </ProtectedRoute>
          }
        />

        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/manage/sales" element={<SaleManagementPage />} />
      </Routes>
    </>
  );
}

export default AppWrapper;
