const API_URL = 'http://localhost:8000/api/products';

// Obtener token guardado en localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Obtener todos los productos
export async function getProducts() {
  const token = getToken();

  const res = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Error al obtener productos');
  return res.json();
}

// Crear producto (productData es FormData con imagen)
export async function createProduct(productData) {
  const token = getToken();

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // No ponemos Content-Type porque FormData lo define solo
    },
    body: productData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error al crear producto');
  }

  return res.json();
}

// Actualizar producto (PUT simulado con POST + _method)
export async function updateProduct(id, productData) {
  const token = getToken();

  // Asegúrate de agregar el _method para que Laravel interprete PUT
  productData.append('_method', 'PUT');

  const res = await fetch(`${API_URL}/${id}`, {
    method: 'POST', // POST con _method=PUT
    headers: {
      'Authorization': `Bearer ${token}`,
      // No poner Content-Type cuando usas FormData
    },
    body: productData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error al actualizar producto');
  }

  return res.json();
}


// Eliminar producto
export async function deleteProduct(id) {
  const token = getToken();

  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error al eliminar producto');
  }

  return res.json();
}
