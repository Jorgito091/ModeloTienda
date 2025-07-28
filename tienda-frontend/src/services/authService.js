import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Función para hacer login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    // Retornamos directamente el objeto con token y user que devuelve Laravel
    return response.data;
  } catch (error) {
    // Lanzamos error con mensaje claro para manejar en el frontend
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Error al iniciar sesión';
    throw new Error(message);
  }
};

// Función para hacer logout
export const logout = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Error al cerrar sesión';
    throw new Error(message);
  }
};

// Función para registrar un usuario
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Error al registrar usuario';
    throw new Error(message);
  }
};
