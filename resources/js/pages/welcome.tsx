import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PronunciationReport {
    [key: string]: {
        score: number;
        issue: string | null;
    };
}

interface FeedbackData {
    score: number;
    feedback: {
        good: string[];
        practice: string[];
    };
    pronunciationReport: PronunciationReport;
}

export default function Welcome() {
    const [demoStep, setDemoStep] = useState<'hero' | 'context' | 'practice' | 'feedback' | 'checkout'>('hero');
    const [isRecording, setIsRecording] = useState(false);
    const [hasRecorded, setHasRecorded] = useState(false);
    const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const phrases = [
        "I appreciate your concern",
        "Let me investigate these allegations",
        "We take customer satisfaction seriously",
        "I'll provide a full statement shortly"
    ];

    const startDemo = () => {
        setDemoStep('context');
    };

    const startPractice = () => {
        setDemoStep('practice');
    };

    const toggleRecording = () => {
        if (isRecording) {
            // Stop recording and process
            setIsRecording(false);
            setHasRecorded(true);
            processMockRecording();
        } else {
            // Start recording
            setIsRecording(true);
            setHasRecorded(false);
        }
    };

    const processMockRecording = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/demo/record', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ phrases })
            });

            if (response.ok) {
                const data = await response.json();
                setFeedbackData(data);
                setTimeout(() => {
                    setDemoStep('feedback');
                    setIsLoading(false);
                }, 1500);
            }
        } catch (error) {
            console.error('Error processing recording:', error);
            setIsLoading(false);
        }
    };

    const openCheckout = async () => {
        if (!email) {
            alert('Please enter your email address');
            return;
        }

        try {
            const response = await fetch('/api/checkout/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (data.success) {
                // In production, this would redirect to ChargeBee
                alert(`Demo Mode: Would redirect to checkout\nURL: ${data.url}`);
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
        }
    };

    const handleEmailCapture = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/demo/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ email, first_name: firstName })
            });

            const data = await response.json();
            if (data.success) {
                alert(data.message);
                setEmail('');
                setFirstName('');
            } else {
                alert('Error: ' + (data.errors?.email?.[0] || 'Please try again'));
            }
        } catch (error) {
            console.error('Error capturing email:', error);
            alert('Error capturing email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderHero = () => (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        When Crisis Strikes, Every Word Counts
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-slate-300">
                        Master professional English pronunciation in high-pressure situations
                    </p>
                    
                    <div className="mb-12 bg-slate-800 rounded-lg p-6 shadow-2xl">
                        <p className="text-lg mb-4 text-slate-300">Preview: Hotel Crisis Scenario</p>
                        <div className="bg-slate-700 rounded p-4 mb-4">
                            <p className="text-sm text-slate-400 mb-2">🎬 30-second teaser would play here</p>
                            <p className="text-slate-300">"Ms. Hayes, I have evidence your hotel promised luxury dining experiences that don't exist. What's your response?"</p>
                        </div>
                    </div>

                    <Button 
                        onClick={startDemo}
                        size="lg"
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold"
                    >
                        Try Free Demo
                    </Button>
                </div>
            </div>
        </div>
    );

    const renderContext = () => (
        <div className="min-h-screen bg-slate-100 py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="shadow-2xl">
                        <CardHeader className="bg-slate-800 text-white text-center">
                            <CardTitle className="text-2xl">Crisis Scenario Setup</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="bg-slate-200 rounded-lg p-6 mb-6">
                                        <p className="text-sm text-slate-600 mb-2">🏨 Hotel Manager's Office</p>
                                        <p className="text-slate-800">Image: Amelia Hayes at her desk would appear here</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">You are Amelia Hayes</h3>
                                    <p className="text-slate-700 mb-4">
                                        Hotel Manager at the prestigious Grandview Hotel. A journalist from Business Daily 
                                        confronts you with serious allegations.
                                    </p>
                                    <p className="text-slate-800 font-medium mb-6">
                                        Your response could save or sink your hotel's reputation.
                                    </p>
                                    
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                        <p className="text-red-800 font-medium">🎤 Journalist says:</p>
                                        <p className="text-red-700 italic">
                                            "Ms. Hayes, I have evidence your hotel promised 'luxury dining experiences' 
                                            that don't exist. What's your response?"
                                        </p>
                                        <audio ref={audioRef} className="w-full mt-2" controls>
                                            <source src="/audio/journalist-confrontation.mp3" type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>
                                    
                                    <Button 
                                        onClick={startPractice}
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        size="lg"
                                    >
                                        Practice Your Response
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

    const renderPractice = () => (
        <div className="min-h-screen bg-slate-100 py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="shadow-2xl">
                        <CardHeader className="bg-blue-600 text-white text-center">
                            <CardTitle className="text-2xl">Pronunciation Practice</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <h3 className="text-xl font-semibold mb-6">Practice These Key Phrases:</h3>
                            
                            <div className="space-y-4 mb-8">
                                {phrases.map((phrase, index) => (
                                    <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                                        <p className="text-lg font-medium text-slate-800">
                                            {index + 1}. "{phrase}"
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center">
                                <div className="bg-slate-800 rounded-lg p-6 mb-6">
                                    {isLoading ? (
                                        <div className="text-white">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                                            <p>Analyzing your pronunciation...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-center items-center mb-4">
                                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                                    isRecording ? 'bg-red-500 animate-pulse' : hasRecorded ? 'bg-green-500' : 'bg-slate-600'
                                                }`}>
                                                    {isRecording ? '🎤' : hasRecorded ? '✓' : '🎙️'}
                                                </div>
                                            </div>
                                            
                                            <Button
                                                onClick={toggleRecording}
                                                size="lg"
                                                className={`${
                                                    isRecording 
                                                        ? 'bg-red-600 hover:bg-red-700' 
                                                        : hasRecorded 
                                                        ? 'bg-green-600 hover:bg-green-700'
                                                        : 'bg-blue-600 hover:bg-blue-700'
                                                } text-white px-8 py-3`}
                                            >
                                                {isRecording ? 'Stop Recording' : hasRecorded ? 'Record Again' : 'Start Recording'}
                                            </Button>
                                            
                                            {hasRecorded && !feedbackData && (
                                                <p className="text-white mt-4">Click "Stop Recording" to get feedback!</p>
                                            )}
                                        </>
                                    )}
                                </div>

                                {hasRecorded && !isLoading && !feedbackData && (
                                    <p className="text-slate-600">Great! Processing your pronunciation...</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

    const renderFeedback = () => (
        <div className="min-h-screen bg-slate-100 py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Card className="shadow-2xl">
                        <CardHeader className="bg-green-600 text-white text-center">
                            <CardTitle className="text-2xl">Your Pronunciation Report</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            {feedbackData && (
                                <>
                                    <div className="text-center mb-8">
                                        <div className="text-4xl font-bold text-green-600 mb-2">
                                            {feedbackData.score}%
                                        </div>
                                        <p className="text-slate-600">Overall Pronunciation Score</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        <div className="bg-green-50 rounded-lg p-6">
                                            <h4 className="font-semibold text-green-800 mb-3">✓ Strengths</h4>
                                            <ul className="space-y-2">
                                                {feedbackData.feedback.good.map((item, index) => (
                                                    <li key={index} className="text-green-700">• {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div className="bg-orange-50 rounded-lg p-6">
                                            <h4 className="font-semibold text-orange-800 mb-3">⚠️ Areas to Practice</h4>
                                            <ul className="space-y-2">
                                                {feedbackData.feedback.practice.map((item, index) => (
                                                    <li key={index} className="text-orange-700">• {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="bg-slate-800 text-white rounded-lg p-6 text-center">
                                <h3 className="text-xl font-semibold mb-4">Ready to Master Crisis Communication?</h3>
                                <p className="mb-4">In the full course, you'll navigate the complete scandal:</p>
                                <ul className="text-left max-w-md mx-auto space-y-2 mb-6">
                                    <li>• Handle viral social media attacks</li>
                                    <li>• Conduct internal investigations</li>
                                    <li>• Rebuild your hotel's reputation</li>
                                    <li>• Master 50+ crisis scenarios</li>
                                </ul>
                                
                                <div className="bg-white text-slate-800 rounded-lg p-4 mb-6">
                                    <p className="text-sm line-through text-slate-500">$97/month</p>
                                    <p className="text-2xl font-bold text-red-600">$47/month</p>
                                    <p className="text-sm text-slate-600">(Limited Time - 50% Off)</p>
                                </div>

                                <div className="space-y-4">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="text-slate-800"
                                    />
                                    <Button 
                                        onClick={openCheckout}
                                        size="lg"
                                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        Start 7-Day Free Trial
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Email Capture Fallback */}
                    <Card className="shadow-lg">
                        <CardContent className="p-6 text-center">
                            <h3 className="text-lg font-semibold mb-2">Not Ready? No Problem.</h3>
                            <p className="text-slate-600 mb-4">Get 3 free lessons from the Hotel Crisis course</p>
                            
                            <form onSubmit={handleEmailCapture} className="max-w-md mx-auto space-y-3">
                                <Input
                                    type="email"
                                    placeholder="Your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Input
                                    type="text"
                                    placeholder="First name (optional)"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    {isLoading ? 'Sending...' : 'Send My Free Lessons'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        switch (demoStep) {
            case 'hero':
                return renderHero();
            case 'context':
                return renderContext();
            case 'practice':
                return renderPractice();
            case 'feedback':
                return renderFeedback();
            default:
                return renderHero();
        }
    };

    return (
        <>
            <Head title="Compel English - Master Crisis Communication" />
            <meta name="csrf-token" content={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
            
            {renderCurrentStep()}

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p>&copy; 2025 Compel English LLC. Helping professionals communicate with confidence.</p>
                        </div>
                        <div className="flex space-x-6">
                            <a href="/terms" className="text-slate-300 hover:text-white">Terms</a>
                            <a href="/privacy" className="text-slate-300 hover:text-white">Privacy</a>
                            <a href="mailto:sean@compelenglish.com" className="text-slate-300 hover:text-white">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}