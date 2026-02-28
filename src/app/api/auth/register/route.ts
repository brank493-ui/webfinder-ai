import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { sendWelcomeEmail } from '@/lib/email';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      name, 
      surname, 
      gender, 
      phone, 
      country, 
      city 
    } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists. Please sign in instead.' },
        { status: 400 }
      );
    }

    // Generate unique credential number
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

    // Hash password
    const passwordHash = hashPassword(password);

    // Create user
    const fullName = surname ? `${name} ${surname}` : name;
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: fullName,
        surname: surname || null,
        passwordHash,
        gender: gender || null,
        phone: phone || null,
        country: country || null,
        city: city || null,
        role: 'user',
        provider: 'credential',
        credentialNumber,
        emailVerified: false,
        hasCompletedOnboarding: false,
        avatar: generateAvatarUrl(fullName, credentialNumber),
      },
    });

    // Send credential email
    await sendWelcomeEmail(email, fullName, credentialNumber);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email for your credential number.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        provider: user.provider,
        avatar: user.avatar,
        credentialNumber: user.credentialNumber,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
