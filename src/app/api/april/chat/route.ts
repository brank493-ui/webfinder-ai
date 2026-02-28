import { NextRequest, NextResponse } from 'next/server';
import { aprilChat } from '@/lib/april';

// POST - Chat with April
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, message, language = 'en' } = body;
    
    if (!leadId || !message) {
      return NextResponse.json(
        { success: false, error: 'Lead ID and message are required' },
        { status: 400 }
      );
    }
    
    const result = await aprilChat(leadId, message, language);
    
    return NextResponse.json({
      success: true,
      response: result.response,
      action: result.action,
      formData: result.formData,
    });
  } catch (error) {
    console.error('April Chat Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
