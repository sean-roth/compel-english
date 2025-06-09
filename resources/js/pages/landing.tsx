import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { CheckCircle, Clock, Globe, Mic } from 'lucide-react';

export default function Landing() {
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        name: '',
        company: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post('/api/demo/register', {
            onSuccess: () => {
                setEmailSubmitted(true);
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Master Business English Pronunciation with AI" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                {/* Header */}
                <header className="container mx-auto px-6 py-4">
                    <nav className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            Compel English
                        </div>
                        <div className="space-x-4">
                            <Link
                                href="/login"
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Sign up
                            </Link>
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="container mx-auto px-6 py-20 text-center">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Master Business English<br />
                        <span className="text-blue-600">Pronunciation with AI</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Train with thrilling stories designed specifically for Japanese professionals. 
                        Get real-time AI feedback on your pronunciation.
                    </p>
                    <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                        <Link href="/demo">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                                Try Free Demo
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                            Learn More
                        </Button>
                    </div>
                </section>

                {/* Value Proposition Section */}
                <section className="container mx-auto px-6 py-16">
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="text-center p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                            <CardContent className="pt-6">
                                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                                    <Mic className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                    AI analyzes your pronunciation in real-time
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Get instant feedback on your pronunciation with phoneme-level accuracy scoring powered by advanced AI.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                            <CardContent className="pt-6">
                                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                                    <Globe className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                    Learn through exciting business thriller stories
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Immerse yourself in compelling narratives while practicing essential business English vocabulary.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                            <CardContent className="pt-6">
                                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                    Designed specifically for Japanese speakers
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Tailored exercises target common pronunciation challenges faced by Japanese English learners.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Email Capture Section */}
                <section className="container mx-auto px-6 py-16">
                    <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-2xl">
                        <CardContent className="p-8">
                            {emailSubmitted ? (
                                <div className="text-center">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        Thank you for your interest!
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                                        We'll notify you when early access becomes available with your 50% discount.
                                    </p>
                                    <Link href="/demo">
                                        <Button className="bg-blue-600 hover:bg-blue-700">
                                            Try the Demo Now
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="text-center mb-6">
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            Get Early Access
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Be among the first to experience AI-powered pronunciation training
                                        </p>
                                        <div className="inline-flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-medium mt-4">
                                            <Clock className="w-4 h-4 mr-2" />
                                            Limited Time: 50% Off Early Access
                                        </div>
                                    </div>

                                    <form onSubmit={submit} className="space-y-4">
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

                                        <div className="grid md:grid-cols-2 gap-4">
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
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                                        >
                                            {processing ? 'Submitting...' : 'Get Early Access - 50% Off'}
                                        </Button>
                                    </form>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="container mx-auto px-6 text-center">
                        <div className="text-xl font-bold mb-4">Compel English</div>
                        <p className="text-gray-400 mb-4">
                            AI-powered pronunciation training for Japanese business professionals
                        </p>
                        <div className="space-x-6">
                            <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy</Link>
                            <Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link>
                            <Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}