import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // 👈 importante si usas cookies con Sanctum
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    await api.post('/logout'); // Asegúrate de usar el mismo path que Laravel
  } catch (error) {
    console.error('Error desde logout():', error);
    throw error;
  }
};

