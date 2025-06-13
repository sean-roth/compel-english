<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemoLead extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'first_name',
        'source',
        'demo_score',
    ];

    protected $casts = [
        'demo_score' => 'decimal:2',
    ];
}