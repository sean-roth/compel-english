<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pronunciation_logs', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->string('phrase');
            $table->integer('score');
            $table->decimal('azure_cost', 8, 4);
            $table->string('ip_address');
            $table->json('feedback')->nullable();
            $table->timestamps();
            
            $table->index(['email', 'created_at']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pronunciation_logs');
    }
};