import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Mic, MicOff, Play, RotateCcw, Volume2 } from 'lucide-react';

export default function Demo() {
    const [phrase, setPhrase] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [hasRecorded, setHasRecorded] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [feedback, setFeedback] = useState('');
    const [showEmailCapture, setShowEmailCapture] = useState(false);
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        name: '',
        company: '',
    });

    // Fetch the phrase on component mount
    useEffect(() => {
        fetch('/api/demo/phrase')
            .then(response => response.json())
            .then(data => setPhrase(data.phrase))
            .catch(console.error);
    }, []);

    const playPronunciation = () => {
        setIsPlaying(true);
        // Mock audio playback
        setTimeout(() => setIsPlaying(false), 2000);
        
        // Use Web Speech API for demo purposes
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(phrase);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        }
    };

    const startRecording = () => {
        setIsRecording(true);
        setHasRecorded(false);
        setScore(null);
        setFeedback('');
        
        // Mock recording for 3 seconds
        setTimeout(() => {
            setIsRecording(false);
            setHasRecorded(true);
            
            // Submit for scoring
            fetch('/api/demo/score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    phrase: phrase,
                }),
            })
            .then(response => response.json())
            .then(data => {
                setScore(data.score);
                setFeedback(data.feedback);
                
                // Show email capture after first attempt
                if (!emailSubmitted) {
                    setShowEmailCapture(true);
                }
            })
            .catch(console.error);
        }, 3000);
    };

    const resetDemo = () => {
        setIsRecording(false);
        setHasRecorded(false);
        setScore(null);
        setFeedback('');
        setShowEmailCapture(false);
    };

    const submitEmail: FormEventHandler = (e) => {
        e.preventDefault();

        post('/api/demo/register', {
            onSuccess: () => {
                setEmailSubmitted(true);
                setShowEmailCapture(false);
                reset();
            },
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 70) return 'text-blue-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBackground = (score: number) => {
        if (score >= 80) return 'bg-green-100 dark:bg-green-900';
        if (score >= 70) return 'bg-blue-100 dark:bg-blue-900';
        if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
        return 'bg-red-100 dark:bg-red-900';
    };

    return (
        <>
            <Head title="Pronunciation Demo - Compel English" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                {/* Header */}
                <header className="container mx-auto px-6 py-4">
                    <nav className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2 text-blue-900 dark:text-blue-100">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-2xl font-bold">Compel English</span>
                        </Link>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Free Demo
                        </div>
                    </nav>
                </header>

                <div className="container mx-auto px-6 py-8 max-w-4xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Pronunciation Demo
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Practice pronouncing this business English phrase and get instant AI feedback
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Demo Interface */}
                        <Card className="bg-white dark:bg-gray-800 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-center text-2xl text-gray-900 dark:text-white">
                                    Practice Phrase
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Phrase Display */}
                                <div className="text-center">
                                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-4">
                                        <p className="text-3xl font-mono text-blue-600 dark:text-blue-400 mb-2">
                                            "{phrase}"
                                        </p>
                                        <Button
                                            onClick={playPronunciation}
                                            variant="outline"
                                            disabled={isPlaying}
                                            className="mt-2"
                                        >
                                            {isPlaying ? (
                                                <>
                                                    <Volume2 className="w-4 h-4 mr-2 animate-pulse" />
                                                    Playing...
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Listen
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Recording Interface */}
                                <div className="text-center">
                                    {!hasRecorded && !isRecording && (
                                        <Button
                                            onClick={startRecording}
                                            size="lg"
                                            className="bg-red-600 hover:bg-red-700 text-white w-32 h-32 rounded-full"
                                        >
                                            <div className="flex flex-col items-center">
                                                <Mic className="w-8 h-8 mb-2" />
                                                <span className="text-sm">Record</span>
                                            </div>
                                        </Button>
                                    )}

                                    {isRecording && (
                                        <div className="space-y-4">
                                            <Button
                                                size="lg"
                                                disabled
                                                className="bg-red-600 w-32 h-32 rounded-full animate-pulse"
                                            >
                                                <div className="flex flex-col items-center">
                                                    <MicOff className="w-8 h-8 mb-2" />
                                                    <span className="text-sm">Recording...</span>
                                                </div>
                                            </Button>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Speak the phrase clearly...
                                            </p>
                                        </div>
                                    )}

                                    {hasRecorded && score !== null && (
                                        <div className="space-y-4">
                                            {/* Score Display */}
                                            <div className={`p-6 rounded-lg ${getScoreBackground(score)}`}>
                                                <div className="text-center">
                                                    <div className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}>
                                                        {score}%
                                                    </div>
                                                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                                                        {feedback}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex justify-center space-x-4">
                                                <Button
                                                    onClick={resetDemo}
                                                    variant="outline"
                                                    className="flex items-center"
                                                >
                                                    <RotateCcw className="w-4 h-4 mr-2" />
                                                    Try Again
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Instructions */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                        How it works:
                                    </h4>
                                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                        <li>1. Listen to the correct pronunciation</li>
                                        <li>2. Click the record button and speak clearly</li>
                                        <li>3. Get instant AI feedback on your pronunciation</li>
                                        <li>4. Practice until you achieve higher scores!</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Email Capture or Success Message */}
                        <Card className="bg-white dark:bg-gray-800 shadow-xl">
                            <CardContent className="p-8">
                                {emailSubmitted ? (
                                    <div className="text-center">
                                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            Thank you!
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                                            We'll notify you when the full course becomes available with your 50% early access discount.
                                        </p>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                                Keep practicing! Try the demo as many times as you'd like.
                                            </p>
                                        </div>
                                    </div>
                                ) : showEmailCapture ? (
                                    <>
                                        <div className="text-center mb-6">
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                Want More?
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                Get early access to the full course with immersive stories and advanced AI feedback
                                            </p>
                                        </div>

                                        <form onSubmit={submitEmail} className="space-y-4">
                                            <div>
                                                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                                                    Email Address *
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    required
                                                    className="mt-1"
                                                    placeholder="your.email@company.com"
                                                />
                                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                                                        Name
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        className="mt-1"
                                                        placeholder="Your name"
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="company" className="text-gray-700 dark:text-gray-300">
                                                        Company
                                                    </Label>
                                                    <Input
                                                        id="company"
                                                        value={data.company}
                                                        onChange={(e) => setData('company', e.target.value)}
                                                        className="mt-1"
                                                        placeholder="Your company"
                                                    />
                                                </div>
                                            </div>

                                            <Button 
                                                type="submit" 
                                                disabled={processing}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                {processing ? 'Submitting...' : 'Get Early Access - 50% Off'}
                                            </Button>
                                        </form>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                            Ready to Get Started?
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                                            This is just a taste of what Compel English offers. Our full course includes:
                                        </p>
                                        <div className="text-left space-y-3 mb-6">
                                            <div className="flex items-center">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                                <span className="text-gray-700 dark:text-gray-300">Immersive business thriller stories</span>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                                <span className="text-gray-700 dark:text-gray-300">Advanced AI pronunciation analysis</span>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                                <span className="text-gray-700 dark:text-gray-300">Progress tracking and personalized lessons</span>
                                            </div>
                                            <div className="flex items-center">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                                <span className="text-gray-700 dark:text-gray-300">Designed for Japanese speakers</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Try recording the phrase above to see your pronunciation score!
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Back to Landing */}
                    <div className="text-center mt-8">
                        <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            ← Back to Landing Page
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}