import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateAiResponse, generateInitialMessage } from '@/lib/ai';
import type { ChatMessage } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, message, conversationId } = body;

    if (!businessId) {
      return NextResponse.json(
        { success: false, error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Get business details
    const business = await db.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      );
    }

    let conversation;
    let messages: ChatMessage[] = [];

    // Get or create conversation
    if (conversationId) {
      conversation = await db.conversation.findUnique({
        where: { id: conversationId },
      });

      if (conversation) {
        try {
          messages = JSON.parse(conversation.messages);
        } catch {
          messages = [];
        }
      }
    } else {
      // Create new conversation
      const initialMessage = generateInitialMessage({
        name: business.name,
        category: business.category || undefined,
        rating: business.rating || undefined,
      });

      messages = [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: initialMessage,
          timestamp: new Date(),
        },
      ];

      conversation = await db.conversation.create({
        data: {
          businessId: business.id,
          status: 'active',
          messages: JSON.stringify(messages),
        },
      });
    }

    // If user sent a message, process it
    if (message) {
      // Add user message
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      messages.push(userMessage);

      // Generate AI response
      const aiContent = await generateAiResponse(
        messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        {
          name: business.name,
          category: business.category || undefined,
          address: business.address || undefined,
          rating: business.rating || undefined,
        }
      );

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
      };
      messages.push(aiMessage);

      // Update conversation in database
      await db.conversation.update({
        where: { id: conversation.id },
        data: {
          messages: JSON.stringify(messages),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: aiMessage,
        conversationId: conversation.id,
      });
    }

    // Return initial conversation
    return NextResponse.json({
      success: true,
      message: messages[messages.length - 1],
      conversationId: conversation.id,
      conversation: messages,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: { business: true },
    });

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      );
    }

    let messages: ChatMessage[] = [];
    try {
      messages = JSON.parse(conversation.messages);
    } catch {
      messages = [];
    }

    return NextResponse.json({
      success: true,
      conversation: {
        ...conversation,
        messages,
      },
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}
