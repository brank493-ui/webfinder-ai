import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

// Helper to generate unique credential number
const generateCredentialNumber = (): string => {
  const prefix = 'WF';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId,
      businessName,
      websiteType,
      services,
      domain,
      designStyle,
      primaryColor,
      secondaryColor,
      features,
      pages,
      additionalInfo,
      package: selectedPackage,
      contactName,
      contactEmail,
      contactPhone,
      businessAddress,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate credential number if not exists
    let credentialNumber = user.credentialNumber;
    if (!credentialNumber) {
      credentialNumber = generateCredentialNumber();
      let attempts = 0;
      while (attempts < 10) {
        const existing = await prisma.user.findUnique({
          where: { credentialNumber },
        });
        if (!existing) break;
        credentialNumber = generateCredentialNumber();
        attempts++;
      }
    }

    // Create or update user project
    const existingProject = await prisma.userProject.findFirst({
      where: { userId },
    });

    let project;
    if (existingProject) {
      project = await prisma.userProject.update({
        where: { id: existingProject.id },
        data: {
          businessName: businessName || existingProject.businessName,
          websiteType: websiteType || existingProject.websiteType,
          services: services ? JSON.stringify(services) : existingProject.services,
          domain: domain || existingProject.domain,
          designStyle: designStyle || existingProject.designStyle,
          primaryColor: primaryColor || existingProject.primaryColor,
          secondaryColor: secondaryColor || existingProject.secondaryColor,
          features: features ? JSON.stringify(features) : existingProject.features,
          pages: pages ? JSON.stringify(pages) : existingProject.pages,
          additionalInfo: additionalInfo || existingProject.additionalInfo,
          package: selectedPackage || existingProject.package,
          status: 'pending',
          updatedAt: new Date(),
        },
      });
    } else {
      project = await prisma.userProject.create({
        data: {
          userId,
          businessName: businessName || user.name,
          websiteType: websiteType || null,
          services: services ? JSON.stringify(services) : null,
          domain: domain || null,
          designStyle: designStyle || null,
          primaryColor: primaryColor || null,
          secondaryColor: secondaryColor || null,
          features: features ? JSON.stringify(features) : null,
          pages: pages ? JSON.stringify(pages) : null,
          additionalInfo: additionalInfo || null,
          package: selectedPackage || 'standard',
          status: 'pending',
        },
      });
    }

    // Update user with onboarding completion
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        hasCompletedOnboarding: true,
        credentialNumber,
        projectId: project.id,
        name: contactName || user.name,
        phone: contactPhone || user.phone,
      },
    });

    // Log the onboarding completion
    console.log(`
      ========================================
      ONBOARDING COMPLETED
      ========================================
      User ID: ${userId}
      Email: ${user.email}
      Credential Number: ${credentialNumber}
      Business Name: ${businessName}
      Website Type: ${websiteType}
      Package: ${selectedPackage}
      Domain: ${domain}
      Status: Pending
      ========================================
    `);

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully!',
      project: {
        id: project.id,
        businessName: project.businessName,
        websiteType: project.websiteType,
        package: project.package,
        status: project.status,
      },
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        credentialNumber: updatedUser.credentialNumber,
        hasCompletedOnboarding: updatedUser.hasCompletedOnboarding,
      },
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's project
    const project = await prisma.userProject.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!project) {
      return NextResponse.json({
        success: true,
        project: null,
        message: 'No project found for this user',
      });
    }

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        businessName: project.businessName,
        websiteType: project.websiteType,
        services: project.services ? JSON.parse(project.services) : [],
        domain: project.domain,
        designStyle: project.designStyle,
        primaryColor: project.primaryColor,
        secondaryColor: project.secondaryColor,
        features: project.features ? JSON.parse(project.features) : [],
        pages: project.pages ? JSON.parse(project.pages) : [],
        additionalInfo: project.additionalInfo,
        package: project.package,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
