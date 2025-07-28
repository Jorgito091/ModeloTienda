<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    // Listar ventas con producto y usuario
    public function index()
    {
        $sales = Sale::with(['product', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($sales);
    }

    // Crear ventas múltiples asociadas al usuario autenticado
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $items = $request->items;

        DB::beginTransaction();

        try {
            $sales = [];

            foreach ($items as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    DB::rollBack(); // revertir la transacción antes de retornar
                    return response()->json([
                        'message' => "No hay suficiente stock para el producto {$product->name}"
                    ], 400);
                }

                $totalPrice = $product->price * $item['quantity'];

                $sale = Sale::create([
                    'product_id' => $product->id,
                    'user_id' => $request->user()->id,
                    'quantity' => $item['quantity'],
                    'total_price' => $totalPrice,
                ]);

                $product->stock -= $item['quantity'];
                $product->save();

                $sales[] = $sale;
            }

            DB::commit();

            // Cargar relaciones para cada venta antes de devolver
            foreach ($sales as $sale) {
                $sale->load(['product', 'user']);
            }

            return response()->json($sales, 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al procesar la compra', 'error' => $e->getMessage()], 500);
        }
    }
}
