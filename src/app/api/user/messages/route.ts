import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get messages for a project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');

    // If userId but no projectId, get user's project first
    let targetProjectId = projectId;

    if (!targetProjectId && userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { projectId: true },
      });
      targetProjectId = user?.projectId || null;
    }

    if (!targetProjectId) {
      return NextResponse.json({
        success: true,
        messages: [],
      });
    }

    // Get project
    const project = await prisma.project.findUnique({
      where: { id: targetProjectId },
      include: { business: true },
    });

    if (!project) {
      return NextResponse.json({
        success: true,
        messages: [],
      });
    }

    // Get messages from database
    const dbMessages = await prisma.message.findMany({
      where: { projectId: targetProjectId },
      orderBy: { createdAt: 'asc' },
    });

    // If no messages yet, create welcome message
    if (dbMessages.length === 0) {
      const welcomeMessage = await prisma.message.create({
        data: {
          projectId: targetProjectId,
          senderId: 'admin',
          senderName: 'WebFinder Team',
          content: `Welcome to your project dashboard! Your ${project.package} package website is now being developed. Feel free to message us with any questions or changes you'd like to make.`,
          isFromAdmin: true,
        },
      });
      dbMessages.push(welcomeMessage);
    }

    // Format messages for frontend
    const messages = dbMessages.map(msg => ({
      id: msg.id,
      sender: msg.isFromAdmin ? 'team' : 'user',
      senderId: msg.senderId,
      senderName: msg.senderName,
      content: msg.content,
      timestamp: msg.createdAt,
      isFromAdmin: msg.isFromAdmin,
      read: msg.read,
    }));

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// Send a message from user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, userId, message } = body;

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's project if not provided
    let targetProjectId = projectId || user.projectId;

    if (!targetProjectId) {
      return NextResponse.json(
        { success: false, error: 'No project found for user' },
        { status: 404 }
      );
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: targetProjectId },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Save message to database
    const newMessage = await prisma.message.create({
      data: {
        projectId: targetProjectId,
        senderId: user.id,
        senderName: user.name || user.email,
        content: message,
        isFromAdmin: user.role === 'owner',
      },
    });

    // Create notification for admin if message from client
    if (user.role !== 'owner') {
      // Find owner
      const owner = await prisma.user.findFirst({
        where: { role: 'owner' },
      });

      if (owner) {
        await prisma.notification.create({
          data: {
            userId: owner.id,
            type: 'message',
            title: `New message from ${user.name}`,
            description: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
            actionUrl: `/workspaces?project=${targetProjectId}`,
            actionLabel: 'View Project',
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: {
        id: newMessage.id,
        senderId: newMessage.senderId,
        senderName: newMessage.senderName,
        content: newMessage.content,
        isFromAdmin: newMessage.isFromAdmin,
        timestamp: newMessage.createdAt,
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
