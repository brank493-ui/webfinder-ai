import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

// Helper to generate unique credential number
const generateCredentialNumber = (): string => {
  const prefix = 'WF';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Helper to generate avatar URL using DiceBear
const generateAvatarUrl = (name: string, seed?: string): string => {
  const avatarSeed = seed || name.replace(/\s+/g, '+');
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};

// Helper to hash password
const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Owner credentials
const OWNER_CREDENTIALS = {
  email: 'brank493@gmail.com',
  credentialNumber: 'lago2.1B',
  name: 'Fongang Lamago Brank',
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          scope: 'openid email profile',
        },
      },
    }),
    CredentialsProvider({
      id: 'credential-number',
      name: 'Credential Number',
      credentials: {
        credentialNumber: { label: 'Credential Number', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.credentialNumber) {
          return null;
        }

        const credentialNumber = credentials.credentialNumber.trim();

        // Check if it's the owner's credential
        if (credentialNumber === OWNER_CREDENTIALS.credentialNumber) {
          let owner = await prisma.user.findUnique({
            where: { email: OWNER_CREDENTIALS.email },
          });

          if (!owner) {
            owner = await prisma.user.create({
              data: {
                email: OWNER_CREDENTIALS.email,
                name: OWNER_CREDENTIALS.name,
                role: 'owner',
                provider: 'credential',
                credentialNumber: OWNER_CREDENTIALS.credentialNumber,
                hasCompletedOnboarding: true,
                avatar: generateAvatarUrl(OWNER_CREDENTIALS.name, 'owner'),
              },
            });
          }

          await prisma.user.update({
            where: { id: owner.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: owner.id,
            email: owner.email,
            name: owner.name,
            role: owner.role,
            provider: owner.provider,
            avatar: owner.avatar,
            credentialNumber: owner.credentialNumber,
            hasCompletedOnboarding: owner.hasCompletedOnboarding,
          };
        }

        // Check for user with this credential number
        const user = await prisma.user.findUnique({
          where: { credentialNumber },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            provider: user.provider,
            avatar: user.avatar,
            credentialNumber: user.credentialNumber,
            hasCompletedOnboarding: user.hasCompletedOnboarding,
          };
        }

        return null;
      },
    }),
    CredentialsProvider({
      id: 'email-password',
      name: 'Email Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();
        const password = credentials.password.trim();

        // Check if this is the owner trying to log in with email + password
        // Owner can use their credential number as password
        if (normalizedEmail === OWNER_CREDENTIALS.email && password === OWNER_CREDENTIALS.credentialNumber) {
          let owner = await prisma.user.findUnique({
            where: { email: OWNER_CREDENTIALS.email },
          });

          if (!owner) {
            owner = await prisma.user.create({
              data: {
                email: OWNER_CREDENTIALS.email,
                name: OWNER_CREDENTIALS.name,
                role: 'owner',
                provider: 'credential',
                credentialNumber: OWNER_CREDENTIALS.credentialNumber,
                hasCompletedOnboarding: true,
                avatar: generateAvatarUrl(OWNER_CREDENTIALS.name, 'owner'),
              },
            });
          } else if (owner.role !== 'owner') {
            // Ensure owner role is set
            owner = await prisma.user.update({
              where: { id: owner.id },
              data: { role: 'owner' },
            });
          }

          await prisma.user.update({
            where: { id: owner.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: owner.id,
            email: owner.email,
            name: owner.name,
            role: 'owner',
            provider: owner.provider,
            avatar: owner.avatar,
            credentialNumber: owner.credentialNumber,
            hasCompletedOnboarding: owner.hasCompletedOnboarding,
          };
        }

        // Regular user email/password login
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const passwordHash = hashPassword(password);
        if (user.passwordHash !== passwordHash) {
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          provider: user.provider,
          avatar: user.avatar,
          credentialNumber: user.credentialNumber,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        const normalizedEmail = user.email.toLowerCase();
        const isOwner = normalizedEmail === OWNER_CREDENTIALS.email;

        let existingUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (existingUser) {
          // Update user info
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              lastLoginAt: new Date(),
              provider: 'google',
              name: user.name || existingUser.name,
              avatar: user.image || existingUser.avatar,
              ...(isOwner && existingUser.role !== 'owner' ? { role: 'owner' } : {}),
            },
          });

          // Attach database fields to user object
          user.id = existingUser.id;
          user.role = existingUser.role;
          user.provider = 'google';
          user.credentialNumber = existingUser.credentialNumber;
          user.hasCompletedOnboarding = existingUser.hasCompletedOnboarding;
        } else {
          // Create new user
          let credentialNumber = generateCredentialNumber();
          let attempts = 0;
          while (attempts < 10) {
            const existing = await prisma.user.findUnique({
              where: { credentialNumber },
            });
            if (!existing) break;
            credentialNumber = generateCredentialNumber();
            attempts++;
          }

          const newUser = await prisma.user.create({
            data: {
              email: normalizedEmail,
              name: user.name || user.email.split('@')[0],
              role: isOwner ? 'owner' : 'user',
              provider: 'google',
              avatar: user.image || generateAvatarUrl(user.name || user.email.split('@')[0], user.email),
              credentialNumber,
              hasCompletedOnboarding: false,
              lastLoginAt: new Date(),
            },
          });

          user.id = newUser.id;
          user.role = newUser.role;
          user.provider = 'google';
          user.credentialNumber = newUser.credentialNumber;
          user.hasCompletedOnboarding = newUser.hasCompletedOnboarding;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as any).role || 'user';
        token.provider = (user as any).provider || 'credential';
        token.avatar = (user as any).avatar || (user as any).image;
        token.credentialNumber = (user as any).credentialNumber;
        token.hasCompletedOnboarding = (user as any).hasCompletedOnboarding || false;
      }

      // Update session
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
          provider: token.provider as string,
          avatar: token.avatar as string,
          credentialNumber: token.credentialNumber as string,
          hasCompletedOnboarding: token.hasCompletedOnboarding as boolean,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After successful Google sign-in, redirect to home with user data
      if (url.includes('callbackUrl')) {
        return baseUrl;
      }
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'webfinder-secret-key-change-in-production',
  debug: process.env.NODE_ENV === 'development',
};
