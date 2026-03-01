import { NextRequest, NextResponse } from 'next/server';
import { db, successResponse, errorResponse, getPaginationParams, paginatedResponse, getAuthUser } from '@/lib/backend-utils';
import { Business } from '@prisma/client';

// ==========================================
// GET /api/discover - Get discovered businesses
// ==========================================
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);
    const status = searchParams.get('status');
    const hasWebsite = searchParams.get('hasWebsite');
    const category = searchParams.get('category');

    const where: Record<string, unknown> = {};

    if (hasWebsite !== null) {
      where.hasWebsite = hasWebsite === 'true';
    }
    if (category) {
      where.category = category;
    }

    const [businesses, total] = await Promise.all([
      db.business.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.business.count({ where })
    ]);

    return paginatedResponse(businesses, total, page, limit);
  } catch (error) {
    console.error('Get discover results error:', error);
    return errorResponse('Failed to get results', 500);
  }
}

// ==========================================
// POST /api/discover - Search for businesses
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { location, radius = 5000, category, onlyWithoutWebsites = true } = body;

    if (!location) {
      return errorResponse('Location is required', 400);
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return errorResponse('Google Places API key not configured', 500);
    }

    // Search Google Places API
    const searchQuery = category ? `${category} in ${location}` : location;
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`;

    const response = await fetch(textSearchUrl);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status);
      return errorResponse('Failed to search businesses', 500);
    }

    const results = data.results || [];
    const businesses: Business[] = [];

    for (const place of results) {
      let business = await db.business.findUnique({
        where: { placeId: place.place_id }
      });

      if (!business) {
        const websiteStatus = place.website ? 'active' : 'no_website';
        const hasWebsite = !!place.website;

        business = await db.business.create({
          data: {
            placeId: place.place_id,
            name: place.name,
            address: place.formatted_address,
            rating: place.rating || null,
            reviewCount: place.user_ratings_total || null,
            latitude: place.geometry?.location?.lat,
            longitude: place.geometry?.location?.lng,
            category: place.types?.[0] || category || 'unknown',
            website: place.website || null,
            hasWebsite,
            websiteStatus,
            photoUrl: place.photos?.[0]?.photo_reference 
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
              : null,
          }
        });

        // Create lead if no website
        if (!hasWebsite) {
          await db.lead.create({
            data: {
              businessId: business.id,
              businessName: business.name,
              businessAddress: business.address,
              businessCategory: business.category,
              website: business.website,
              source: 'discover',
              status: 'new',
              priority: business.rating && business.rating >= 4 ? 'high' : 'medium',
            }
          });
        }
      }

      businesses.push(business);
    }

    const filteredBusinesses = onlyWithoutWebsites
      ? businesses.filter(b => !b.hasWebsite)
      : businesses;

    return successResponse({
      total: filteredBusinesses.length,
      businesses: filteredBusinesses,
      location,
      radius
    });
  } catch (error) {
    console.error('Discover search error:', error);
    return errorResponse('Failed to search businesses', 500);
  }
}
