import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole = 'owner' | 'user' | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  projectId?: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'credential';
  credentialNumber?: string;
  hasCompletedOnboarding?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loginWithCredential: (credentialNumber: string) => Promise<{ success: boolean; role?: 'owner' | 'user'; error?: string }>;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<{ success: boolean; role?: 'owner' | 'user'; error?: string }>;
  loginWithGoogle: (googleData: { email: string; name: string; avatar?: string; googleId?: string }) => Promise<{ success: boolean; role?: 'owner' | 'user'; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  completeOnboarding: (userData: Partial<User>) => void;
  logout: () => void;
  goToOnboarding: () => void;
  clearError: () => void;
  
  // Check access
  isOwner: () => boolean;
  isUser: () => boolean;
  needsOnboarding: () => boolean;
  canAccess: (area: 'admin' | 'workspace' | 'tools' | 'enterprise' | 'client') => boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  surname?: string;
  gender?: string;
  phone?: string;
  country?: string;
  city?: string;
}

// Helper to generate avatar URL using DiceBear
const generateAvatarUrl = (name: string, seed?: string): string => {
  const avatarSeed = seed || name.replace(/\s+/g, '+');
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      // Login with credential number
      loginWithCredential: async (credentialNumber: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credentialNumber }),
          });

          const data = await response.json();

          if (data.success && data.user) {
            set({
              user: data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true, role: data.user.role };
          }

          set({ isLoading: false, error: data.error });
          return { success: false, error: data.error };
        } catch (error) {
          const errorMessage = 'Network error. Please try again.';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // Login with email and password
      loginWithEmailAndPassword: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (data.success && data.user) {
            set({
              user: data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true, role: data.user.role };
          }

          set({ isLoading: false, error: data.error });
          return { success: false, error: data.error };
        } catch (error) {
          const errorMessage = 'Network error. Please try again.';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // Login with Google
      loginWithGoogle: async (googleData: { email: string; name: string; avatar?: string; googleId?: string }) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(googleData),
          });

          const data = await response.json();

          if (data.success && data.user) {
            set({
              user: data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true, role: data.user.role };
          }

          set({ isLoading: false, error: data.error });
          return { success: false, error: data.error };
        } catch (error) {
          const errorMessage = 'Network error. Please try again.';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // Register new user
      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (data.success && data.user) {
            set({
              user: data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true };
          }

          set({ isLoading: false, error: data.error });
          return { success: false, error: data.error };
        } catch (error) {
          const errorMessage = 'Network error. Please try again.';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // Complete onboarding for users
      completeOnboarding: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...userData,
              hasCompletedOnboarding: true,
            },
          });
        }
      },

      // Allow user to go back to onboarding
      goToOnboarding: () => {
        const currentUser = get().user;
        if (currentUser && currentUser.role === 'user') {
          set({
            user: {
              ...currentUser,
              hasCompletedOnboarding: false,
            },
          });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      isOwner: () => get().user?.role === 'owner',
      isUser: () => get().user?.role === 'user',
      
      needsOnboarding: () => {
        const user = get().user;
        return user?.role === 'user' && !user.hasCompletedOnboarding;
      },

      canAccess: (area: 'admin' | 'workspace' | 'tools' | 'enterprise' | 'client') => {
        const { user } = get();

        if (!user) return false;

        if (user.role === 'owner') {
          // Owner has access to everything
          return true;
        }

        if (user.role === 'user') {
          // Users can only access their client area
          return area === 'client';
        }

        return false;
      },
    }),
    {
      name: 'webfinder-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
