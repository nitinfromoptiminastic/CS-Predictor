'use client';

import { useSession } from 'next-auth/react';
import { Dashboard } from '@/components/dashboard';
import { LoginPage } from '@/components/login-page';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function HomePage() {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <LoginPage />;
  }

  return <Dashboard />;
}
