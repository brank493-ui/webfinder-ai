import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    // Create AI response
    const zai = await ZAI.create();
    
    const systemPrompt = `You are April, a friendly and helpful AI assistant for WebFinder AI, a website development company. You help users with:

1. Getting started with their website project
2. Understanding pricing packages (Standard $149, Pro $399, Premium $999)
3. Explaining the website development process
4. Answering questions about features and services
5. Helping with payment and invoice questions

Be friendly, concise, and helpful. Use emojis sparingly. Format responses nicely with bullet points when appropriate.

Key information about WebFinder AI:
- Standard Package: $149 (≈91,000 CFA) - Basic website, 5 pages, responsive design
- Pro Package: $399 (≈245,000 CFA) - Professional website, 10 pages, SEO, contact form
- Premium Package: $999 (≈615,000 CFA) - Full website, e-commerce, custom features
- Delivery: Standard 5-7 days, Pro 7-14 days, Premium 14-21 days
- Contact: brank493@gmail.com, +237 693 401 619
- Location: Cameroon, West Africa

If you don't know something specific, direct them to contact support.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, I could not process your request. Please try again or contact support.';

    return NextResponse.json({
      success: true,
      response,
    });

  } catch (error) {
    console.error('April help error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
