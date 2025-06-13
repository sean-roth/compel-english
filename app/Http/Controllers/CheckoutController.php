<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CheckoutController extends Controller
{
    /**
     * Create ChargeBee checkout session.
     */
    public function createSession(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // For demo purposes, we'll return a mock checkout URL
            // In production, this would create an actual ChargeBee hosted page
            /*
            $result = ChargeBee_HostedPage::checkoutNew([
                'subscription' => [
                    'plan_id' => 'starter-monthly'
                ],
                'customer' => [
                    'email' => $request->email
                ],
                'redirect_url' => url('/welcome'),
                'cancel_url' => url('/')
            ]);
            
            return response()->json([
                'url' => $result->hostedPage()->url
            ]);
            */

            // Mock response for demo
            return response()->json([
                'success' => true,
                'url' => url('/checkout-demo?email=' . urlencode($request->email)),
                'message' => 'Demo mode: ChargeBee integration would redirect here'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unable to create checkout session. Please try again.'
            ], 500);
        }
    }
}