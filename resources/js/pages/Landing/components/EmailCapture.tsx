import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Check, Mail, ArrowRight } from 'lucide-react';

interface EmailCaptureProps {
    finalScore: number | null;
}

export function EmailCapture({ finalScore }: EmailCaptureProps) {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/demo/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    first_name: firstName.trim(),
                    demo_score: finalScore
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to capture email');
            }

            setIsSuccess(true);
        } catch (error) {
            console.error('Email capture error:', error);
            setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Check Your Email! 📧
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300">
                            Your free Hotel Crisis lessons are on their way to <strong>{email}</strong>
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                            What's Coming Next:
                        </h2>
                        <div className="space-y-3 text-left">
                            <div className="flex items-start">
                                <span className="text-green-500 mr-3 mt-0.5">✓</span>
                                <span className="text-slate-700 dark:text-slate-300">
                                    <strong>Lesson 1:</strong> Advanced crisis communication phrases
                                </span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-3 mt-0.5">✓</span>
                                <span className="text-slate-700 dark:text-slate-300">
                                    <strong>Lesson 2:</strong> Managing difficult conversations with confidence
                                </span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-3 mt-0.5">✓</span>
                                <span className="text-slate-700 dark:text-slate-300">
                                    <strong>Lesson 3:</strong> Professional pronunciation tips for Japanese speakers
                                </span>
                            </div>
                        </div>
                    </div>

                    {finalScore && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                            <p className="text-blue-800 dark:text-blue-200 text-sm">
                                📊 <strong>Your Demo Score: {finalScore}%</strong> - We'll include personalized tips based on your performance!
                            </p>
                        </div>
                    )}

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Don't see the email? Check your spam folder or contact{' '}
                        <a href="mailto:sean@compelenglish.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                            sean@compelenglish.com
                        </a>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full mb-4">
                        <Gift className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Not Ready? No Problem.
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        Get 3 free lessons from the Hotel Crisis course
                    </p>
                </div>

                {/* Benefits */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl mb-8">
                    <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white text-center">
                        What you'll get instantly:
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-3">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Crisis Phrases</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Essential phrases for handling difficult situations
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mb-3">
                                <span className="text-2xl">🗣️</span>
                            </div>
                            <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Pronunciation Guide</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Audio examples with Japanese speaker tips
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full mb-3">
                                <span className="text-2xl">📚</span>
                            </div>
                            <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Practice Exercises</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Interactive exercises you can do at home
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                First Name (Optional)
                            </label>
                            <Input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Your first name"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Email Address *
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@company.com"
                                required
                                className="w-full"
                            />
                        </div>
                        
                        {error && (
                            <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting || !email.trim()}
                            size="lg"
                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 text-lg font-medium"
                        >
                            {isSubmitting ? (
                                <>
                                    <Mail className="mr-2 h-5 w-5 animate-pulse" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail className="mr-2 h-5 w-5" />
                                    Send My Free Lessons
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                        We respect your privacy. Unsubscribe anytime. No spam, ever.
                    </div>
                </form>

                {finalScore && (
                    <div className="mt-6 text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full text-sm text-blue-800 dark:text-blue-200">
                            📊 Demo Score: {finalScore}% - We'll include personalized feedback!
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}