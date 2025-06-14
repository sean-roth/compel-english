<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index()
    {
        return Inertia::render('Demo/Landing', [
            'demoConfig' => [
                'maxAttempts' => 5,
                'sessionDuration' => 24, // hours
                'preOrderDiscount' => 50, // percentage
                'regularPrice' => 47,
                'preOrderPrice' => 23.50,
                'preOrderDuration' => 3, // months
            ],
        ]);
    }
}