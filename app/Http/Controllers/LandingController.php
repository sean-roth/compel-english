<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Show the landing page with the demo experience.
     */
    public function index(): Response
    {
        return Inertia::render('welcome');
    }
}