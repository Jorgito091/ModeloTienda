    <?php
    use App\Http\Controllers\Api\ProductController;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Auth;
    use Illuminate\Support\Facades\Route;
    use App\Http\Controllers\AuthController;
    use App\Http\Controllers\SaleController;
    Route::get('/test-react', function () {
        return response()->json([
            'message' => '¡Conexión exitosa!',
            'data' => ['laravel_version' => app()->version()]
        ]);
    });

    // Rutas públicas
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    // Rutas protegidas
    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);


    Route::middleware('auth:sanctum')->get('/check-token', function (Request $request) {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'message' => 'Usuario no autenticado',
                    'token_valid' => false
                ], 401);
            }

            return response()->json([
                'user' => $user->only(['id', 'name', 'email', 'role']),
                'token_valid' => true,
                'redirect_to' => $user->role === 'admin' ? '/manage' : '/dashboard'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al verificar el token',
                'token_valid' => false
            ], 500);
        }
    });
    Route::apiResource('products', ProductController::class);
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/sales', [SaleController::class, 'index']);
        Route::post('/sales', [SaleController::class, 'store']);
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
        Route::put('/user', [AuthController::class, 'update']); // 🆕 Nueva ruta para actualizar usuario
    });
