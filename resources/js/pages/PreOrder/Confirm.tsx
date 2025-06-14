import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Confirm() {
  return (
    <>
      <Head title="Pre-Order Confirmed - Compel English" />
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-green-600">
              🎉 Pre-Order Confirmed!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Welcome to Compel English
              </h3>
              <p className="text-green-700">
                You've successfully pre-ordered at the special launch price of $23.50/month for 3 months.
                You won't be charged until the course launches.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">What happens next?</h4>
              <div className="text-left space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium">Immediate Demo Access</p>
                    <p className="text-sm text-gray-600">
                      You now have unlimited access to the Hotel Crisis demo
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium">Early Access</p>
                    <p className="text-sm text-gray-600">
                      Get first access when the full course launches
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium">Launch Notification</p>
                    <p className="text-sm text-gray-600">
                      We'll email you when the course is ready
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-green-600 hover:bg-green-700"
              >
                Try Demo Now
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = 'mailto:sean@compelenglish.com'}
              >
                Contact Support
              </Button>
            </div>

            <div className="text-xs text-gray-500 border-t pt-4">
              <p>
                Questions? Email us at{' '}
                <a href="mailto:sean@compelenglish.com" className="text-blue-600 hover:underline">
                  sean@compelenglish.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}