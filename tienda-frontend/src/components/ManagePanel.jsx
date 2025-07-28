// src/manage/ManagePanel.jsx
import { useNavigate } from 'react-router-dom';

export default function ManagePanel() {
  const navigate = useNavigate();

  return (
    <div className="p-6 grid gap-4 grid-cols-1 sm:grid-cols-3">
      <button
        className="bg-blue-600 text-white py-3 px-5 rounded hover:bg-blue-700"
        onClick={() => navigate('/manage/products')}
      >
        🛒 Gestionar Productos
      </button>

      <button
        className="bg-green-600 text-white py-3 px-5 rounded hover:bg-green-700"
        onClick={() => navigate('/manage/clients')}
      >
        👥 Gestionar Clientes
      </button>

      <button
        className="bg-yellow-600 text-white py-3 px-5 rounded hover:bg-yellow-700"
        onClick={() => navigate('/manage/orders')}
      >
        📦 Gestionar Pedidos
      </button>
    </div>
  );
}
