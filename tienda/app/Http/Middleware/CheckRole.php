<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    
    public function handle(Request $request, Closure $next)
    {
        // Obtiene el usuario autenticado (o null si no hay sesión)
        $user = auth()->user();

        // 1) Si no está autenticado, redirige al login
        if (! $user) {
            return redirect('/login');
        }

        // 2) Si es usuario normal, redirige al dashboard
        if ($user->role === 'user') {
            return redirect('/dashboard');
        }

        // 3) Si no es usuario normal (por ejemplo, admin), redirige a la sección de gestión
        return redirect('/manage');
    }   
}
