import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PronunciationPractice } from './PronunciationPractice';
import { DialogueBubble } from './DialogueBubble';
import { Mic, RotateCcw, ArrowRight } from 'lucide-react';

interface Scene {
    id: number;
    type: 'dialogue' | 'narration' | 'choice';
    speaker?: string;
    content: string;
    userPrompt?: string;
    responseOptions?: string[];
    requiredPhrase?: string;
    minScore?: number;
}

interface StorySceneProps {
    scene: Scene;
    onComplete: (score: number) => void;
    canProgress: boolean;
    sceneIndex: number;
}

export function StoryScene({ scene, onComplete, canProgress, sceneIndex }: StorySceneProps) {
    const [showUserTurn, setShowUserTurn] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
    const [currentScore, setCurrentScore] = useState<number | null>(null);
    const [hasAttempted, setHasAttempted] = useState(false);

    // Auto-show user turn after scene content is displayed
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowUserTurn(true);
        }, sceneIndex === 0 ? 2000 : 1500); // Longer delay for first scene

        return () => clearTimeout(timer);
    }, [sceneIndex]);

    const handleResponseSelect = (response: string) => {
        setSelectedResponse(response);
    };

    const handlePronunciationScore = (score: number, feedback: string[]) => {
        setCurrentScore(score);
        setHasAttempted(true);
        onComplete(score);
    };

    const handleRetry = () => {
        setCurrentScore(null);
        setHasAttempted(false);
    };

    const getSceneImage = () => {
        // In production, these would be actual images
        if (scene.speaker === 'Journalist') {
            return '🎤'; // Would be journalist image
        }
        return '🏨'; // Would be hotel office image
    };

    const getBackgroundStyle = () => {
        if (scene.type === 'narration') {
            return 'bg-gradient-to-br from-slate-800 to-slate-900';
        }
        return 'bg-gradient-to-br from-blue-900 to-slate-900';
    };

    return (
        <div className={`rounded-2xl p-8 shadow-2xl ${getBackgroundStyle()}`}>
            {/* Scene Image/Avatar */}
            <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-700 text-4xl">
                    {getSceneImage()}
                </div>
            </div>

            {/* Scene Content */}
            {scene.type === 'dialogue' ? (
                <DialogueBubble speaker={scene.speaker!} content={scene.content} />
            ) : (
                <div className="mb-6 text-center">
                    <p className="text-lg italic text-slate-300 leading-relaxed">
                        {scene.content}
                    </p>
                </div>
            )}

            {/* User Turn */}
            {showUserTurn && (
                <div className="mt-8 rounded-xl bg-slate-800 p-6">
                    <div className="mb-4">
                        <h3 className="mb-2 text-lg font-semibold text-yellow-400">
                            Your Turn
                        </h3>
                        <p className="text-slate-300">
                            {scene.userPrompt}
                        </p>
                    </div>

                    {/* Response Options (if multiple choice) */}
                    {scene.responseOptions && (
                        <div className="mb-4 space-y-2">
                            {scene.responseOptions.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleResponseSelect(option)}
                                    className={`block w-full rounded-lg p-3 text-left transition-colors ${
                                        selectedResponse === option
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                                >
                                    <span className="font-medium text-sm text-slate-400 mr-2">
                                        {String.fromCharCode(65 + index)}:
                                    </span>
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Pronunciation Practice */}
                    {scene.requiredPhrase && (
                        <PronunciationPractice
                            phrase={selectedResponse || scene.requiredPhrase}
                            onScore={handlePronunciationScore}
                            disabled={scene.responseOptions ? !selectedResponse : false}
                            currentScore={currentScore}
                            hasAttempted={hasAttempted}
                            minScore={scene.minScore || 60}
                        />
                    )}

                    {/* Retry Button */}
                    {hasAttempted && currentScore && currentScore < (scene.minScore || 60) && (
                        <div className="mt-4 text-center">
                            <Button
                                onClick={handleRetry}
                                variant="outline"
                                className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-slate-900"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Try Again for Better Score
                            </Button>
                        </div>
                    )}

                    {/* Progress Indicator */}
                    {canProgress && (
                        <div className="mt-4 text-center">
                            <div className="inline-flex items-center rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white">
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Moving to next scene...
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}