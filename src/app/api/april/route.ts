import { NextRequest, NextResponse } from 'next/server';
import { 
  createLead, 
  getLeads, 
  getConversation, 
  getAprilStats,
  initiateContact,
  generateLeadReport,
  convertLeadToUser,
  ownerMessage,
  searchBusinessesWithoutWebsite
} from '@/lib/april';

// GET - Fetch leads or stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // Get stats
    if (action === 'stats') {
      const stats = await getAprilStats();
      return NextResponse.json({ success: true, stats });
    }
    
    // Get conversation for a lead
    if (action === 'conversation') {
      const leadId = searchParams.get('leadId');
      if (!leadId) {
        return NextResponse.json(
          { success: false, error: 'Lead ID required' },
          { status: 400 }
        );
      }
      const conversation = await getConversation(leadId);
      return NextResponse.json({ success: true, conversation });
    }
    
    // Get leads with filters
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    const leads = await getLeads({ status, priority, limit });
    return NextResponse.json({ success: true, leads });
    
  } catch (error) {
    console.error('April API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create lead, send message, or trigger actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;
    
    switch (action) {
      case 'create_lead': {
        const lead = await createLead(data);
        return NextResponse.json({ success: true, lead });
      }
      
      case 'initiate_contact': {
        const { leadId } = data;
        const message = await initiateContact(leadId);
        return NextResponse.json({ success: true, message });
      }
      
      case 'generate_report': {
        const { leadId } = data;
        const report = await generateLeadReport(leadId);
        return NextResponse.json({ success: true, report });
      }
      
      case 'convert_to_user': {
        const { leadId, userData } = data;
        const result = await convertLeadToUser(leadId, userData);
        return NextResponse.json(result);
      }
      
      case 'owner_message': {
        const { leadId, message } = data;
        await ownerMessage(leadId, message);
        return NextResponse.json({ success: true });
      }
      
      case 'search_businesses': {
        const { location, category, limit } = data;
        const businesses = await searchBusinessesWithoutWebsite(location, category, limit);
        return NextResponse.json({ success: true, businesses });
      }
      
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('April API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
