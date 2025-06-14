<?php

namespace App\Http\Controllers;

use App\Models\DemoAccess;
use App\Models\PronunciationLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PronunciationController extends Controller
{
    private const AZURE_COST_PER_MINUTE = 0.001; // $0.001 per minute
    private const DAILY_COST_LIMIT = 25.00; // $25 daily limit

    public function analyze(Request $request)
    {
        // Check if demo is paused due to cost limits
        if (Cache::get('demo_paused', false)) {
            return response()->json([
                'error' => 'Demo temporarily unavailable. Please try again tomorrow.',
                'code' => 'DEMO_PAUSED'
            ], 503);
        }

        // Validate demo access token
        $token = $request->header('X-Demo-Token');
        if (!$token) {
            return response()->json(['error' => 'Demo access token required'], 401);
        }

        $access = DemoAccess::where('access_token', $token)
            ->where('expires_at', '>', now())
            ->first();

        if (!$access || !$access->canAttempt()) {
            return response()->json([
                'error' => 'Demo limit reached or access expired',
                'code' => 'ACCESS_LIMIT_REACHED'
            ], 429);
        }

        $request->validate([
            'phrase' => 'required|string|max:200',
            'audio' => 'required|file|mimes:wav,mp3,m4a|max:10240', // 10MB max
        ]);

        try {
            // For now, return mock data since we don't have Azure keys
            $mockScore = $this->generateMockScore($request->phrase);
            $mockFeedback = $this->generateMockFeedback($request->phrase, $mockScore);
            
            // Estimate cost (mock calculation)
            $estimatedCost = $this->estimateAzureCost($request->file('audio'));

            // Log the pronunciation attempt
            PronunciationLog::create([
                'email' => $access->email,
                'phrase' => $request->phrase,
                'score' => $mockScore,
                'azure_cost' => $estimatedCost,
                'ip_address' => $request->ip(),
                'feedback' => $mockFeedback,
            ]);

            // Decrement attempts
            $access->decrementAttempts();
            $access->increment('estimated_azure_cost', $estimatedCost);

            return response()->json([
                'score' => $mockScore,
                'canProgress' => $mockScore >= 60,
                'feedback' => $mockFeedback,
                'attemptsRemaining' => $access->attempts_remaining,
                'pronunciation_report' => $this->generatePronunciationReport($request->phrase, $mockScore),
            ]);

        } catch (\Exception $e) {
            Log::error('Pronunciation analysis failed', [
                'error' => $e->getMessage(),
                'email' => $access->email,
                'phrase' => $request->phrase,
            ]);

            return response()->json([
                'error' => 'Analysis failed. Please try again.',
                'code' => 'ANALYSIS_FAILED'
            ], 500);
        }
    }

    private function generateMockScore(string $phrase): int
    {
        // Generate realistic scores based on phrase difficulty for Japanese speakers
        $difficultWords = ['allegations', 'thoroughly', 'seriously', 'responsibility'];
        $easyWords = ['appreciate', 'concern', 'customer', 'help'];
        
        $baseScore = 75; // Base score
        $phrase = strtolower($phrase);
        
        foreach ($difficultWords as $word) {
            if (str_contains($phrase, $word)) {
                $baseScore -= rand(10, 25);
            }
        }
        
        foreach ($easyWords as $word) {
            if (str_contains($phrase, $word)) {
                $baseScore += rand(5, 15);
            }
        }
        
        return max(45, min(95, $baseScore + rand(-10, 10)));
    }

    private function generateMockFeedback(string $phrase, int $score): array
    {
        $feedback = [];
        
        if ($score < 60) {
            $feedback[] = "Practice more to improve clarity";
        } elseif ($score < 80) {
            $feedback[] = "Good pronunciation, focus on specific sounds";
        } else {
            $feedback[] = "Excellent pronunciation!";
        }

        // Add specific feedback based on common Japanese pronunciation challenges
        if (str_contains(strtolower($phrase), 'r')) {
            $feedback[] = "Focus on the 'r' sound - try to tap your tongue";
        }
        
        if (str_contains(strtolower($phrase), 'th')) {
            $feedback[] = "Remember to put your tongue between your teeth for 'th'";
        }
        
        if (str_contains(strtolower($phrase), 'allegations')) {
            $feedback[] = "Watch the 'g' sound in 'allegations'";
        }

        return $feedback;
    }

    private function generatePronunciationReport(string $phrase, int $score): array
    {
        $words = explode(' ', strtolower($phrase));
        $report = [];
        
        foreach ($words as $word) {
            $wordScore = $score + rand(-15, 15);
            $wordScore = max(30, min(100, $wordScore));
            
            $issue = null;
            if ($wordScore < 70) {
                if (str_contains($word, 'r')) $issue = 'r_sound';
                elseif (str_contains($word, 'th')) $issue = 'th_sound';
                elseif (str_contains($word, 'g')) $issue = 'g_sound';
                else $issue = 'clarity';
            }
            
            $report[$word] = [
                'score' => $wordScore,
                'issue' => $issue,
            ];
        }
        
        return $report;
    }

    private function estimateAzureCost($audioFile): float
    {
        // Estimate based on file size (rough approximation)
        $fileSizeKB = $audioFile->getSize() / 1024;
        $estimatedSeconds = $fileSizeKB / 8; // Rough estimate
        $estimatedMinutes = $estimatedSeconds / 60;
        
        return round($estimatedMinutes * self::AZURE_COST_PER_MINUTE, 4);
    }

    // This would be the real Azure integration when ready
    private function callAzureSpeechAPI(Request $request, string $phrase)
    {
        // Placeholder for actual Azure Speech API integration
        $azureKey = env('AZURE_SPEECH_KEY');
        $azureRegion = env('AZURE_SPEECH_REGION');
        
        if (!$azureKey || !$azureRegion) {
            throw new \Exception('Azure Speech API not configured');
        }

        // Real implementation would go here
        // $response = Http::withHeaders([
        //     'Ocp-Apim-Subscription-Key' => $azureKey,
        //     'Content-Type' => 'audio/wav',
        // ])->post("https://{$azureRegion}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1", [
        //     'language' => 'en-US',
        //     'format' => 'detailed',
        // ]);

        return null; // Mock for now
    }
}