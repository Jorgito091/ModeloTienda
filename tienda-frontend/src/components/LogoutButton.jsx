try {
  await logout();
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('tempData');

  if (setAuth) {
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false
    });
  }

  // 👇 Aquí haces la recarga completa
  window.location.href = '/login';

} catch (error) {
  console.error('Error al cerrar sesión:', error);
  setError('Ocurrió un error al cerrar sesión. Por favor intenta nuevamente.');

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  if (setAuth) setAuth(null);

} finally {
  setIsLoggingOut(false);
}
