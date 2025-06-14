<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    public function createSession(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'plan' => 'nullable|string|in:pre-order,starter-monthly',
        ]);

        $plan = $request->input('plan', 'starter-monthly');
        $email = $request->email;

        try {
            // For pre-order, create a different flow
            if ($plan === 'pre-order') {
                return $this->createPreOrderSession($email);
            }

            // Mock ChargeBee session creation
            $sessionData = $this->mockChargebeeSession($email, $plan);

            return response()->json([
                'url' => $sessionData['url'],
                'session_id' => $sessionData['session_id'],
            ]);

        } catch (\Exception $e) {
            Log::error('Checkout session creation failed', [
                'error' => $e->getMessage(),
                'email' => $email,
                'plan' => $plan,
            ]);

            return response()->json([
                'error' => 'Failed to create checkout session',
                'code' => 'CHECKOUT_FAILED'
            ], 500);
        }
    }

    private function createPreOrderSession(string $email): \Illuminate\Http\JsonResponse
    {
        // Create a pre-order session with no immediate charge
        $sessionData = [
            'url' => url('/pre-order/confirm?email=' . urlencode($email)),
            'session_id' => 'pre_' . uniqid(),
            'type' => 'pre-order',
        ];

        return response()->json($sessionData);
    }

    private function mockChargebeeSession(string $email, string $plan): array
    {
        // This would be replaced with actual ChargeBee integration
        $chargebeeSite = env('CHARGEBEE_SITE', 'compelenglish-test');
        
        // Mock session data
        return [
            'url' => "https://{$chargebeeSite}.chargebee.com/hosted_pages/checkout_mock/" . uniqid(),
            'session_id' => 'cb_' . uniqid(),
        ];
    }

    // Real ChargeBee integration would look like this:
    private function createRealChargebeeSession(string $email, string $plan): array
    {
        /*
        $result = \ChargeBee_HostedPage::checkoutNew([
            'subscription' => [
                'plan_id' => $plan === 'pre-order' ? 'pre-order-special' : 'starter-monthly'
            ],
            'customer' => [
                'email' => $email
            ],
            'redirect_url' => url('/welcome'),
            'cancel_url' => url('/'),
            'billing_cycles' => $plan === 'pre-order' ? 3 : null, // 3 months for pre-order
        ]);
        
        return [
            'url' => $result->hostedPage()->url,
            'session_id' => $result->hostedPage()->id,
        ];
        */
        
        return $this->mockChargebeeSession($email, $plan);
    }

    public function handleWebhook(Request $request)
    {
        // Handle ChargeBee webhooks
        $eventType = $request->input('event_type');
        $content = $request->input('content', []);

        Log::info('ChargeBee webhook received', [
            'event_type' => $eventType,
            'content' => $content,
        ]);

        switch ($eventType) {
            case 'subscription_created':
                $this->handleSubscriptionCreated($content);
                break;
            case 'subscription_cancelled':
                $this->handleSubscriptionCancelled($content);
                break;
            case 'payment_succeeded':
                $this->handlePaymentSucceeded($content);
                break;
            case 'payment_failed':
                $this->handlePaymentFailed($content);
                break;
        }

        return response()->json(['status' => 'ok']);
    }

    private function handleSubscriptionCreated(array $content)
    {
        // Handle new subscription
        $subscription = $content['subscription'] ?? [];
        $customer = $content['customer'] ?? [];

        Log::info('New subscription created', [
            'customer_email' => $customer['email'] ?? 'unknown',
            'plan_id' => $subscription['plan_id'] ?? 'unknown',
        ]);

        // Update user status, send welcome email, etc.
    }

    private function handleSubscriptionCancelled(array $content)
    {
        // Handle subscription cancellation
        Log::info('Subscription cancelled', $content);
    }

    private function handlePaymentSucceeded(array $content)
    {
        // Handle successful payment
        Log::info('Payment succeeded', $content);
    }

    private function handlePaymentFailed(array $content)
    {
        // Handle failed payment
        Log::info('Payment failed', $content);
    }
}