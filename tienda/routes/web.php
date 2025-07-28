<?php

use Illuminate\Support\Facades\Route;

// Ruta de entrada: decide a dónde va cada usuario
Route::get('/', function () {
    // Este closure casi nunca llegará a ejecutarse,
    // porque el middleware ya habrá hecho la redirección.
})->middleware('role');

// Rutas específicas para cada sección (opcionales)
Route::view('/dashboard', 'dashboard')
     ->name('dashboard')
     ->middleware(['auth']);   // dashboard requiere estar autenticado

Route::view('/manage', 'manage')
     ->name('manage')
     ->middleware(['auth']);   // manage también requiere sesión
