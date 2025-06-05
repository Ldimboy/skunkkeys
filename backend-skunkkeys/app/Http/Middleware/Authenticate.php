<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */

     //Evitar que vaya al logout que va por defecto
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            abort(401, 'No autenticado.');
        }
    }
}
