'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function PemilikSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <aside className="w-64 bg-primary text-primary-foreground min-h-screen flex flex-col">
      <div className="p-6 border-b border-primary/20">
        <h1 className="text-2xl font-bold">AW Bakery</h1>
        <p className="text-sm text-primary-foreground/80 mt-1">Pemilik</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div>
          <p className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wide px-2 py-2">
            Menu Utama
          </p>
          <div className="space-y-2">
            <Link href="/pemilik/dashboard">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive('/pemilik/dashboard') && !pathname.includes('reports')
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'text-primary-foreground hover:bg-primary-foreground/10'
                }`}
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wide px-2 py-2 mt-4">
            Manajemen
          </p>
          <div className="space-y-2">
            <Link href="/pemilik/manage-products">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive('/pemilik/manage-products')
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'text-primary-foreground hover:bg-primary-foreground/10'
                }`}
              >
                Kelola Produk
              </Button>
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wide px-2 py-2 mt-4">
            Laporan
          </p>
          <div className="space-y-2">
            <Link href="/pemilik/reports/transactions">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  pathname.includes('transactions')
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'text-primary-foreground hover:bg-primary-foreground/10'
                }`}
              >
                Laporan Transaksi
              </Button>
            </Link>
            <Link href="/pemilik/reports/inventory">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  pathname.includes('inventory')
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'text-primary-foreground hover:bg-primary-foreground/10'
                }`}
              >
                Laporan Stok
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-primary/20 space-y-2">
        <div className="text-sm text-primary-foreground/80 pb-2">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-xs opacity-75">{user?.email}</p>
        </div>
        <Button
          onClick={handleLogout}
          className="w-full bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
        >
          Keluar
        </Button>
      </div>
    </aside>
  );
}
