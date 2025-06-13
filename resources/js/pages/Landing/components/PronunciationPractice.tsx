import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { router } from '@inertiajs/react';

interface PronunciationPracticeProps {
    phrase: string;
    onScore: (score: number, feedback: string[]) => void;
    disabled?: boolean;
    currentScore: number | null;
    hasAttempted: boolean;
    minScore: number;
}

interface PronunciationResponse {
    score: number;
    canProgress: boolean;
    feedback: string[];
    pronunciationReport: Record<string, { score: number; issue: string | null }>;
}

export function PronunciationPractice({ 
    phrase, 
    onScore, 
    disabled = false, 
    currentScore, 
    hasAttempted,
    minScore 
}: PronunciationPracticeProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [feedback, setFeedback] = useState<string[]>([]);

    const handleStartRecording = async () => {
        if (disabled) return;

        setIsRecording(true);
        setIsProcessing(false);

        // Simulate recording for 2-3 seconds
        setTimeout(() => {
            setIsRecording(false);
            setIsProcessing(true);
            
            // Send to backend for processing
            processPronunciation();
        }, Math.random() * 1000 + 2000);
    };

    const processPronunciation = async () => {
        try {
            const response = await fetch('/api/demo/pronunciation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    phrase: phrase,
                    audio: null // Would contain actual audio data in production
                })
            });

            if (!response.ok) {
                throw new Error('Failed to process pronunciation');
            }

            const data: PronunciationResponse = await response.json();
            
            setFeedback(data.feedback);
            setIsProcessing(false);
            onScore(data.score, data.feedback);

        } catch (error) {
            console.error('Pronunciation processing error:', error);
            setIsProcessing(false);
            // Fallback to mock score if API fails
            const mockScore = Math.floor(Math.random() * 40) + 60;
            const mockFeedback = ['📱 Demo mode: Real pronunciation assessment coming soon!'];
            setFeedback(mockFeedback);
            onScore(mockScore, mockFeedback);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-400';
        if (score >= 70) return 'text-yellow-400';
        if (score >= 60) return 'text-orange-400';
        return 'text-red-400';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 85) return 'Excellent!';
        if (score >= 70) return 'Good';
        if (score >= 60) return 'Acceptable';
        return 'Needs Practice';
    };

    return (
        <div className="space-y-4">
            {/* Phrase to Practice */}
            <div className="rounded-lg bg-slate-700 p-4">
                <h4 className="mb-2 text-sm font-medium text-slate-400">Practice this phrase:</h4>
                <p className="text-lg font-semibold text-white">"{phrase}"</p>
            </div>

            {/* Recording Button */}
            <div className="text-center">
                {!hasAttempted && (
                    <Button
                        onClick={handleStartRecording}
                        disabled={disabled || isRecording || isProcessing}
                        size="lg"
                        className={`${
                            isRecording 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        } text-white px-8 py-3`}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : isRecording ? (
                            <>
                                <MicOff className="mr-2 h-5 w-5" />
                                Recording... (speak now)
                            </>
                        ) : (
                            <>
                                <Mic className="mr-2 h-5 w-5" />
                                Record Your Response
                            </>
                        )}
                    </Button>
                )}

                {disabled && (
                    <p className="text-sm text-slate-400 mt-2">
                        Select a response option first
                    </p>
                )}
            </div>

            {/* Recording Visualization */}
            {isRecording && (
                <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-2 bg-red-500 rounded-full animate-pulse"
                            style={{
                                height: `${Math.random() * 20 + 10}px`,
                                animationDelay: `${i * 100}ms`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Score Display */}
            {hasAttempted && currentScore !== null && (
                <div className="rounded-lg bg-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-400">Your Score:</span>
                        <span className={`text-2xl font-bold ${getScoreColor(currentScore)}`}>
                            {currentScore}%
                        </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-slate-500">Performance:</span>
                        <span className={`text-sm font-medium ${getScoreColor(currentScore)}`}>
                            {getScoreLabel(currentScore)}
                        </span>
                    </div>
                    
                    {/* Progress Indicator */}
                    <div className="w-full bg-slate-600 rounded-full h-2 mb-3">
                        <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                                currentScore >= 85 ? 'bg-green-500' :
                                currentScore >= 70 ? 'bg-yellow-500' :
                                currentScore >= 60 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${currentScore}%` }}
                        />
                    </div>

                    {/* Progression Status */}
                    {currentScore >= minScore ? (
                        <div className="text-green-400 text-sm font-medium">
                            ✅ You can progress to the next scene!
                        </div>
                    ) : (
                        <div className="text-red-400 text-sm font-medium">
                            ⚠️ Score {minScore}% or higher to continue
                        </div>
                    )}
                </div>
            )}

            {/* Feedback */}
            {feedback.length > 0 && (
                <div className="rounded-lg bg-slate-700 p-4">
                    <h5 className="mb-2 text-sm font-medium text-slate-400">Feedback:</h5>
                    <div className="space-y-1">
                        {feedback.map((item, index) => (
                            <p key={index} className="text-sm text-slate-300">
                                {item}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}