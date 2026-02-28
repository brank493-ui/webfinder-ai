'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore, type UserRole } from '@/store/useAuthStore';

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
      const user = session.user as typeof session.user & { id?: string; role?: string; provider?: string; credentialNumber?: string; hasCompletedOnboarding?: boolean; avatar?: string };
      const isOwner = user.email?.toLowerCase() === OWNER.email.toLowerCase();

      useAuthStore.setState({
        user: {
          id: user.id || `google-${Date.now()}`,
          email: user.email || '',
          name: user.name || user.email?.split('@')[0] || 'User',
          role: (user.role || (isOwner ? 'owner' : 'user')) as UserRole,
          provider: (user.provider || 'google') as 'email' | 'google' | 'credential',
          credentialNumber: user.credentialNumber,
          hasCompletedOnboarding: user.hasCompletedOnboarding ?? (isOwner ? true : false),
          avatar: user.avatar || user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        },
        isAuthenticated: true,
      });
    }
  }, [session, status, isAuthenticated]);

  return { session, status };
}
