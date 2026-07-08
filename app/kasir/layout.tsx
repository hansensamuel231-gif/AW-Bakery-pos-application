'use client';

import { useProtectedRoute } from '@/lib/use-protected-route';
import { KasirSidebar } from '@/components/kasir-sidebar';

export default function KasirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useProtectedRoute('kasir');

  return (
    <div className="flex h-screen bg-background">
      <KasirSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
