'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/useAuthStore';

// Owner credentials
const OWNER = {
  email: 'brank493@gmail.com',
  credential: 'lago2.1B',
  name: 'Fongang Lamago Brank',
};

export function useNextAuthSession() {
  const { data: session, status } = useSession();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If NextAuth session exists but Zustand is not authenticated, sync them
    if (session?.user && status === 'authenticated' && !isAuthenticated) {
      const user = session.user;
      const isOwner = user.email?.toLowerCase() === OWNER.email.toLowerCase();

      useAuthStore.setState({
        user: {
          id: user.id || `google-${Date.now()}`,
          email: user.email || '',
          name: user.name || user.email?.split('@')[0] || 'User',
          role: (user as any).role || (isOwner ? 'owner' : 'user'),
          provider: (user as any).provider || 'google',
          credentialNumber: (user as any).credentialNumber,
          hasCompletedOnboarding: (user as any).hasCompletedOnboarding ?? (isOwner ? true : false),
          avatar: (user as any).avatar || user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        },
        isAuthenticated: true,
      });
    }
  }, [session, status, isAuthenticated]);

  return { session, status };
}
