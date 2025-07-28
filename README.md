# 🛒 ModeloTienda - Plataforma de Comercio en Línea

**ModeloTienda** es un proyecto completo de tienda en línea desarrollado con **Laravel** para el backend y **React** para el frontend. Permite a usuarios navegar productos, agregarlos al carrito y realizar pedidos, mientras que los administradores pueden gestionar productos, pedidos y usuarios.

---

## 📁 Estructura del Proyecto

```
ModeloTienda/
├── tienda/              # Backend (Laravel)
│   ├── app/             # Controladores, modelos, repositorios
│   ├── routes/          # Rutas API (api.php)
│   ├── database/        # Migraciones y seeders
│   ├── .env             # Configuración de variables de entorno (base de datos, JWT, etc)
│   └── ...              # Otros archivos Laravel
├── tienda-frontend/     # Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── auth/        # Lógica de login y registro (Login.jsx, useAuth.js)
│   │   ├── components/  # Componentes reutilizables (Navbar, Footer, ProductCard, etc.)
│   │   ├── pages/       # Páginas principales (Home, Products, Cart, AdminDashboard, etc.)
│   │   ├── services/    # Servicios API (axios configurado)
│   │   └── App.jsx      # Enrutamiento general y estructura principal
│   ├── .env             # Variables frontend (VITE_API_URL, etc)
│   └── ...              # Archivos de configuración Vite, Tailwind, etc.
```

---

## 👨‍💻 Tecnologías Usadas

### Backend (Laravel)

- Laravel 10
- Sanctum o JWT para autenticación
- SQLite o MySQL
- Rutas API REST (`routes/api.php`)
- Controladores y Repositorios separados (Patrón Repository)

### Frontend (React)

- React 18 con Vite
- Tailwind CSS
- React Router
- Axios para peticiones HTTP

---

## ✨ Funcionalidades

### Usuario Normal

- Ver productos
- Filtrar y buscar por nombre
- Agregar productos al carrito
- Realizar pedidos
- Visualizar pedidos realizados

### Administrador

- Login como admin
- Ver y editar productos
- Agregar o eliminar productos
- Ver pedidos realizados
- Ver y gestionar usuarios registrados

---

## ⚙️ Instalación del Proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/Jorgito091/ModeloTienda.git
cd ModeloTienda
```

### 2. Configurar el Backend (Laravel)

```bash
cd tienda
cp .env.example .env
composer install
php artisan key:generate
```

**Editar **``** y configurar base de datos** (ej. SQLite):

```
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

Crear archivo SQLite:

```bash
touch database/database.sqlite
```

Migrar y poblar datos:

```bash
php artisan migrate --seed
```

Levantar el backend:

```bash
php -S localhost:8000 -t public
```

### 3. Configurar el Frontend (React)

```bash
cd ../tienda-frontend
cp .env.example .env
```

**Editar **``** y configurar la URL del backend:**

```
VITE_API_URL=http://localhost:8000/api
```

Instalar dependencias:

```bash
npm install
```

Levantar el frontend:

```bash
npm run dev
```

---

## 🧠 Notas de Implementación

- El login divide roles por token y tipo de usuario
- Los componentes están separados por responsabilidades (auth, admin, shared)
- El backend sigue buenas prácticas de Laravel con rutas limpias y controladores desacoplados
- El frontend es completamente responsivo y modular

---

## 📦 Dependencias Clave

**Laravel:**

- `laravel/sanctum` o `tymon/jwt-auth` (según configuración)

**React:**

- `axios`
- `react-router-dom`
- `tailwindcss`

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.

---

## 🙌 Autor

- Jorge Eduardo Torres Ochoa - [@Jorgito091](https://github.com/Jorgito091)

