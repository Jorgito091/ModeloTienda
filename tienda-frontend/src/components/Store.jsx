import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Store = ({ addToCart, searchTerm, filter }) => {
  const [products, setProducts] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    axios.get('http://localhost:8000/api/products', { withCredentials: true })
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error cargando productos:', err));
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm?.toLowerCase() || '');

    const priceMin = filter?.priceMin ? parseFloat(filter.priceMin) : 0;
    const priceMax = filter?.priceMax ? parseFloat(filter.priceMax) : Infinity;
    const matchesPrice = product.price >= priceMin && product.price <= priceMax;

    const theme = filter?.theme || '';
    const matchesTheme = theme === '' || product.theme === theme;

    return matchesSearch && matchesPrice && matchesTheme;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12 tracking-wide drop-shadow-sm">
        🛍️ Más Vendidos
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 text-lg font-semibold">No se encontraron productos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group"
              style={{
                border: '1.5px solid #D1D5DB' /* gris medio */
              }}
            >
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={
                    product.image
                      ? `http://localhost:8000/storage/${product.image}`
                      : 'https://via.placeholder.com/400x300/eeeeee/888888?text=Sin+Imagen'
                  }
                  alt={product.name}
                  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                  onMouseEnter={(e) => {
                    setPreviewImage(product.image);
                    setPreviewPosition({ x: e.clientX + 20, y: e.clientY });
                  }}
                  onMouseMove={(e) => {
                    setPreviewPosition({ x: e.clientX + 20, y: e.clientY });
                  }}
                  onMouseLeave={() => setPreviewImage(null)}
                  loading="lazy"
                />

                <button
                  onClick={() => addToCart(product)}
                  className="absolute top-3 right-3 bg-gray-800 text-gray-100 rounded-full p-3 text-2xl shadow-lg opacity-0 group-hover:opacity-90 transform transition duration-300 hover:scale-110 hover:bg-gray-900"
                  title="Agregar al carrito"
                  aria-label={`Agregar ${product.name} al carrito`}
                >
                  🛒
                </button>
              </div>

              <div className="p-5 space-y-2">
                <h2 className="text-gray-900 font-semibold text-lg truncate">{product.name}</h2>
                <p className="text-gray-600 text-sm leading-relaxed h-14 overflow-hidden">{product.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-gray-900 font-bold text-xl">${product.price.toFixed(2)}</span>
                  <span className="text-gray-500 text-sm font-medium">Stock: {product.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewImage && (
        <div
          className="fixed z-50 pointer-events-none rounded-lg border-4 border-gray-200 shadow-lg overflow-hidden bg-white"
          style={{
            top: `${previewPosition.y}px`,
            left: `${previewPosition.x}px`,
            width: '280px',
            height: '280px',
            transition: 'top 0.1s ease, left 0.1s ease',
          }}
        >
          <img
            src={`http://localhost:8000/storage/${previewImage}`}
            alt="Vista previa"
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export default Store;
