import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Error al registrar usuario');
        setLoading(false);
        return;
      }

      const data = await res.json();
      // Puedes guardar token o redirigir directamente al login
      navigate('/login');
    } catch (error) {
      setError('Error en la conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h2 className="text-center text-xl font-semibold mb-6 text-gray-700">Crear Cuenta</h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirmar contraseña"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-800'
            }`}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
