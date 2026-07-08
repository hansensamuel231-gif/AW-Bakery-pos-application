import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './auth-context';
import { UserRole } from './types';

export function useProtectedRoute(requiredRole?: UserRole) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/auth/login');
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      const redirectPath = user.role === 'kasir' ? '/kasir' : '/pemilik/dashboard';
      router.replace(redirectPath);
    }
  }, [user, isLoading, requiredRole, router, pathname]);

  return { user, isLoading };
}
