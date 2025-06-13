interface ProgressBarProps {
    progress: number;
    currentScene: number;
    totalScenes: number;
}

export function ProgressBar({ progress, currentScene, totalScenes }: ProgressBarProps) {
    return (
        <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900 p-4">
            <div className="mx-auto max-w-4xl">
                {/* Scene Counter */}
                <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                    <span>Hotel Crisis Demo</span>
                    <span>Scene {currentScene} of {totalScenes}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 w-full rounded-full bg-slate-700">
                    <div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                
                {/* Scene Markers */}
                <div className="mt-2 flex justify-between">
                    {Array.from({ length: totalScenes }, (_, index) => (
                        <div
                            key={index}
                            className={`h-2 w-2 rounded-full ${
                                index < currentScene
                                    ? 'bg-blue-500'
                                    : index === currentScene - 1
                                    ? 'bg-blue-400'
                                    : 'bg-slate-600'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}