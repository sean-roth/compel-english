import { Button } from '@/components/ui/button';
import { Play, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
    onStartDemo: () => void;
    onSkipToEmail: () => void;
}

export function HeroSection({ onStartDemo, onSkipToEmail }: HeroSectionProps) {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="mx-auto max-w-4xl text-center">
                {/* Main Headline */}
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                    When Crisis Strikes,{' '}
                    <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                        Every Word Counts
                    </span>
                </h1>
                
                {/* Subtitle */}
                <p className="mb-8 text-xl text-slate-600 dark:text-slate-300 sm:text-2xl">
                    Master professional English pronunciation in high-pressure situations
                </p>
                
                {/* Demo Preview Card */}
                <div className="mb-8 mx-auto max-w-2xl rounded-xl bg-white dark:bg-slate-800 p-6 shadow-xl">
                    <div className="mb-4 flex items-center justify-center">
                        <div className="rounded-full bg-slate-100 dark:bg-slate-700 p-4">
                            <Play className="h-8 w-8 text-slate-600 dark:text-slate-300" />
                        </div>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                        Interactive Demo: Hotel Crisis Management
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                        Step into the shoes of Amelia Hayes, Hotel Manager at the prestigious Grandview Hotel. 
                        A journalist confronts you with serious allegations. Your response could save or sink your reputation.
                    </p>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button 
                        onClick={onStartDemo}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-medium"
                    >
                        <Play className="mr-2 h-5 w-5" />
                        Try Free Interactive Demo
                    </Button>
                    
                    <Button 
                        onClick={onSkipToEmail}
                        variant="outline"
                        size="lg"
                        className="border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 px-8 py-3 text-lg"
                    >
                        Get Free Lessons Instead
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
                
                {/* Social Proof */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Trusted by Japanese business professionals worldwide
                    </p>
                    <div className="flex items-center justify-center gap-8 opacity-60">
                        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            🏨 HOTEL MANAGERS
                        </div>
                        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            📈 EXECUTIVES
                        </div>
                        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            👥 TEAM LEADERS
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}