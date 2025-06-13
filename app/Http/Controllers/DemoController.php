<?php

namespace App\Http\Controllers;

use App\Models\DemoLead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DemoController extends Controller
{
    public function checkPronunciation(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phrase' => 'required|string|max:255',
            'audio' => 'string|nullable', // Base64 audio data for future use
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Invalid input',
                'errors' => $validator->errors()
            ], 422);
        }

        $phrase = $request->input('phrase');
        
        // Generate mock score based on phrase complexity and random variation
        $mockScore = $this->calculateMockScore($phrase);
        $feedback = $this->getInstantFeedback($phrase, $mockScore);
        
        return response()->json([
            'score' => $mockScore,
            'canProgress' => $mockScore >= 60, // Must score 60% to continue
            'feedback' => $feedback,
            'pronunciationReport' => $this->generatePronunciationReport($phrase, $mockScore)
        ]);
    }

    public function captureEmail(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'first_name' => 'nullable|string|max:100',
            'demo_score' => 'nullable|numeric|between:0,100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Invalid input',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DemoLead::updateOrCreate(
                ['email' => $request->email],
                [
                    'first_name' => $request->first_name,
                    'source' => 'email_capture',
                    'demo_score' => $request->demo_score,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Email captured successfully. Check your inbox for free lessons!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to capture email. Please try again.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    private function calculateMockScore(string $phrase): int
    {
        // Mock scoring algorithm based on phrase difficulty
        $baseScore = 70;
        $difficulty = $this->getPhraseDifficulty($phrase);
        
        // Adjust base score by difficulty
        $adjustedScore = $baseScore - ($difficulty * 5);
        
        // Add random variation (±15 points)
        $variation = rand(-15, 15);
        $finalScore = max(45, min(95, $adjustedScore + $variation));
        
        return $finalScore;
    }

    private function getPhraseDifficulty(string $phrase): int
    {
        $difficultWords = [
            'allegations' => 3,
            'thoroughly' => 2,
            'investigate' => 2,
            'satisfaction' => 2,
            'responsibility' => 3,
            'appreciate' => 1,
            'concern' => 1,
            'seriously' => 2,
        ];

        $words = str_word_count(strtolower($phrase), 1);
        $totalDifficulty = 0;

        foreach ($words as $word) {
            $totalDifficulty += $difficultWords[$word] ?? 0;
        }

        return min(5, $totalDifficulty); // Cap at difficulty level 5
    }

    private function getInstantFeedback(string $phrase, int $score): array
    {
        $feedback = [];
        $words = str_word_count(strtolower($phrase), 1);

        // Common pronunciation issues for Japanese speakers
        $commonIssues = [
            'allegations' => 'Focus on the \'g\' sound - it should be soft like \'j\'',
            'seriously' => 'Watch the \'r\' sound - don\'t roll it',
            'thoroughly' => 'The \'th\' sound is crucial here',
            'investigate' => 'Break it down: in-VES-ti-gate',
            'responsibility' => 'Stress on the third syllable: respon-si-BIL-ity',
            'satisfaction' => 'The \'t\' sound should be clear but not harsh',
        ];

        foreach ($words as $word) {
            if (isset($commonIssues[$word])) {
                if ($score < 75) {
                    $feedback[] = "⚠️ " . ucfirst($word) . ": " . $commonIssues[$word];
                } else {
                    $feedback[] = "✓ " . ucfirst($word) . ": Good pronunciation!";
                }
            }
        }

        // General feedback based on score
        if ($score >= 85) {
            $feedback[] = "🎉 Excellent! Your pronunciation is very clear.";
        } elseif ($score >= 70) {
            $feedback[] = "👍 Good work! A few areas to polish.";
        } elseif ($score >= 60) {
            $feedback[] = "💡 You can progress, but try to improve your clarity.";
        } else {
            $feedback[] = "📚 Practice a bit more before moving on. You've got this!";
        }

        return $feedback;
    }

    private function generatePronunciationReport(string $phrase, int $overallScore): array
    {
        $words = str_word_count(strtolower($phrase), 1);
        $report = [];

        foreach ($words as $word) {
            $wordScore = max(40, min(100, $overallScore + rand(-20, 20)));
            $issue = null;

            // Common issues for specific words
            if ($word === 'allegations' && $wordScore < 75) {
                $issue = 'g_sound';
            } elseif ($word === 'seriously' && $wordScore < 75) {
                $issue = 'r_sound';
            } elseif ($word === 'thoroughly' && $wordScore < 75) {
                $issue = 'th_sound';
            }

            $report[$word] = [
                'score' => $wordScore,
                'issue' => $issue
            ];
        }

        return $report;
    }
}