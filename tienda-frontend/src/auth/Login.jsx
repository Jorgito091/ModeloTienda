import React, { useState, useEffect } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      setCheckingToken(false);
      return;
    }
    const verifyToken = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/check-token', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (!response.ok) throw new Error('Token inválido');
        const data = await response.json();
        setAuth({ user: data.user, token });
        redirectUser(data.user.role);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('La sesión ha expirado, por favor ingresa nuevamente');
      } finally {
        setCheckingToken(false);
      }
    };
    verifyToken();
  }, [navigate, setAuth]);

  const redirectUser = (role) => {
    if (role === 'admin') {
      navigate('/manage');
    } else {
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token, user } = await login(formData.email, formData.password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuth({ user, token });
      redirectUser(user.role);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al iniciar sesión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <span className="text-gray-600 text-sm">Verificando sesión...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-gray-50 border border-gray-300 rounded-xl shadow-md p-8">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
          Inicia sesión en tu cuenta
        </h2>

        {error && (
          <div className="mb-6 text-sm text-red-700 bg-red-100 border border-red-300 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
            {loading ? 'Procesando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-gray-700 font-semibold hover:underline focus:outline-none"
            >
              Crear usuario
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
