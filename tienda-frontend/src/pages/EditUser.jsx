
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditUser = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:8000/api/user', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then(res => setUser(res.data))
      .catch(err => console.error('Error al cargar usuario', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      await axios.put(
        'http://localhost:8000/api/user',
        { ...user, password },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      alert('Datos actualizados correctamente');
      navigate('/dashboard');
    } catch (error) {
      alert('Error al actualizar usuario');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Editar Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre</label>
          <input
            type="text"
            value={user.name}
            onChange={e => setUser({ ...user, name: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Correo</label>
          <input
            type="email"
            value={user.email}
            onChange={e => setUser({ ...user, email: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Nueva contraseña (opcional)</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
};
    
export default EditUser;
