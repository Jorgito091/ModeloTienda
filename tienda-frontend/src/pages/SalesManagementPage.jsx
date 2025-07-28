import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SaleManagementPage() {
  const [sales, setSales] = useState([]);
  const [filterEmail, setFilterEmail] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/sales', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSales(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error cargando las ventas');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const filteredSales = sales.filter(sale => {
    const emailMatch = sale.user?.email.toLowerCase().includes(filterEmail.toLowerCase());
    const productMatch = sale.product?.name.toLowerCase().includes(filterProduct.toLowerCase());

    const saleDate = new Date(sale.created_at);
    const dateFrom = filterDateFrom ? new Date(filterDateFrom) : null;
    const dateTo = filterDateTo ? new Date(filterDateTo) : null;

    const dateMatch =
      (!dateFrom || saleDate >= dateFrom) &&
      (!dateTo || saleDate <= dateTo);

    return emailMatch && productMatch && dateMatch;
  });

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Gestión de Ventas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
        <input
          type="text"
          placeholder="Filtrar por email de cliente"
          value={filterEmail}
          onChange={e => setFilterEmail(e.target.value)}
          className="shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 transition duration-200"
        />

        <input
          type="text"
          placeholder="Filtrar por nombre de producto"
          value={filterProduct}
          onChange={e => setFilterProduct(e.target.value)}
          className="shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 transition duration-200"
        />

        <input
          type="date"
          value={filterDateFrom}
          onChange={e => setFilterDateFrom(e.target.value)}
          className="shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none border border-gray-300 rounded-lg px-4 py-3 text-gray-700 transition duration-200"
          aria-label="Fecha desde"
        />

        <input
          type="date"
          value={filterDateTo}
          onChange={e => setFilterDateTo(e.target.value)}
          className="shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none border border-gray-300 rounded-lg px-4 py-3 text-gray-700 transition duration-200"
          aria-label="Fecha hasta"
        />
      </div>

      {loading && (
        <p className="text-center text-indigo-600 font-semibold text-lg">Cargando ventas...</p>
      )}

      {error && (
        <div className="text-center text-red-600 font-semibold mb-6">{error}</div>
      )}

      {!loading && !error && filteredSales.length === 0 && (
        <p className="text-center text-gray-500 text-lg">No se encontraron ventas con ese filtro.</p>
      )}

      {!loading && !error && filteredSales.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg">
            <thead className="bg-indigo-600">
              <tr>
                {['ID Venta', 'Producto', 'Cliente (Email)', 'Cantidad', 'Precio Total', 'Fecha'].map(header => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSales.map(sale => (
                <tr
                  key={sale.id}
                  className="hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{sale.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{sale.product?.name || 'Sin producto'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{sale.user?.email || 'Sin cliente'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{sale.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">${parseFloat(sale.total_price).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{new Date(sale.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
