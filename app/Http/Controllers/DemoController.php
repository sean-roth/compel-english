<?php

namespace App\Http\Controllers;

use App\Models\DemoAccess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class DemoController extends Controller
{
    public function requestAccess(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'website' => 'nullable|max:0', // Honeypot field
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Invalid email address',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check honeypot - if filled, it's likely a bot
        if ($request->filled('website')) {
            return response()->json([
                'error' => 'Invalid request',
                'code' => 'BOT_DETECTED'
            ], 422);
        }

        $email = $request->email;

        // Check if user already has access
        $existingAccess = DemoAccess::where('email', $email)->first();
        
        if ($existingAccess && $existingAccess->canAttempt()) {
            return response()->json([
                'access_token' => $existingAccess->access_token,
                'attempts_remaining' => $existingAccess->attempts_remaining,
                'expires_at' => $existingAccess->expires_at,
                'message' => 'Access restored'
            ]);
        }

        // Create or update access
        $access = DemoAccess::updateOrCreate(
            ['email' => $email],
            [
                'access_token' => DemoAccess::generateAccessToken(),
                'attempts_remaining' => 5,
                'expires_at' => now()->addHours(24),
                'pre_ordered' => false,
                'estimated_azure_cost' => 0,
            ]
        );

        // Send welcome email (in production)
        // $this->sendWelcomeEmail($access);

        return response()->json([
            'access_token' => $access->access_token,
            'attempts_remaining' => $access->attempts_remaining,
            'expires_at' => $access->expires_at,
            'message' => 'Demo access granted'
        ]);
    }

    public function checkAccess(Request $request)
    {
        $token = $request->header('X-Demo-Token');
        
        if (!$token) {
            return response()->json(['error' => 'Token required'], 401);
        }

        $access = DemoAccess::where('access_token', $token)->first();
        
        if (!$access) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        return response()->json([
            'email' => $access->email,
            'attempts_remaining' => $access->attempts_remaining,
            'expires_at' => $access->expires_at,
            'can_attempt' => $access->canAttempt(),
            'pre_ordered' => $access->pre_ordered,
        ]);
    }

    public function markPreOrdered(Request $request)
    {
        $token = $request->header('X-Demo-Token');
        
        if (!$token) {
            return response()->json(['error' => 'Token required'], 401);
        }

        $access = DemoAccess::where('access_token', $token)->first();
        
        if (!$access) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $access->update(['pre_ordered' => true]);

        return response()->json([
            'message' => 'Pre-order status updated',
            'pre_ordered' => true,
        ]);
    }

    private function sendWelcomeEmail(DemoAccess $access)
    {
        // Implementation for sending welcome email
        // Mail::to($access->email)->send(new DemoAccessGranted($access));
    }
}