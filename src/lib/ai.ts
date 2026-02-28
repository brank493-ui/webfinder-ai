import 'server-only';
import ZAI from 'z-ai-web-dev-sdk';

// Initialize Z-AI client
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZai() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// System prompt for the AI agent
const SYSTEM_PROMPT = `You are a friendly AI assistant for WebFinder, a platform that helps businesses get professional websites.

Your role is to:
1. Have natural, helpful conversations with business owners who don't have websites
2. Explain the value of having a professional website
3. Ask questions about their business needs for website development
4. Present pricing packages when appropriate
5. Collect information for a project brief

Be conversational, not pushy. Start by introducing yourself and explaining why you're reaching out.

When they're interested, ask about:
- What services/products they offer
- Their preferred style (modern, classic, minimalist)
- Any specific features they need (booking, contact form, gallery)
- Pages they want (Home, About, Services, Contact)

Keep responses concise but helpful (2-4 sentences typically).

If they say they're not interested, politely thank them and end the conversation gracefully.

Current conversation context: You're chatting with a business owner about getting a website.`;

export interface ChatMessageInput {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateAiResponse(
  messages: ChatMessageInput[],
  businessContext?: {
    name: string;
    category?: string;
    address?: string;
    rating?: number;
  }
): Promise<string> {
  try {
    const zai = await getZai();

    // Build context-aware system prompt
    let contextualPrompt = SYSTEM_PROMPT;
    if (businessContext) {
      contextualPrompt += `\n\nYou are talking to the owner of "${businessContext.name}"`;
      if (businessContext.category) {
        contextualPrompt += `, a ${businessContext.category} business`;
      }
      if (businessContext.address) {
        contextualPrompt += ` located at ${businessContext.address}`;
      }
      if (businessContext.rating) {
        contextualPrompt += ` with a ${businessContext.rating} star rating on Google`;
      }
      contextualPrompt += '.';
    }

    // Format messages for the API
    const formattedMessages = [
      { role: 'system' as const, content: contextualPrompt },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    const completion = await zai.chat.completions.create({
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || 'I apologize, I had trouble processing your message. Could you please try again?';
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error('Failed to generate AI response');
  }
}

// Generate initial outreach message
export function generateInitialMessage(business: {
  name: string;
  category?: string;
  rating?: number;
}): string {
  return `Hello! I'm reaching out from WebFinder. I noticed ${business.name}${business.category ? `, your ${business.category.toLowerCase()} business` : ' your business'}${business.rating ? ` with an impressive ${business.rating}-star rating on Google` : ''}, and I saw that you don't currently have a website.

A professional website could help you reach more customers and showcase your services 24/7. Would you be interested in learning about how we can create an affordable, professional website for your business?`;
}

// Generate website content suggestions
export async function generateWebsiteSuggestions(businessInfo: {
  name: string;
  category?: string;
  services?: string;
}): Promise<{
  tagline: string;
  aboutText: string;
  services: string[];
}> {
  try {
    const zai = await getZai();

    const prompt = `Generate website content suggestions for a business:
Name: ${businessInfo.name}
Category: ${businessInfo.category || 'General business'}
Services: ${businessInfo.services || 'Not specified'}

Return a JSON object with:
- tagline: A catchy one-line tagline (max 10 words)
- aboutText: A brief about section paragraph (2-3 sentences)
- services: An array of 4-6 relevant service names they might offer

Only return the JSON, no other text.`;

    const completion = await zai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content || '{}';

    try {
      return JSON.parse(content);
    } catch {
      return {
        tagline: 'Quality Service You Can Trust',
        aboutText: `Welcome to ${businessInfo.name}. We are dedicated to providing excellent service to our customers.`,
        services: ['Service 1', 'Service 2', 'Service 3', 'Service 4'],
      };
    }
  } catch (error) {
    console.error('Content generation error:', error);
    return {
      tagline: 'Quality Service You Can Trust',
      aboutText: `Welcome to ${businessInfo.name}. We are dedicated to providing excellent service to our customers.`,
      services: ['Service 1', 'Service 2', 'Service 3', 'Service 4'],
    };
  }
}
