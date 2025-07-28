<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
class ProductController extends Controller
{
    public function index()
    {
        return Product::all()->map(function ($product) {
            $product->image_url = $product->image ? asset('storage/' . $product->image) : null;
            return $product;
        });
    }

   public function store(Request $request)
{
    $themes = ['oversize', 'urbana', 'formal', 'deportiva'];

    $data = $request->validate([
        'name' => 'required|string',
        'description' => 'nullable|string',
        'price' => 'required|numeric',
        'stock' => 'required|integer',
        'theme' => ['nullable', 'string', Rule::in($themes)],
        'image' => 'nullable|image|max:2048',
    ]);



        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            \Log::info('Imagen guardada en: ' . $path);
            $data['image'] = $path;
        } else {
            \Log::info('No llegó archivo');
        }

        $product = Product::create($data);

        // Añadimos URL pública
        $product->image_url = $product->image ? asset('storage/' . $product->image) : null;

        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        $product->image_url = $product->image ? asset('storage/' . $product->image) : null;
        return $product;
    }

    public function update(Request $request, Product $product)
    {
       $themes = ['oversize', 'urbana', 'formal', 'deportiva'];

    $data = $request->validate([
        'name' => 'required|string',
        'description' => 'nullable|string',
        'price' => 'required|numeric',
        'stock' => 'required|integer',
        'theme' => ['nullable', 'string', Rule::in($themes)],
        'image' => 'nullable|image|max:2048',
    ]);


        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        // Añadimos URL pública
        $product->image_url = $product->image ? asset('storage/' . $product->image) : null;

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json(null, 204);
    }
}
