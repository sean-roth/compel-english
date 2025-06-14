<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PronunciationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'phrase',
        'score',
        'azure_cost',
        'ip_address',
        'feedback',
    ];

    protected $casts = [
        'score' => 'integer',
        'azure_cost' => 'decimal:4',
        'feedback' => 'array',
    ];

    public static function getTodaysCost(): float
    {
        return self::whereDate('created_at', today())
            ->sum('azure_cost');
    }

    public static function getUserCost(string $email): float
    {
        return self::where('email', $email)
            ->sum('azure_cost');
    }
}