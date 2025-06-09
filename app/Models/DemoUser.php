<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DemoUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'name',
        'company',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function demoAttempts(): HasMany
    {
        return $this->hasMany(DemoAttempt::class);
    }
}