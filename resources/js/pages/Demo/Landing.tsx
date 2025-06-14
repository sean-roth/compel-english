import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { DemoAccessManager, type DemoAccess } from '@/lib/demo-access';
import { DemoGate } from '@/components/Demo/DemoGate';
import { InteractiveStory } from '@/components/Demo/InteractiveStory';

interface DemoConfig {
  maxAttempts: number;
  sessionDuration: number;
  preOrderDiscount: number;
  regularPrice: number;
  preOrderPrice: number;
  preOrderDuration: number;
}

interface Props {
  demoConfig: DemoConfig;
}

export default function Landing({ demoConfig }: Props) {
  const [accessManager] = useState(() => new DemoAccessManager());
  const [hasAccess, setHasAccess] = useState(false);
  const [access, setAccess] = useState<DemoAccess | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingAccess();
  }, []);

  const checkExistingAccess = async () => {
    try {
      const existingAccess = await accessManager.checkAccess();
      if (existingAccess && existingAccess.can_attempt) {
        setAccess(existingAccess);
        setHasAccess(true);
      }
    } catch (error) {
      console.error('Failed to check existing access:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccessGranted = (newAccess: DemoAccess) => {
    setAccess(newAccess);
    setHasAccess(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head title="Master Crisis Communication - Compel English" />
      
      <div className="min-h-screen bg-gray-50">
        {!hasAccess ? (
          <DemoGate 
            config={demoConfig}
            accessManager={accessManager}
            onAccessGranted={handleAccessGranted}
          />
        ) : (
          <InteractiveStory 
            config={demoConfig}
            accessManager={accessManager}
            access={access!}
          />
        )}
      </div>
    </>
  );
}