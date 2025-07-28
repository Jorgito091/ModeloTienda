import React, { useState } from 'react';
import { registerUser } from '../services/authService'; // Suponiendo que tienes este servicio para registrar
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
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
      await registerUser(formData.email, formData.name, formData.password);
      alert('Usuario creado con éxito. Por favor, inicia sesión.');
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al crear usuario';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-gray-50 border border-gray-300 rounded-xl shadow-md p-8">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
          Crear una cuenta nueva
        </h2>

        {error && (
          <div className="mb-6 text-sm text-red-700 bg-red-100 border border-red-300 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition bg-white"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition bg-white"
              placeholder="usuario@correo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition bg-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-800'
            }`}
          >
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-gray-700 font-semibold hover:underline focus:outline-none"
            >
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
