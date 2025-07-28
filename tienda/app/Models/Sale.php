<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'product_id',
        'user_id', 
        'quantity',
        'total_price',
    ];

    // Relación con el producto
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // ✅ Relación con el usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
