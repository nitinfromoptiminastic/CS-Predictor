'use client';

import { useSession } from 'next-auth/react';
import { Dashboard } from '@/components/dashboard';
import { LoginPage } from '@/components/login-page';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function HomePage() {
  const { data: session, status } = useSession();

  console.log("Session status:", status);
  console.log("Session data:", session);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    console.log("User is unauthenticated, showing login page");
    return <LoginPage />;
  }

  console.log("User is authenticated, showing dashboard");
  return <Dashboard />;
}
