import { useState, useEffect } from 'react';

interface DialogueBubbleProps {
    speaker: string;
    content: string;
    autoPlay?: boolean;
}

export function DialogueBubble({ speaker, content, autoPlay = true }: DialogueBubbleProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (autoPlay) {
            let currentIndex = 0;
            const interval = setInterval(() => {
                if (currentIndex <= content.length) {
                    setDisplayedText(content.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    setIsComplete(true);
                    clearInterval(interval);
                }
            }, 30); // Typing speed

            return () => clearInterval(interval);
        } else {
            setDisplayedText(content);
            setIsComplete(true);
        }
    }, [content, autoPlay]);

    const getSpeakerStyle = () => {
        switch (speaker.toLowerCase()) {
            case 'journalist':
                return 'bg-red-900 border-red-700 text-red-100';
            case 'amelia':
            case 'you':
                return 'bg-blue-900 border-blue-700 text-blue-100';
            default:
                return 'bg-slate-800 border-slate-600 text-slate-100';
        }
    };

    const getSpeakerIcon = () => {
        switch (speaker.toLowerCase()) {
            case 'journalist':
                return '🎤';
            case 'amelia':
            case 'you':
                return '👩‍💼';
            default:
                return '💬';
        }
    };

    return (
        <div className="mb-6">
            {/* Speaker Header */}
            <div className="mb-3 flex items-center">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-700">
                    <span className="text-lg">{getSpeakerIcon()}</span>
                </div>
                <div>
                    <h3 className="font-semibold text-white">{speaker}</h3>
                    <div className="text-xs text-slate-400">
                        {speaker === 'Journalist' ? 'Business Daily Reporter' : 'Hotel Manager'}
                    </div>
                </div>
            </div>

            {/* Dialogue Bubble */}
            <div className={`relative rounded-2xl border-2 p-6 ${getSpeakerStyle()}`}>
                {/* Speech bubble arrow */}
                <div 
                    className={`absolute -top-2 left-6 h-4 w-4 rotate-45 border-l-2 border-t-2 ${getSpeakerStyle()}`}
                />
                
                {/* Dialogue Text */}
                <p className="text-lg leading-relaxed">
                    {displayedText}
                    {!isComplete && (
                        <span className="animate-pulse text-yellow-400">|</span>
                    )}
                </p>
            </div>

            {/* Audio Play Button (placeholder for future audio integration) */}
            {isComplete && (
                <div className="mt-3 text-center">
                    <button className="text-xs text-slate-400 hover:text-slate-300 transition-colors">
                        🔊 Replay Audio (Coming Soon)
                    </button>
                </div>
            )}
        </div>
    );
}