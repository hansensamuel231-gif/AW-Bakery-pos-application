'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function KasirSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-primary text-primary-foreground min-h-screen flex flex-col">
      <div className="p-6 border-b border-primary/20">
        <h1 className="text-2xl font-bold">AW Bakery</h1>
        <p className="text-sm text-primary-foreground/80 mt-1">Kasir</p>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <Link href="/kasir">
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                isActive('/kasir')
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'text-primary-foreground hover:bg-primary-foreground/10'
              }`}
            >
              Penjualan (POS)
            </Button>
          </Link>
          <Link href="/kasir/products">
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                isActive('/kasir/products')
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'text-primary-foreground hover:bg-primary-foreground/10'
              }`}
            >
              Daftar Produk
            </Button>
          </Link>
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
