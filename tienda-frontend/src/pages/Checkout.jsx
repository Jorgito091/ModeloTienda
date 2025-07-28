import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleConfirmPurchase = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const items = cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/sales',
        { items },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      alert('Compra realizada con éxito');
      setCart([]); // limpiar carrito después de compra
      navigate('/dashboard'); // redirigir a dashboard

    } catch (error) {
      alert('Error al procesar la compra');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = (id) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="mb-6 space-y-4">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Precio: ${item.price} &nbsp;|&nbsp; Total: ${item.price * item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
                    disabled={loading}
                  >
                    ➖
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
                    disabled={loading}
                  >
                    ➕
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between mb-6 text-xl font-bold">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>

          <button
            onClick={handleConfirmPurchase}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? 'Procesando...' : 'Confirmar compra'}
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
