import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Retrieve client briefs for workspace
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const packageFilter = searchParams.get('package');

    const where: Record<string, unknown> = {};
    
    if (status) {
      where.status = status;
    }
    
    if (packageFilter) {
      where.package = packageFilter;
    }

    const briefs = await prisma.project.findMany({
      where,
      include: {
        business: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            category: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parse brief JSON for each project
    const formattedBriefs = briefs.map((project) => ({
      ...project,
      brief: project.brief ? JSON.parse(project.brief) : null,
    }));

    return NextResponse.json({
      success: true,
      briefs: formattedBriefs,
      total: briefs.length,
    });
  } catch (error) {
    console.error('Error fetching briefs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch briefs' },
      { status: 500 }
    );
  }
}

// POST - Create new client brief
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      // Business info
      businessName,
      businessType,
      industry,
      description,
      targetAudience,
      uniqueSelling,
      // Contact
      contactName,
      email,
      phone,
      country,
      city,
      // Design
      style,
      primaryColor,
      secondaryColor,
      fontPreference,
      referenceWebsites,
      // Features
      pagesNeeded,
      mainFeatures,
      specialFeatures,
      // Additional
      deadline,
      budget,
      additionalNotes,
      hasLogo,
      hasContent,
      hasImages,
      // Package
      package: selectedPackage,
      // Payment info
      paymentMethod,
      paymentAmount,
      paymentCurrency,
    } = body;

    // Create or find business
    let business = await prisma.business.findFirst({
      where: { email },
    });

    if (!business) {
      business = await prisma.business.create({
        data: {
          name: businessName,
          email,
          phone,
          category: industry,
          city,
          country,
          hasWebsite: false,
        },
      });
    }

    // Create brief object
    const briefData = {
      businessType,
      description,
      targetAudience,
      uniqueSelling,
      contactName,
      design: {
        style,
        primaryColor,
        secondaryColor,
        fontPreference,
        referenceWebsites,
      },
      pagesNeeded,
      mainFeatures,
      specialFeatures,
      timeline: {
        deadline,
        budget,
      },
      assets: {
        hasLogo,
        hasContent,
        hasImages,
      },
      additionalNotes,
    };

    // Create project with brief
    const project = await prisma.project.create({
      data: {
        businessId: business.id,
        package: selectedPackage || 'standard',
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod,
        amount: paymentAmount,
        currency: paymentCurrency || 'USD',
        brief: JSON.stringify(briefData),
      },
      include: {
        business: true,
      },
    });

    // Create payment transaction if payment method provided
    if (paymentMethod) {
      await prisma.paymentTransaction.create({
        data: {
          projectId: project.id,
          provider: paymentMethod,
          amount: paymentAmount || 0,
          currency: paymentCurrency || 'USD',
          status: 'pending',
          metadata: JSON.stringify({
            phoneNumber: phone,
            packageName: selectedPackage,
          }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        businessName: business.name,
        email: business.email,
        package: project.package,
        status: project.status,
        brief: briefData,
        createdAt: project.createdAt,
      },
      message: 'Brief created successfully',
    });
  } catch (error) {
    console.error('Error creating brief:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create brief' },
      { status: 500 }
    );
  }
}

// PUT - Update brief status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, status, notes } = body;

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;

    const project = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      project,
      message: 'Project updated successfully',
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}
