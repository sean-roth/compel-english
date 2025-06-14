<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DemoController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\PronunciationController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Landing page and demo routes (public)
Route::get('/', [LandingController::class, 'index'])->name('home');

// Demo API routes
Route::prefix('api/demo')->group(function () {
    Route::post('/access', [DemoController::class, 'requestAccess']);
    Route::get('/access/check', [DemoController::class, 'checkAccess']);
    Route::post('/access/pre-order', [DemoController::class, 'markPreOrdered']);
});

// Pronunciation API routes (requires demo token)
Route::prefix('api/pronunciation')->group(function () {
    Route::post('/analyze', [PronunciationController::class, 'analyze']);
});

// Checkout routes
Route::prefix('api/checkout')->group(function () {
    Route::post('/session', [CheckoutController::class, 'createSession']);
    Route::post('/webhook', [CheckoutController::class, 'handleWebhook']);
});

// Pre-order confirmation page
Route::get('/pre-order/confirm', function () {
    return Inertia::render('PreOrder/Confirm');
})->name('pre-order.confirm');

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';