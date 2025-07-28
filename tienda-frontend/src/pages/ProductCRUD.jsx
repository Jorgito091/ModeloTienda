import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';

export default function ProductCRUD({ filter = { text: '', priceMin: '', priceMax: '', theme: '' } }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    stock: '',
    theme: '',
    image: null,
    imagePreview: null
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Error cargando productos: ' + (err.message || ''));
    }
  };

  const handleChange = e => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const selectedFile = files[0];
      setForm(prev => ({
        ...prev,
        image: selectedFile,
        imagePreview: selectedFile ? URL.createObjectURL(selectedFile) : prev.imagePreview
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm({ 
      id: null, 
      name: '', 
      description: '', 
      price: '', 
      stock: '', 
      theme: '',
      image: null,
      imagePreview: null
    });
    setEditing(false);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('stock', form.stock);
      formData.append('theme', form.theme);

      if (form.image instanceof File) {
        formData.append('image', form.image);
      }

      if (editing) {
        formData.append('_method', 'PUT');
        await updateProduct(form.id, formData);
        setSuccess('Producto actualizado correctamente');
      } else {
        await createProduct(formData);
        setSuccess('Producto creado correctamente');
      }

      await fetchProducts();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = product => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      theme: product.theme || '',
      image: null,
      imagePreview: product.image_url || null
    });
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;
    try {
      await deleteProduct(id);
      await fetchProducts();
      setSuccess('Producto eliminado correctamente');
    } catch (err) {
      setError('Error eliminando producto: ' + (err.message || ''));
    }
  };

  // Aplicar filtro avanzado (texto, precio mínimo, máximo y temática)
  const filteredProducts = products.filter(product => {
    const searchText = filter.text?.toLowerCase() || '';
    const priceMin = parseFloat(filter.priceMin);
    const priceMax = parseFloat(filter.priceMax);
    const theme = filter.theme || '';

    const matchesText =
      product.name.toLowerCase().includes(searchText) ||
      (product.description && product.description.toLowerCase().includes(searchText));

    const price = parseFloat(product.price);

    const matchesPriceMin = isNaN(priceMin) ? true : price >= priceMin;
    const matchesPriceMax = isNaN(priceMax) ? true : price <= priceMax;

    const matchesTheme = !theme || product.theme === theme;

    return matchesText && matchesPriceMin && matchesPriceMax && matchesTheme;
  });

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{editing ? 'Editar Producto' : 'Nuevo Producto'}</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="mb-6 space-y-4" encType="multipart/form-data">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Temática</label>
          <select
            name="theme"
            value={form.theme}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Seleccionar temática</option>
            <option value="oversize">Oversize</option>
            <option value="urbana">Urbana</option>
            <option value="formal">Formal</option>
            <option value="deportiva">Deportiva</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio*</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock*</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              min="0"
              className="border p-2 w-full rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {form.imagePreview && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
              <img 
                src={form.imagePreview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded border"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/fami.png';
                }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Procesando...' : editing ? 'Actualizar' : 'Crear'}
          </button>

          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-4">Lista de Productos</h3>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded">
          <p className="text-gray-500">No hay productos registrados</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temática</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${parseFloat(product.price).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{product.theme || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">Sin imagen</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="mr-2 text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
