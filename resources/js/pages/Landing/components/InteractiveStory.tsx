import { useState, useEffect } from 'react';
import { StoryScene } from './StoryScene';
import { StoryConclusion } from './StoryConclusion';
import { ProgressBar } from './ProgressBar';
import { X } from 'lucide-react';

interface InteractiveStoryProps {
    onComplete: (score: number) => void;
    onSkipToEmail: () => void;
}

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

const STORY_SCENES: Scene[] = [
    {
        id: 1,
        type: 'dialogue',
        speaker: 'Journalist',
        content: 'Ms. Hayes, I need to speak with you. It\'s urgent.',
        userPrompt: 'Respond professionally',
        requiredPhrase: 'Of course. How can I help you?',
        minScore: 60
    },
    {
        id: 2,
        type: 'dialogue',
        speaker: 'Journalist',
        content: 'I have evidence your hotel promised "luxury dining experiences" that don\'t exist. What\'s your response?',
        userPrompt: 'Choose your response carefully - this could make headlines',
        responseOptions: [
            'I appreciate your concern',
            'That\'s completely false!',
            'No comment'
        ],
        requiredPhrase: 'I appreciate your concern',
        minScore: 60
    },
    {
        id: 3,
        type: 'narration',
        content: 'The journalist leans forward, recording device in hand. Your next words could appear in tomorrow\'s headlines...',
        userPrompt: 'Maintain your professionalism under pressure',
        requiredPhrase: 'Let me investigate these allegations thoroughly',
        minScore: 60
    },
    {
        id: 4,
        type: 'dialogue',
        speaker: 'Journalist',
        content: 'Our readers deserve answers. Will you take responsibility?',
        userPrompt: 'Show your commitment to customer satisfaction',
        requiredPhrase: 'We take customer satisfaction seriously',
        minScore: 60
    }
];

export function InteractiveStory({ onComplete, onSkipToEmail }: InteractiveStoryProps) {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [sceneScores, setSceneScores] = useState<number[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [userCanProgress, setUserCanProgress] = useState(false);

    const currentScene = STORY_SCENES[currentSceneIndex];
    const progress = ((currentSceneIndex + 1) / STORY_SCENES.length) * 100;

    const handleSceneComplete = (score: number) => {
        const newScores = [...sceneScores, score];
        setSceneScores(newScores);
        setUserCanProgress(score >= (currentScene.minScore || 60));

        if (currentSceneIndex < STORY_SCENES.length - 1) {
            // Move to next scene after a brief delay if score is good enough
            if (score >= (currentScene.minScore || 60)) {
                setTimeout(() => {
                    setCurrentSceneIndex(currentSceneIndex + 1);
                    setUserCanProgress(false);
                }, 2000);
            }
        } else {
            // Story completed
            setTimeout(() => {
                setIsCompleted(true);
            }, 2000);
        }
    };

    const calculateOverallScore = (): number => {
        if (sceneScores.length === 0) return 0;
        return Math.round(sceneScores.reduce((sum, score) => sum + score, 0) / sceneScores.length);
    };

    const handleStoryComplete = () => {
        const overallScore = calculateOverallScore();
        onComplete(overallScore);
    };

    if (isCompleted) {
        return (
            <StoryConclusion 
                overallScore={calculateOverallScore()}
                sceneScores={sceneScores}
                onComplete={handleStoryComplete}
                onSkipToEmail={onSkipToEmail}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white relative">
            {/* Exit Button */}
            <button
                onClick={onSkipToEmail}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
            >
                <X className="h-5 w-5" />
            </button>

            {/* Progress Bar */}
            <ProgressBar progress={progress} currentScene={currentSceneIndex + 1} totalScenes={STORY_SCENES.length} />

            {/* Story Scene */}
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
                <div className="w-full max-w-4xl">
                    <StoryScene
                        scene={currentScene}
                        onComplete={handleSceneComplete}
                        canProgress={userCanProgress}
                        sceneIndex={currentSceneIndex}
                    />
                </div>
            </div>

            {/* Story Progress */}
            <div className="absolute bottom-4 left-4 text-xs text-slate-400">
                Scene {currentSceneIndex + 1} of {STORY_SCENES.length}
            </div>
        </div>
    );
}