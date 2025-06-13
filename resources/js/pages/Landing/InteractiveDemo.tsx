import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { InteractiveStory } from './components/InteractiveStory';
import { EmailCapture } from './components/EmailCapture';
import { Footer } from './components/Footer';

export default function InteractiveDemo() {
    const [showDemo, setShowDemo] = useState(false);
    const [showEmailCapture, setShowEmailCapture] = useState(false);
    const [finalScore, setFinalScore] = useState<number | null>(null);

    const handleStartDemo = () => {
        setShowDemo(true);
    };

    const handleDemoComplete = (score: number) => {
        setFinalScore(score);
        // For demo purposes, always show email capture
        // In production, this would be based on conversion logic
        setShowEmailCapture(true);
    };

    const handleSkipToEmail = () => {
        setShowEmailCapture(true);
    };

    return (
        <>
            <Head title="Master Crisis Communication - Hotel Manager Demo">
                <meta name="description" content="When crisis strikes, every word counts. Practice professional English pronunciation in high-pressure hotel management situations." />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
                {!showDemo && !showEmailCapture && (
                    <>
                        <HeroSection onStartDemo={handleStartDemo} onSkipToEmail={handleSkipToEmail} />
                        <Footer />
                    </>
                )}
                
                {showDemo && !showEmailCapture && (
                    <InteractiveStory 
                        onComplete={handleDemoComplete}
                        onSkipToEmail={handleSkipToEmail}
                    />
                )}
                
                {showEmailCapture && (
                    <>
                        <EmailCapture finalScore={finalScore} />
                        <Footer />
                    </>
                )}
            </div>
        </>
    );
}