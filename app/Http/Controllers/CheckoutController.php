<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CheckoutController extends Controller
{
    public function createSession(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'plan' => 'nullable|string|in:starter-monthly,starter-annual',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Invalid input',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->input('email');
        $plan = $request->input('plan', 'starter-monthly');

        try {
            // For demo purposes, we'll return a mock response
            // In production, integrate with ChargeBee API
            $mockSession = $this->createMockSession($email, $plan);
            
            return response()->json([
                'success' => true,
                'url' => $mockSession['url'],
                'session_id' => $mockSession['id']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create checkout session',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    private function createMockSession(string $email, string $plan): array
    {
        // Mock ChargeBee session creation
        // In production, replace with actual ChargeBee API calls:
        /*
        $result = ChargeBee_HostedPage::checkoutNew([
            'subscription' => [
                'plan_id' => $plan
            ],
            'customer' => [
                'email' => $email
            ],
            'redirect_url' => url('/welcome'),
            'cancel_url' => url('/')
        ]);
        
        return [
            'id' => $result->hostedPage()->id,
            'url' => $result->hostedPage()->url
        ];
        */

        // For now, return a mock response
        return [
            'id' => 'mock_session_' . uniqid(),
            'url' => url('/checkout/demo?email=' . urlencode($email) . '&plan=' . $plan)
        ];
    }
}