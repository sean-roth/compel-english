<?php

namespace App\Http\Controllers;

use App\Models\DemoLead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DemoController extends Controller
{
    /**
     * Process recording and return mock pronunciation feedback.
     */
    public function processRecording(Request $request): JsonResponse
    {
        // For demo purposes, return mock score and feedback
        $mockScore = rand(65, 85);
        $feedback = $this->generateMockFeedback();
        
        return response()->json([
            'score' => $mockScore,
            'feedback' => $feedback,
            'pronunciationReport' => [
                'appreciate' => ['score' => rand(70, 95), 'issue' => null],
                'allegations' => ['score' => rand(50, 70), 'issue' => 'g_sound'],
                'seriously' => ['score' => rand(55, 75), 'issue' => 'r_sound'],
                'statement' => ['score' => rand(75, 90), 'issue' => null]
            ]
        ]);
    }

    /**
     * Capture email for lead generation.
     */
    public function captureEmail(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:demo_leads,email',
            'first_name' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $lead = DemoLead::create([
            'email' => $request->email,
            'first_name' => $request->first_name,
            'source' => 'email_capture',
            'demo_score' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you! Check your email for the free lessons.'
        ]);
    }

    /**
     * Generate mock pronunciation feedback.
     */
    private function generateMockFeedback(): array
    {
        $feedbackOptions = [
            [
                'good' => ['Clear "concern" pronunciation', 'Good emphasis on "customer"', 'Excellent "satisfaction" clarity'],
                'practice' => [
                    '"Allegations" - focus on the \'g\' sound',
                    '"Seriously" - watch the \'r\' sound',
                    '"Investigation" - slow down on longer words'
                ]
            ],
            [
                'good' => ['Strong opening tone', 'Clear "appreciate" pronunciation'],
                'practice' => [
                    '"Statement" - emphasize the first syllable',
                    '"Allegations" - practice the middle syllables',
                    'Overall pace - speak slightly slower'
                ]
            ],
            [
                'good' => ['Confident delivery', 'Good word stress on "investigate"'],
                'practice' => [
                    '"Customer" - work on the \'s\' sound',
                    '"Seriously" - R/L distinction needs work',
                    'Intonation - rise at the end of questions'
                ]
            ]
        ];

        return $feedbackOptions[array_rand($feedbackOptions)];
    }
}