<?php

use App\Http\Controllers\DemoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('landing');
})->name('landing');

Route::get('/demo', function () {
    return Inertia::render('demo');
})->name('demo');

Route::get('/welcome', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Demo API routes
Route::prefix('api/demo')->name('demo.')->group(function () {
    Route::post('/register', [DemoController::class, 'register'])->name('register');
    Route::get('/phrase', [DemoController::class, 'phrase'])->name('phrase');
    Route::post('/score', [DemoController::class, 'score'])->name('score');
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';