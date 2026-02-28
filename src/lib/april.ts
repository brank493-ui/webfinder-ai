/**
 * April AI Agent - Autonomous Business Outreach Assistant
 * 
 * April can:
 * - Search for businesses without websites
 * - Contact leads and manage conversations
 * - Collect information via forms
 * - Generate reports for the owner
 */

import ZAI from 'z-ai-web-dev-sdk';
import { prisma } from './db';

// April's personality and instructions
const APRIL_SYSTEM_PROMPT = `You are April, a friendly and professional AI assistant for WebFinder, a web development agency. Your role is to help businesses establish their online presence.

ABOUT YOU:
- Name: April
- Role: Business Development Assistant at WebFinder
- Personality: Friendly, professional, helpful, and conversational
- You speak both English and French fluently

YOUR CAPABILITIES:
1. Help businesses understand if they need a website
2. Collect information about their business needs
3. Guide them through the registration process
4. Answer questions about web development services

SERVICES OFFERED BY WEBFINDER:
- Standard Package ($149): Basic website, up to 5 pages, contact form
- Pro Package ($399): Professional website, up to 10 pages, SEO, booking system
- Premium Package ($999): Full-featured website, unlimited pages, e-commerce, priority support

COMMUNICATION STYLE:
- Be conversational and friendly
- Ask one or two questions at a time (don't overwhelm)
- Show genuine interest in their business
- Be helpful even if they're not ready to buy
- Offer to send them a link to register when they show interest

IMPORTANT:
- Never be pushy or salesy
- If they decline, thank them politely and leave the door open
- Always offer to answer any questions
- When collecting info, use the structured form when possible

RESPONDING:
- Keep responses concise but warm
- Use the user's language (English or French)
- If they seem interested, guide them to the registration link`;

// Types for April
export interface AprilLead {
  id: string;
  businessName: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  businessCategory?: string;
  website?: string;
  status: string;
  credentialNumber?: string;
  needsWebsite?: boolean;
  budget?: string;
  timeline?: string;
  servicesNeeded?: string;
  notes?: string;
  priority: string;
  aprilScore?: number;
  aprilNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AprilMessage {
  role: 'april' | 'lead' | 'owner';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface BusinessSearchResult {
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  category?: string;
  rating?: number;
  hasWebsite: boolean;
}

// Initialize ZAI
async function getZai() {
  return await ZAI.create();
}

/**
 * Generate a unique credential number for new leads
 */
export function generateCredentialNumber(): string {
  const prefix = 'WF';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Search for businesses without websites using web search
 */
export async function searchBusinessesWithoutWebsite(
  location: string,
  category?: string,
  limit: number = 10
): Promise<BusinessSearchResult[]> {
  try {
    const zai = await getZai();
    
    const searchQuery = category
      ? `${category} businesses in ${location} without website contact information`
      : `small businesses in ${location} contact information no website`;
    
    const searchResult = await zai.functions.invoke('web_search', {
      query: searchQuery,
      num: limit * 2, // Get more results to filter
    });
    
    if (!searchResult || !Array.isArray(searchResult)) {
      return [];
    }
    
    // Process and filter results
    const businesses: BusinessSearchResult[] = searchResult
      .filter((result: { url?: string; snippet?: string }) => result.snippet || result.url)
      .slice(0, limit)
      .map((result: { name?: string; snippet?: string; url?: string }) => ({
        name: result.name || 'Unknown Business',
        address: extractAddress(result.snippet || ''),
        phone: extractPhone(result.snippet || ''),
        website: undefined,
        category: category || 'General',
        hasWebsite: false,
      }));
    
    return businesses;
  } catch (error) {
    console.error('Error searching businesses:', error);
    return [];
  }
}

/**
 * Extract phone number from text
 */
function extractPhone(text: string): string | undefined {
  const phoneRegex = /[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}/g;
  const match = text.match(phoneRegex);
  return match ? match[0] : undefined;
}

/**
 * Extract address from text
 */
function extractAddress(text: string): string | undefined {
  // Simple address extraction - could be improved
  const addressPatterns = [
    /\d+[^,]*,\s*[^,]+,\s*[A-Z]{2,}\s*\d{5}/gi,
    /\d+\s+[A-Za-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr)/gi,
  ];
  
  for (const pattern of addressPatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  
  return undefined;
}

/**
 * Create a new lead in the database
 */
export async function createLead(data: {
  businessName: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  businessCategory?: string;
  source?: string;
}): Promise<AprilLead> {
  const lead = await prisma.aprilLead.create({
    data: {
      businessName: data.businessName,
      businessEmail: data.businessEmail,
      businessPhone: data.businessPhone,
      businessAddress: data.businessAddress,
      businessCategory: data.businessCategory,
      source: data.source || 'manual',
      status: 'new',
      priority: 'medium',
    },
  });
  
  return lead as AprilLead;
}

/**
 * Send a message from April and get AI response
 */
export async function aprilChat(
  leadId: string,
  userMessage: string,
  language: 'en' | 'fr' = 'en'
): Promise<{ response: string; action?: string; formData?: Record<string, unknown> }> {
  try {
    // Get lead info and conversation history
    const lead = await prisma.aprilLead.findUnique({
      where: { id: leadId },
      include: {
        conversations: {
          orderBy: { createdAt: 'asc' },
          take: 20, // Last 20 messages for context
        },
      },
    });
    
    if (!lead) {
      throw new Error('Lead not found');
    }
    
    // Store user message
    await prisma.aprilConversation.create({
      data: {
        leadId,
        sender: 'lead',
        message: userMessage,
        messageType: 'text',
      },
    });
    
    // Build conversation context
    const conversationHistory = lead.conversations.map((msg) => ({
      role: msg.sender === 'april' ? 'assistant' : 'user',
      content: msg.message,
    })) as { role: 'assistant' | 'user'; content: string }[];
    
    // Get AI response
    const zai = await getZai();
    
    const languageInstruction = language === 'fr' 
      ? '\n\nIMPORTANT: Respond in French (Français). The user speaks French.'
      : '';
    
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: APRIL_SYSTEM_PROMPT + languageInstruction },
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const response = completion.choices[0]?.message?.content || 
      "I'm sorry, I didn't catch that. Could you please repeat?";
    
    // Determine if we should take an action
    let action: string | undefined;
    let formData: Record<string, unknown> | undefined;
    
    const lowerResponse = response.toLowerCase();
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if user wants to register
    if (
      lowerMessage.includes('register') || 
      lowerMessage.includes('sign up') ||
      lowerMessage.includes('get started') ||
      lowerMessage.includes('interested') ||
      lowerMessage.includes('je veux') ||
      lowerMessage.includes('inscrire') ||
      lowerMessage.includes('commencer')
    ) {
      action = 'offer_registration';
      formData = {
        businessName: lead.businessName,
        email: lead.businessEmail,
        phone: lead.businessPhone,
      };
    }
    
    // Check if user is providing contact info
    const emailMatch = userMessage.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = userMessage.match(/[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}/);
    
    if (emailMatch || phoneMatch) {
      action = 'update_contact';
      formData = {
        email: emailMatch ? emailMatch[0] : lead.businessEmail,
        phone: phoneMatch ? phoneMatch[0] : lead.businessPhone,
      };
      
      // Update lead
      await prisma.aprilLead.update({
        where: { id: leadId },
        data: {
          businessEmail: emailMatch ? emailMatch[0] : lead.businessEmail,
          businessPhone: phoneMatch ? phoneMatch[0] : lead.businessPhone,
          status: 'responded',
        },
      });
    }
    
    // Store April's response
    await prisma.aprilConversation.create({
      data: {
        leadId,
        sender: 'april',
        message: response,
        messageType: 'text',
        metadata: formData ? JSON.stringify(formData) : null,
      },
    });
    
    // Update lead status if it's their first response
    if (lead.status === 'new' || lead.status === 'contacted') {
      await prisma.aprilLead.update({
        where: { id: leadId },
        data: { status: 'responded' },
      });
    }
    
    return { response, action, formData };
  } catch (error) {
    console.error('Error in April chat:', error);
    return {
      response: "I apologize, but I'm having some technical difficulties. Please try again in a moment.",
    };
  }
}

/**
 * Start initial outreach to a lead
 */
export async function initiateContact(leadId: string): Promise<string> {
  try {
    const lead = await prisma.aprilLead.findUnique({
      where: { id: leadId },
    });
    
    if (!lead) {
      throw new Error('Lead not found');
    }
    
    // Generate personalized opening message
    const zai = await getZai();
    
    const prompt = `Generate a friendly, personalized first contact message for a business called "${lead.businessName}"${lead.businessCategory ? ` in the ${lead.businessCategory} industry` : ''}. 
      
The message should:
1. Introduce yourself as April from WebFinder
2. Briefly mention you help businesses get online
3. Ask if they currently have a website
4. Be under 100 words
5. Be conversational and friendly, not salesy

Do not include any placeholders or brackets - write the actual message.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are April, a friendly business outreach assistant. Write concise, personalized messages.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 200,
    });
    
    const message = completion.choices[0]?.message?.content || 
      `Hello! I'm April from WebFinder. I noticed ${lead.businessName} and wanted to reach out. Do you currently have a website for your business? I'd love to help you establish your online presence!`;
    
    // Store the message
    await prisma.aprilConversation.create({
      data: {
        leadId,
        sender: 'april',
        message,
        messageType: 'text',
      },
    });
    
    // Update lead status
    await prisma.aprilLead.update({
      where: { id: leadId },
      data: { status: 'contacted' },
    });
    
    return message;
  } catch (error) {
    console.error('Error initiating contact:', error);
    throw error;
  }
}

/**
 * Generate a report for a lead
 */
export async function generateLeadReport(leadId: string): Promise<{
  summary: string;
  recommendations: string[];
  score: number;
}> {
  try {
    const lead = await prisma.aprilLead.findUnique({
      where: { id: leadId },
      include: {
        conversations: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    
    if (!lead) {
      throw new Error('Lead not found');
    }
    
    const zai = await getZai();
    
    const conversationText = lead.conversations
      .map((c) => `${c.sender}: ${c.message}`)
      .join('\n');
    
    const prompt = `Analyze this conversation and lead information for a web development sales lead:

BUSINESS: ${lead.businessName}
CATEGORY: ${lead.businessCategory || 'Unknown'}
EMAIL: ${lead.businessEmail || 'Not provided'}
PHONE: ${lead.businessPhone || 'Not provided'}
STATUS: ${lead.status}

CONVERSATION:
${conversationText || 'No conversation yet'}

Provide:
1. A brief 2-3 sentence summary of this lead
2. 2-3 specific recommendations for next steps
3. A lead quality score from 0-100 (0=not interested, 100=hot lead ready to buy)

Format as JSON:
{
  "summary": "...",
  "recommendations": ["...", "..."],
  "score": 75
}`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a sales analyst. Provide concise, actionable insights in JSON format.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 500,
    });
    
    const responseText = completion.choices[0]?.message?.content || '{}';
    
    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const report = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      summary: 'Unable to generate report',
      recommendations: ['Follow up with the lead'],
      score: 50,
    };
    
    // Store the report
    await prisma.aprilReport.create({
      data: {
        leadId,
        reportType: 'qualification',
        content: JSON.stringify(report),
        summary: report.summary,
        recommendations: report.recommendations.join('; '),
        engagementScore: report.score,
      },
    });
    
    // Update lead with score
    await prisma.aprilLead.update({
      where: { id: leadId },
      data: {
        aprilScore: report.score,
        aprilNotes: report.summary,
      },
    });
    
    return report;
  } catch (error) {
    console.error('Error generating report:', error);
    return {
      summary: 'Unable to generate report at this time',
      recommendations: ['Follow up with the lead'],
      score: 50,
    };
  }
}

/**
 * Convert lead to registered user
 */
export async function convertLeadToUser(
  leadId: string,
  userData: {
    email: string;
    name: string;
    phone?: string;
  }
): Promise<{ success: boolean; credentialNumber?: string; error?: string }> {
  try {
    const lead = await prisma.aprilLead.findUnique({
      where: { id: leadId },
    });
    
    if (!lead) {
      return { success: false, error: 'Lead not found' };
    }
    
    // Generate credential number
    const credentialNumber = generateCredentialNumber();
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email.toLowerCase(),
        name: userData.name,
        phone: userData.phone,
        role: 'user',
        provider: 'credential',
        credentialNumber,
        hasCompletedOnboarding: false,
      },
    });
    
    // Create access code for the user
    await prisma.accessCode.create({
      data: {
        code: credentialNumber,
        email: userData.email,
        used: true,
        usedBy: user.id,
      },
    });
    
    // Update lead
    await prisma.aprilLead.update({
      where: { id: leadId },
      data: {
        status: 'converted',
        credentialNumber,
        userId: user.id,
      },
    });
    
    // Add message about registration
    await prisma.aprilConversation.create({
      data: {
        leadId,
        sender: 'april',
        message: `🎉 Congratulations! You've been registered successfully. Your credential number is: ${credentialNumber}\n\nYou can use this number to log in and track your project. Visit our website to get started!`,
        messageType: 'text',
        metadata: JSON.stringify({ credentialNumber, userId: user.id }),
      },
    });
    
    return { success: true, credentialNumber };
  } catch (error) {
    console.error('Error converting lead:', error);
    return { success: false, error: 'Failed to create user account' };
  }
}

/**
 * Get all leads with optional filtering
 */
export async function getLeads(filters?: {
  status?: string;
  priority?: string;
  limit?: number;
}): Promise<AprilLead[]> {
  const where: Record<string, unknown> = {};
  
  if (filters?.status) {
    where.status = filters.status;
  }
  if (filters?.priority) {
    where.priority = filters.priority;
  }
  
  const leads = await prisma.aprilLead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: filters?.limit || 50,
    include: {
      _count: {
        select: { conversations: true },
      },
    },
  });
  
  return leads as AprilLead[];
}

/**
 * Get conversation for a lead
 */
export async function getConversation(leadId: string): Promise<AprilMessage[]> {
  const messages = await prisma.aprilConversation.findMany({
    where: { leadId },
    orderBy: { createdAt: 'asc' },
  });
  
  return messages.map((m) => ({
    role: m.sender as 'april' | 'lead' | 'owner',
    content: m.message,
    metadata: m.metadata ? JSON.parse(m.metadata) : undefined,
  }));
}

/**
 * Owner can send message to lead
 */
export async function ownerMessage(
  leadId: string,
  message: string
): Promise<void> {
  await prisma.aprilConversation.create({
    data: {
      leadId,
      sender: 'owner',
      message,
      messageType: 'text',
    },
  });
}

/**
 * Get dashboard stats for April
 */
export async function getAprilStats(): Promise<{
  totalLeads: number;
  newLeads: number;
  contacted: number;
  responded: number;
  converted: number;
  avgScore: number;
}> {
  const [total, newLeads, contacted, responded, converted, avgScore] = await Promise.all([
    prisma.aprilLead.count(),
    prisma.aprilLead.count({ where: { status: 'new' } }),
    prisma.aprilLead.count({ where: { status: 'contacted' } }),
    prisma.aprilLead.count({ where: { status: 'responded' } }),
    prisma.aprilLead.count({ where: { status: 'converted' } }),
    prisma.aprilLead.aggregate({
      where: { aprilScore: { not: null } },
      _avg: { aprilScore: true },
    }),
  ]);
  
  return {
    totalLeads: total,
    newLeads,
    contacted,
    responded,
    converted,
    avgScore: Math.round(avgScore._avg.aprilScore || 0),
  };
}
