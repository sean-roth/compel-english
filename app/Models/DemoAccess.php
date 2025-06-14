<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class DemoAccess extends Model
{
    use HasFactory;

    protected $table = 'demo_access';

    protected $fillable = [
        'email',
        'access_token',
        'attempts_remaining',
        'expires_at',
        'pre_ordered',
        'estimated_azure_cost',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'pre_ordered' => 'boolean',
        'estimated_azure_cost' => 'decimal:4',
    ];

    public static function generateAccessToken(): string
    {
        return Str::random(32);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function canAttempt(): bool
    {
        return $this->attempts_remaining > 0 && !$this->isExpired();
    }

    public function decrementAttempts(): void
    {
        $this->decrement('attempts_remaining');
    }
}