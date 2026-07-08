'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Page() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/auth/login');
    } else if (user.role === 'kasir') {
      router.replace('/kasir');
    } else if (user.role === 'pemilik') {
      router.replace('/pemilik/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground">AW Bakery POS</h1>
        <p className="text-muted-foreground mt-2">Memuat...</p>
      </div>
    </main>
  );
}
