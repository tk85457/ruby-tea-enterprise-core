'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../../components/DashboardSidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simple mock authentication for prototype
    // In production, use a real auth provider or secure cookie check
    const checkAuth = () => {
      const secretKey = localStorage.getItem('ruby_tea_admin_key');
      const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET;

      if (ADMIN_SECRET && secretKey === ADMIN_SECRET) {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
