export function Footer() {
    return (
        <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center">
                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-6 mb-4">
                        <a 
                            href="/terms" 
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                        >
                            Terms of Service
                        </a>
                        <a 
                            href="/privacy" 
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                        >
                            Privacy Policy
                        </a>
                        <a 
                            href="mailto:sean@compelenglish.com" 
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                        >
                            Contact
                        </a>
                    </div>
                    
                    {/* Company Info */}
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        <p className="mb-1">
                            © 2025 Compel English LLC. Helping professionals communicate with confidence.
                        </p>
                        <p className="text-xs">
                            🇯🇵 Designed specifically for Japanese business professionals
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}