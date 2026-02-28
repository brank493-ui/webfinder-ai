import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Helper to generate avatar URL using DiceBear
const generateAvatarUrl = (name: string, seed?: string): string => {
  const avatarSeed = seed || name.replace(/\s+/g, '+');
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};

// Seed initial data
export async function POST() {
  try {
    // Create owner if not exists
    const ownerEmail = 'brank493@gmail.com';
    const existingOwner = await prisma.user.findUnique({
      where: { email: ownerEmail },
    });

    if (!existingOwner) {
      await prisma.user.create({
        data: {
          email: ownerEmail,
          name: 'Fongang Lamago Brank',
          role: 'owner',
          provider: 'credential',
          accessCode: 'lago2.1B',
          hasCompletedOnboarding: true,
          avatar: generateAvatarUrl('Fongang Lamago Brank', 'owner'),
        },
      });
    }

    // Create test users with access codes
    const testUsers = [
      {
        email: 'client1@example.com',
        name: 'Tech Startup',
        accessCode: 'WF-USER-001',
        hasCompletedOnboarding: false,
      },
      {
        email: 'client2@example.com',
        name: 'Restaurant Pro',
        accessCode: 'WF-USER-002',
        hasCompletedOnboarding: true,
      },
    ];

    for (const testUser of testUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { email: testUser.email },
      });

      if (!existingUser) {
        // Create business for the test user
        const business = await prisma.business.create({
          data: {
            name: testUser.name,
            email: testUser.email,
            category: 'Technology',
            country: 'Cameroon',
            city: 'Douala',
          },
        });

        // Create project for the test user
        const project = await prisma.project.create({
          data: {
            businessId: business.id,
            package: testUser.hasCompletedOnboarding ? 'pro' : 'standard',
            status: testUser.hasCompletedOnboarding ? 'in_progress' : 'pending',
            paymentStatus: testUser.hasCompletedOnboarding ? 'paid' : 'pending',
            amount: testUser.hasCompletedOnboarding ? 399 : 149,
            brief: JSON.stringify({
              services: 'Web Design, SEO Optimization',
              style: 'modern',
              colors: ['#2563EB', '#1E40AF', '#FFFFFF'],
              features: ['Contact Form', 'Gallery', 'About Us', 'Services'],
              pages: ['Home', 'About', 'Services', 'Gallery', 'Contact'],
              domain: 'mybusiness.com',
              notes: 'Modern and clean design preferred',
            }),
          },
        });

        // Create user with project reference
        await prisma.user.create({
          data: {
            email: testUser.email,
            name: testUser.name,
            role: 'user',
            provider: 'credential',
            accessCode: testUser.accessCode,
            hasCompletedOnboarding: testUser.hasCompletedOnboarding,
            projectId: project.id,
            avatar: generateAvatarUrl(testUser.name, testUser.accessCode),
          },
        });

        // Create access code
        await prisma.accessCode.create({
          data: {
            code: testUser.accessCode,
            email: testUser.email,
            projectId: project.id,
            used: true,
          },
        });

        // Create sample payment transaction for completed user
        if (testUser.hasCompletedOnboarding) {
          await prisma.paymentTransaction.create({
            data: {
              projectId: project.id,
              provider: 'mtn_money',
              amount: 399,
              currency: 'USD',
              status: 'completed',
              transactionId: `TXN_${Date.now()}`,
            },
          });

          // Create sample deployment
          await prisma.deployment.create({
            data: {
              projectId: project.id,
              projectName: testUser.name,
              domain: 'mybusiness.webfinder.ai',
              status: 'live',
              sslEnabled: true,
              cdnEnabled: true,
            },
          });
        }
      }
    }

    // Create some sample access codes for new users
    const sampleAccessCodes = ['WF-NEW-001', 'WF-NEW-002', 'WF-NEW-003'];
    for (const code of sampleAccessCodes) {
      const existing = await prisma.accessCode.findUnique({
        where: { code },
      });
      if (!existing) {
        await prisma.accessCode.create({
          data: { code },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        owner: { email: ownerEmail, accessCode: 'lago2.1B' },
        testUsers: testUsers.map(u => ({ email: u.email, accessCode: u.accessCode })),
        sampleAccessCodes,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}

// GET to check seed status
export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const accessCodeCount = await prisma.accessCode.count();
    const projectCount = await prisma.project.count();

    return NextResponse.json({
      success: true,
      status: {
        users: userCount,
        accessCodes: accessCodeCount,
        projects: projectCount,
      },
    });
  } catch (error) {
    console.error('Seed status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check seed status' },
      { status: 500 }
    );
  }
}
