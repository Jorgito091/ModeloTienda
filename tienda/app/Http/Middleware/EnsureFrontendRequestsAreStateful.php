<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\Sanctum;

class EnsureFrontendRequestsAreStateful
{
    /**
     * Maneja una solicitud entrante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Permite el acceso si la solicitud es desde un dominio considerado stateful
        if ($this->isStatefulRequest($request)) {
            Sanctum::authenticate($request);
        }

        return $next($request);
    }

    /**
     * Determina si la solicitud proviene de un dominio con cookies de sesión stateful.
     *
     * @param \Illuminate\Http\Request $request
     * @return bool
     */
    protected function isStatefulRequest(Request $request)
    {
        $statefulDomains = config('sanctum.stateful');
        return in_array($request->getHost(), $statefulDomains);
    }
}
