import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';

export default function ManagePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar el rol del usuario al cargar el componente
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      navigate('/dashboard'); // Redirige a la página de usuarios normales
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />
      
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-gray-700">Bienvenido Administrador</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <button
    onClick={() => navigate('/manage/products')}
    className="bg-blue-600 text-white rounded-lg p-4 hover:bg-blue-700 transition"
  >
    Editar Productos
  </button>
  <button
    onClick={() => navigate('/manage/sales')}
    className="bg-green-600 text-white rounded-lg p-4 hover:bg-green-700 transition"
  >
    Ver Ventas
  </button>
</div>

      </div>
    </div>
  );
  
}
