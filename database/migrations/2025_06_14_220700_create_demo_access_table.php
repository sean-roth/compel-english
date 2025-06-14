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
        Schema::create('demo_access', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('access_token', 32)->unique();
            $table->integer('attempts_remaining')->default(5);
            $table->datetime('expires_at');
            $table->boolean('pre_ordered')->default(false);
            $table->decimal('estimated_azure_cost', 8, 4)->default(0);
            $table->timestamps();
            
            $table->index(['access_token', 'expires_at']);
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demo_access');
    }
};