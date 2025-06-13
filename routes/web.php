<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\DemoController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing page - the demo page
Route::get('/', [LandingController::class, 'index'])->name('welcome');

// Demo API routes
Route::post('/api/demo/record', [DemoController::class, 'processRecording'])->name('demo.record');
Route::post('/api/demo/email', [DemoController::class, 'captureEmail'])->name('demo.email');

// Checkout routes
Route::post('/api/checkout/session', [CheckoutController::class, 'createSession'])->name('checkout.session');

// Dashboard (authenticated)
Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Settings routes
Route::middleware('auth')->group(function () {
    Route::get('/settings', function () {
        return Inertia::render('settings/profile');
    })->name('settings');
});

// Include auth routes
require __DIR__.'/auth.php';
require __DIR__.'/settings.php';