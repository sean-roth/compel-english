<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DemoController;
use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

// Demo landing page - main route
Route::get('/', [LandingController::class, 'index'])->name('landing');

// Demo API routes
Route::prefix('api/demo')->group(function () {
    Route::post('/pronunciation', [DemoController::class, 'checkPronunciation'])->name('demo.pronunciation');
    Route::post('/email', [DemoController::class, 'captureEmail'])->name('demo.email');
});

// Checkout API routes
Route::prefix('api/checkout')->group(function () {
    Route::post('/session', [CheckoutController::class, 'createSession'])->name('checkout.session');
});

// Mock checkout page for demo
Route::get('/checkout/demo', function () {
    return inertia('Checkout/Demo', [
        'email' => request('email'),
        'plan' => request('plan', 'starter-monthly')
    ]);
})->name('checkout.demo');

// Existing auth and dashboard routes (preserved)
require __DIR__.'/auth.php';
require __DIR__.'/settings.php';

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/dashboard', 'dashboard')->name('dashboard');
});
