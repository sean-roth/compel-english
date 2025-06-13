// ChargeBee integration for checkout
// Note: This is a TypeScript implementation that will work once ChargeBee JS is loaded

declare global {
  interface Window {
    Chargebee: any;
  }
}

interface ChargebeeConfig {
  site: string;
  publishableKey: string;
}

interface CheckoutSession {
  email?: string;
  plan?: string;
}

class ChargebeeIntegration {
  private cbInstance: any = null;
  private config: ChargebeeConfig;

  constructor(config: ChargebeeConfig) {
    this.config = config;
  }

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Chargebee can only be initialized in browser environment'));
        return;
      }

      // Check if Chargebee script is loaded
      if (window.Chargebee) {
        this.cbInstance = window.Chargebee.init({
          site: this.config.site,
          publishableKey: this.config.publishableKey
        });
        resolve(this.cbInstance);
      } else {
        // Dynamically load Chargebee script
        const script = document.createElement('script');
        script.src = 'https://js.chargebee.com/v2/chargebee.js';
        script.onload = () => {
          this.cbInstance = window.Chargebee.init({
            site: this.config.site,
            publishableKey: this.config.publishableKey
          });
          resolve(this.cbInstance);
        };
        script.onerror = () => reject(new Error('Failed to load Chargebee script'));
        document.head.appendChild(script);
      }
    });
  }

  async openCheckout(session: CheckoutSession): Promise<void> {
    if (!this.cbInstance) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      this.cbInstance.openCheckout({
        hostedPage: async () => {
          try {
            const response = await fetch('/api/checkout/session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
              },
              body: JSON.stringify(session)
            });

            if (!response.ok) {
              throw new Error('Failed to create checkout session');
            }

            return await response.json();
          } catch (error) {
            reject(error);
            throw error;
          }
        },
        success: (hostedPageId: string) => {
          // Redirect to success page or handle success
          window.location.href = '/welcome?success=true';
          resolve();
        },
        close: () => {
          console.log('Checkout closed by user');
          resolve();
        },
        error: (error: any) => {
          console.error('Checkout error:', error);
          reject(error);
        }
      });
    });
  }
}

// Export a factory function to create the integration
export function createChargebeeIntegration(): ChargebeeIntegration | null {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering
  }

  const site = import.meta.env.VITE_CHARGEBEE_SITE;
  const publishableKey = import.meta.env.VITE_CHARGEBEE_PUBLISHABLE_KEY;

  if (!site || !publishableKey) {
    console.warn('Chargebee configuration missing. Checkout will use mock mode.');
    return null;
  }

  return new ChargebeeIntegration({ site, publishableKey });
}

// Utility function to handle checkout
export async function openCheckout(email?: string, plan: string = 'starter-monthly'): Promise<void> {
  const chargebee = createChargebeeIntegration();
  
  if (!chargebee) {
    // Fallback: redirect to mock checkout page
    window.location.href = `/checkout/demo?email=${encodeURIComponent(email || '')}&plan=${plan}`;
    return;
  }

  try {
    await chargebee.openCheckout({ email, plan });
  } catch (error) {
    console.error('Failed to open Chargebee checkout:', error);
    // Fallback: redirect to mock checkout page
    window.location.href = `/checkout/demo?email=${encodeURIComponent(email || '')}&plan=${plan}`;
  }
}