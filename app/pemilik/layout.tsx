'use client';

import { useProtectedRoute } from '@/lib/use-protected-route';
import { PemilikSidebar } from '@/components/pemilik-sidebar';

export default function PemilikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useProtectedRoute('pemilik');

  return (
    <div className="flex h-screen bg-background">
      <PemilikSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
