<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demo_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demo_user_id')->constrained()->onDelete('cascade');
            $table->string('phrase');
            $table->decimal('score', 5, 2); // 0-100 with 2 decimal places
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demo_attempts');
    }
};