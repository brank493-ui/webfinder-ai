import { NextRequest, NextResponse } from 'next/server';

// ==========================================
// GET /api/socket - WebSocket handshake endpoint
// ==========================================
export async function GET(request: NextRequest) {
  // This endpoint is used by Socket.IO for WebSocket handshake
  // The actual WebSocket connection is handled by the custom server
  
  return NextResponse.json({
    success: true,
    message: 'WebSocket endpoint ready',
    path: '/api/socket',
  });
}

export async function POST(request: NextRequest) {
  // Handle Socket.IO POST requests for fallback polling
  return NextResponse.json({
    success: true,
    message: 'Socket endpoint active',
  });
}
