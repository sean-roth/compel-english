<?php

namespace App\Http\Controllers;

use App\Models\DemoUser;
use App\Models\DemoAttempt;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class DemoController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email|unique:demo_users,email',
                'name' => 'nullable|string|max:255',
                'company' => 'nullable|string|max:255',
            ]);

            $demoUser = DemoUser::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Registration successful! Check your email for early access details.',
                'user' => $demoUser,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.',
            ], 500);
        }
    }

    public function phrase(): JsonResponse
    {
        return response()->json([
            'phrase' => 'regulatory compliance review',
        ]);
    }

    public function score(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'demo_user_id' => 'nullable|exists:demo_users,id',
                'phrase' => 'required|string',
            ]);

            // Generate mock score between 60-85%
            $score = rand(60, 85) + (rand(0, 99) / 100);

            // Create demo attempt if user is registered
            if (isset($validated['demo_user_id'])) {
                DemoAttempt::create([
                    'demo_user_id' => $validated['demo_user_id'],
                    'phrase' => $validated['phrase'],
                    'score' => $score,
                ]);
            }

            $feedback = $this->generateFeedback($score);

            return response()->json([
                'score' => round($score, 1),
                'feedback' => $feedback,
                'success' => true,
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Scoring failed. Please try again.',
            ], 500);
        }
    }

    private function generateFeedback(float $score): string
    {
        if ($score >= 80) {
            return 'Excellent pronunciation! Your clarity is impressive.';
        } elseif ($score >= 70) {
            return 'Good attempt! Focus on stressing the key syllables.';
        } elseif ($score >= 60) {
            return 'Nice try! Keep practicing the "r" and "l" sounds.';
        } else {
            return 'Keep practicing! Focus on speaking slowly and clearly.';
        }
    }
}