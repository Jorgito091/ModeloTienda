import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({
  setAuth,
  cart,
  setCart,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter
}) => {
  const [showCart, setShowCart] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const cartRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const filterRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setShowCart(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalItems = Array.isArray(cart)
    ? cart.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLogout = () => {
    localStorage.clear();
    setAuth(null);
    navigate('/login');
  };

  const handleGoToCheckout = () => {
    if (totalItems === 0) {
      alert('El carrito está vacío');
      return;
    }
    navigate('/checkout');
  };

  const toggleFilter = () => setShowFilter((prev) => !prev);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const themes = ['', 'oversize', 'urbana', 'formal', 'deportiva'];

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative z-50">
      <h1
  className="text-xl font-bold text-gray-800 cursor-pointer relative hover:text-blue-600 hover:underline transition-all duration-300"
  onClick={toggleFilter}
>
  RYUU
</h1>

      {showFilter && (
        <div
          ref={filterRef}
          className="absolute top-full left-0 mt-2 bg-white border rounded shadow-md p-4 z-50 w-72"
        >
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Precio mínimo</label>
            <input
              type="number"
              name="priceMin"
              min="0"
              value={filter.priceMin}
              onChange={handleFilterChange}
              className="w-full border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="0"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Precio máximo</label>
            <input
              type="number"
              name="priceMax"
              min="0"
              value={filter.priceMax}
              onChange={handleFilterChange}
              className="w-full border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="1000"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Temática</label>
            <select
              name="theme"
              value={filter.theme}
              onChange={handleFilterChange}
              className="w-full border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
            >
              {themes.map((t) => (
                <option key={t} value={t}>
                  {t === '' ? 'Todas' : t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Search icon and input */}
        <div className="relative" ref={searchRef}>
          <button
            onClick={() => setShowSearch(true)}
            className="text-xl p-2 transition-transform transform hover:scale-125"
            title="Buscar"
          >
            🔍
          </button>

          {showSearch && (
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring focus:border-blue-300 transition-all w-64"
              autoFocus
            />
          )}
        </div>

        <button onClick={() => setShowCart(!showCart)} className="relative text-xl">
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
              {totalItems}
            </span>
          )}
        </button>

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="text-2xl hover:opacity-70 transition"
            title="Menú de usuario"
          >
            👤
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/edit-user');
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                ✏️ Editar usuario
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                disabled={loading}
              >
                🔓 Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {showCart && (
        <div
          ref={cartRef}
          className="absolute top-full right-4 mt-2 w-80 bg-white border rounded shadow-md p-4 z-50"
        >
          <h2 className="text-lg font-semibold mb-2">Carrito</h2>
          {Array.isArray(cart) && cart.length === 0 ? (
            <p className="text-gray-500">El carrito está vacío.</p>
          ) : (
            <>
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="border-b pb-2 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × ${item.price} = ${item.quantity * item.price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      disabled={loading}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleGoToCheckout}
                disabled={loading}
                className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Ir a la compra
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
