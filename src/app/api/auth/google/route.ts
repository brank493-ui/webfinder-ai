import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { sendWelcomeEmail, sendCredentialReminderEmail } from '@/lib/email';

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

// Owner credentials
const OWNER_CREDENTIALS = {
  email: 'brank493@gmail.com',
  credentialNumber: 'lago2.1B',
  name: 'Fongang Lamago Brank',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, avatar, googleId } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Check if this is the owner's email
    const isOwner = normalizedEmail === OWNER_CREDENTIALS.email;

    // Find existing user by email
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      // Update user info
      const updateData: Record<string, unknown> = {
        lastLoginAt: new Date(),
        provider: 'google',
      };
      
      if (name && name !== user.name) {
        updateData.name = name;
      }
      if (avatar && avatar !== user.avatar) {
        updateData.avatar = avatar;
      }
      if (isOwner && user.role !== 'owner') {
        updateData.role = 'owner';
      }

      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      // Send credential number email if user doesn't have one
      if (!user.credentialNumber) {
        const credentialNumber = generateCredentialNumber();
        user = await prisma.user.update({
          where: { id: user.id },
          data: { credentialNumber },
        });
        await sendCredentialReminderEmail(user.email, user.name, credentialNumber);
      }

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

    // Generate unique credential number for new user
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

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name || email.split('@')[0],
        role: isOwner ? 'owner' : 'user',
        provider: 'google',
        avatar: avatar || generateAvatarUrl(name || email.split('@')[0], googleId || email),
        credentialNumber,
        hasCompletedOnboarding: false,
        lastLoginAt: new Date(),
      },
    });

    // Send welcome email with credential number
    await sendWelcomeEmail(newUser.email, newUser.name, credentialNumber);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Your credential number has been sent to your email.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        provider: newUser.provider,
        avatar: newUser.avatar,
        credentialNumber: newUser.credentialNumber,
        hasCompletedOnboarding: newUser.hasCompletedOnboarding,
        projectId: newUser.projectId,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
