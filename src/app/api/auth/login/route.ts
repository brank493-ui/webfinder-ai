import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credentialNumber, email, password } = body;

    // Case 1: Login with credential number
    if (credentialNumber) {
      // Check if it's the owner's credential
      if (credentialNumber === OWNER_CREDENTIALS.credentialNumber) {
        // Find or create owner user
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

        // Update last login
        await prisma.user.update({
          where: { id: owner.id },
          data: { lastLoginAt: new Date() },
        });

        return NextResponse.json({
          success: true,
          user: {
            id: owner.id,
            email: owner.email,
            name: owner.name,
            role: owner.role,
            provider: owner.provider,
            avatar: owner.avatar,
            hasCompletedOnboarding: owner.hasCompletedOnboarding,
            projectId: owner.projectId,
            createdAt: owner.createdAt,
          },
        });
      }

      // Check for user with this credential number
      const user = await prisma.user.findUnique({
        where: { credentialNumber },
      });

      if (user) {
        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            provider: user.provider,
            avatar: user.avatar,
            hasCompletedOnboarding: user.hasCompletedOnboarding,
            projectId: user.projectId,
            createdAt: user.createdAt,
          },
        });
      }

      return NextResponse.json(
        { success: false, error: 'Invalid credential number. Please check your email or contact support.' },
        { status: 401 }
      );
    }

    // Case 2: Login with email and password
    if (email && password) {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'No account found with this email. Please register first.' },
          { status: 401 }
        );
      }

      // Check if user has a password (Google users might not)
      if (!user.passwordHash) {
        return NextResponse.json(
          { success: false, error: 'This account uses Google sign-in. Please use Google to sign in.' },
          { status: 401 }
        );
      }

      // Verify password
      const passwordHash = hashPassword(password);
      if (user.passwordHash !== passwordHash) {
        return NextResponse.json(
          { success: false, error: 'Incorrect password. Please try again.' },
          { status: 401 }
        );
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          provider: user.provider,
          avatar: user.avatar,
          credentialNumber: user.credentialNumber,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
          projectId: user.projectId,
          createdAt: user.createdAt,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Please provide either a credential number or email/password' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
