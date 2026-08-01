'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../lib/useAuth';

function LoadingScreen({ label }: { label: string }) {
  return (
    <main className="min-h-screen bg-[#03060F] flex items-center justify-center pt-16">
      <div className="text-center">
        <FaSpinner className="text-4xl text-[#FF3C6E] animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">{label}</p>
      </div>
    </main>
  );
}

/**
 * Wrap any page that requires the visitor to be signed in
 * (any authenticated user — no role check).
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/signin');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <LoadingScreen label="Checking your session..." />;
  }

  return <>{children}</>;
}

/**
 * Wrap any page that requires the `admin` custom claim.
 * Non-admin signed-in users are bounced to /dashboard.
 * Signed-out users are bounced to /signin.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/signin');
    } else if (!isAdmin) {
      router.replace('/dashboard');
    }
  }, [loading, user, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return <LoadingScreen label="Verifying admin access..." />;
  }

  return <>{children}</>;
}