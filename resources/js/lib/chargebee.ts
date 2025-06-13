/**
 * ChargeBee integration for checkout sessions
 * This is a placeholder for when ChargeBee is properly configured
 */

declare global {
    interface Window {
        Chargebee: any;
    }
}

export const initChargebee = () => {
    if (typeof window.Chargebee === 'undefined') {
        console.warn('ChargeBee not loaded. Using mock mode.');
        return null;
    }

    const cbInstance = window.Chargebee.init({
        site: import.meta.env.VITE_CHARGEBEE_SITE || "compelenglish-test",
        publishableKey: import.meta.env.VITE_CHARGEBEE_KEY
    });
    
    return cbInstance;
};

export const openCheckout = async (email?: string) => {
    const cbInstance = initChargebee();
    
    if (!cbInstance) {
        // Mock mode - simulate checkout
        alert(`Mock ChargeBee Checkout\nEmail: ${email}\nWould redirect to actual ChargeBee in production`);
        return;
    }

    cbInstance.openCheckout({
        hostedPage: () => {
            return fetch('/api/checkout/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ email })
            }).then(res => res.json());
        },
        success: (hostedPageId: string) => {
            window.location.href = '/welcome';
        },
        close: () => {
            console.log('Checkout closed');
        }
    });
};