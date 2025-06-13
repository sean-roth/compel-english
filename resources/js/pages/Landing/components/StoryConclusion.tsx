import { Button } from '@/components/ui/button';
import { Crown, TrendingUp, Users, ArrowRight, Mail } from 'lucide-react';
import { openCheckout } from '@/lib/chargebee';

interface StoryConclusionProps {
    overallScore: number;
    sceneScores: number[];
    onComplete: () => void;
    onSkipToEmail: () => void;
}

export function StoryConclusion({ overallScore, sceneScores, onComplete, onSkipToEmail }: StoryConclusionProps) {
    const getPerformanceLevel = (score: number) => {
        if (score >= 85) return { level: 'Expert', color: 'text-green-400', icon: '🌟' };
        if (score >= 70) return { level: 'Proficient', color: 'text-blue-400', icon: '💎' };
        if (score >= 60) return { level: 'Developing', color: 'text-yellow-400', icon: '⭐' };
        return { level: 'Needs Practice', color: 'text-red-400', icon: '📚' };
    };

    const performance = getPerformanceLevel(overallScore);

    const skills = [
        { name: 'Crisis Communication', score: sceneScores[0] || 0 },
        { name: 'Professional Pronunciation', score: overallScore },
        { name: 'Maintaining Composure', score: Math.min(100, overallScore + 10) }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-4xl">
                {/* Results Header */}
                <div className="text-center mb-8">
                    <div className="mb-4 text-6xl">{performance.icon}</div>
                    <h1 className="text-3xl font-bold mb-2">Demo Complete!</h1>
                    <p className="text-slate-300 text-lg">You navigated the crisis interview. Here's how you performed:</p>
                </div>

                {/* Performance Summary */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Overall Score */}
                    <div className="bg-slate-800 rounded-2xl p-6 text-center">
                        <h2 className="text-xl font-semibold mb-4">Your Overall Score</h2>
                        <div className={`text-6xl font-bold mb-2 ${performance.color}`}>
                            {overallScore}%
                        </div>
                        <div className={`text-lg font-medium ${performance.color}`}>
                            {performance.level}
                        </div>
                        
                        {/* Progress Ring Visual */}
                        <div className="mt-4 flex justify-center">
                            <div className="relative h-24 w-24">
                                <svg className="h-24 w-24 transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-slate-700"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={`${overallScore * 2.51} 251`}
                                        className={performance.color}
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Skills Breakdown */}
                    <div className="bg-slate-800 rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-4">Skills Assessed</h2>
                        <div className="space-y-4">
                            {skills.map((skill, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium">{skill.name}</span>
                                        <span className="text-sm text-slate-400">{skill.score}%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-1000 ${
                                                skill.score >= 80 ? 'bg-green-500' :
                                                skill.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${skill.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Story Cliffhanger */}
                <div className="bg-gradient-to-r from-red-900 to-orange-900 rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-center">But the story doesn't end here...</h2>
                    <div className="text-center text-lg leading-relaxed text-red-100">
                        <p className="mb-4">
                            📰 The journalist publishes the story anyway. Social media erupts with #GrandviewGate.
                        </p>
                        <p className="mb-4">
                            💼 Your board of directors calls an emergency meeting. Staff morale plummets.
                        </p>
                        <p className="font-semibold text-yellow-300">
                            How will you save your hotel's reputation and rebuild trust?
                        </p>
                    </div>
                </div>

                {/* Full Course Teaser */}
                <div className="bg-slate-800 rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Unlock the Full Crisis Story</h2>
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center">
                            <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                            <h3 className="font-semibold mb-2">Navigate Social Media</h3>
                            <p className="text-sm text-slate-400">Handle viral attacks and public outrage</p>
                        </div>
                        <div className="text-center">
                            <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                            <h3 className="font-semibold mb-2">Manage Your Team</h3>
                            <p className="text-sm text-slate-400">Restore staff confidence and motivation</p>
                        </div>
                        <div className="text-center">
                            <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                            <h3 className="font-semibold mb-2">Rebuild Reputation</h3>
                            <p className="text-sm text-slate-400">Win back customer trust and loyalty</p>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-slate-700 rounded-xl p-6 text-center">
                        <div className="mb-4">
                            <span className="text-slate-400 line-through text-lg">$97/month</span>
                            <span className="text-3xl font-bold text-green-400 ml-4">$47/month</span>
                        </div>
                        <p className="text-slate-300 mb-4">Limited Time: 50% Off + 7-Day Free Trial</p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => openCheckout(undefined, 'starter-monthly')}
                                size="lg"
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg font-medium"
                            >
                                Start 7-Day Free Trial
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            
                            <Button
                                onClick={onSkipToEmail}
                                variant="outline"
                                size="lg"
                                className="border-slate-500 text-slate-300 hover:bg-slate-700 px-8 py-3 text-lg"
                            >
                                <Mail className="mr-2 h-5 w-5" />
                                Get Free Lessons Instead
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="text-center text-sm text-slate-400">
                    <p className="mb-2">✅ 7-Day Money-Back Guarantee • ✅ Cancel Anytime • ✅ No Setup Fees</p>
                    <p>Designed specifically for Japanese business professionals</p>
                </div>
            </div>
        </div>
    );
}