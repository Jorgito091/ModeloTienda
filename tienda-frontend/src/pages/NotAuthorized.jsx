import { Link } from 'react-router-dom';

const NotAuthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso no autorizado</h1>
        <p className="mb-4">No tienes los permisos necesarios para acceder a esta página.</p>
        <Link 
          to="/dashboard" 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotAuthorized;