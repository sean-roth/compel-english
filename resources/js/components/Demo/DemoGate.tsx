import { useState } from 'react';
import { DemoAccessManager, type DemoAccess } from '@/lib/demo-access';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface DemoConfig {
  maxAttempts: number;
  sessionDuration: number;
  preOrderDiscount: number;
  regularPrice: number;
  preOrderPrice: number;
  preOrderDuration: number;
}

interface Props {
  config: DemoConfig;
  accessManager: DemoAccessManager;
  onAccessGranted: (access: DemoAccess) => void;
}

export function DemoGate({ config, accessManager, onAccessGranted }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePreOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create checkout session for pre-order
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          email: email || 'demo@example.com',
          plan: 'pre-order',
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Redirect to checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const access = await accessManager.requestAccess(email);
      onAccessGranted(access);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get demo access');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            When Crisis Strikes,
            <br />
            <span className="text-red-600">Every Word Counts</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Master professional English pronunciation in high-pressure situations
          </p>
          
          {/* Preview Video Placeholder */}
          <div className="bg-gray-900 rounded-lg p-8 mb-8 text-white">
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-sm text-gray-400">30-second preview coming soon</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Watch Amelia navigate a crisis that could destroy her hotel's reputation
            </p>
          </div>
        </div>

        {/* Access Options */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Ready to Master Crisis Communication?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pre-order Offer */}
            <div className="border-2 border-green-500 rounded-lg p-6 bg-green-50">
              <Badge className="bg-green-600 text-white mb-2">LIMITED TIME - 50% OFF</Badge>
              <h3 className="text-xl font-semibold mb-2">Pre-Order Special</h3>
              <p className="text-gray-600 mb-4">
                Be first to access the full course when it launches
              </p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-green-600">
                    ${config.preOrderPrice}/month
                  </span>
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ${config.regularPrice}/month
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  for {config.preOrderDuration} months
                </span>
              </div>
              <Button 
                onClick={handlePreOrder}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Processing...' : 'Pre-Order Now'}
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                No charge until we launch!
              </p>
            </div>

            <div className="text-center">
              <Separator className="my-4" />
              <span className="text-sm text-gray-500 bg-white px-4">OR</span>
            </div>

            {/* Free Demo Option */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Try the Demo First</h3>
              <p className="text-gray-600 mb-4">
                Experience the interactive crisis scenario before committing
              </p>
              
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {/* Honeypot field */}
                  <input
                    type="text"
                    name="website"
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading || !email}
                  className="w-full"
                >
                  {loading ? 'Getting Access...' : 'Get Free Demo Access'}
                </Button>
              </form>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                Limited to {config.maxAttempts} practice sessions
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="/terms" className="hover:text-gray-700">Terms</a>
            <a href="/privacy" className="hover:text-gray-700">Privacy</a>
            <a href="mailto:sean@compelenglish.com" className="hover:text-gray-700">Contact</a>
          </div>
          <p>© 2025 Compel English LLC. Helping professionals communicate with confidence.</p>
        </footer>
      </div>
    </div>
  );
}