import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Generate a unique access code for a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, email, name } = body;

    if (!businessId || !email) {
      return NextResponse.json(
        { success: false, error: 'Business ID and email are required' },
        { status: 400 }
      );
    }

    // Find or create the business
    let business = await prisma.business.findFirst({
      where: {
        OR: [
          { id: businessId },
          { email: email },
        ],
      },
    });

    if (!business) {
      // Create new business
      business = await prisma.business.create({
        data: {
          name: name || 'New Client',
          email: email,
          hasWebsite: false,
        },
      });
    }

    // Generate unique access code
    const accessCode = generateAccessCode();

    // Create project with access code
    const project = await prisma.project.create({
      data: {
        businessId: business.id,
        status: 'pending',
        paymentStatus: 'pending',
        package: 'standard',
        brief: JSON.stringify({}),
        notes: `Access Code: ${accessCode}`,
      },
    });

    // Update the project notes with the proper access code
    await prisma.project.update({
      where: { id: project.id },
      data: {
        notes: `Access Code: ${accessCode}\nClient: ${name || business.name}\nEmail: ${email}`,
      },
    });

    return NextResponse.json({
      success: true,
      accessCode: project.id, // Using project ID as access code
      projectId: project.id,
      message: 'Access code generated successfully',
    });
  } catch (error) {
    console.error('Error generating access code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate access code' },
      { status: 500 }
    );
  }
}

// Generate a readable access code
function generateAccessCode(): string {
  const prefix = 'WF';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = prefix;
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
