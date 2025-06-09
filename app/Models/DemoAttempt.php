<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DemoAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'demo_user_id',
        'phrase',
        'score',
    ];

    protected $casts = [
        'score' => 'decimal:2',
    ];

    public function demoUser(): BelongsTo
    {
        return $this->belongsTo(DemoUser::class);
    }
}