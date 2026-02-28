import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Business, GooglePlaceResult } from '@/types';

// Mock data for testing without Google API key
const MOCK_BUSINESSES: Business[] = [
  {
    id: 'mock-1',
    placeId: 'ChIJmock1',
    name: 'Sunrise Cafe',
    address: '123 Main Street, New York, NY 10001',
    phone: '+1 212-555-0101',
    category: 'Restaurant',
    rating: 4.5,
    reviewCount: 234,
    latitude: 40.7128,
    longitude: -74.006,
    hasWebsite: false,
    websiteStatus: 'no_website',
  },
  {
    id: 'mock-2',
    placeId: 'ChIJmock2',
    name: 'Quick Fix Auto Repair',
    address: '456 Oak Avenue, Brooklyn, NY 11201',
    phone: '+1 718-555-0202',
    category: 'Auto Repair',
    rating: 4.8,
    reviewCount: 156,
    latitude: 40.6892,
    longitude: -73.9857,
    hasWebsite: false,
    websiteStatus: 'no_website',
  },
  {
    id: 'mock-3',
    placeId: 'ChIJmock3',
    name: 'Glow Beauty Salon',
    address: '789 Park Place, Manhattan, NY 10016',
    phone: '+1 212-555-0303',
    website: 'https://facebook.com/glowbeauty',
    category: 'Beauty Salon',
    rating: 4.2,
    reviewCount: 89,
    latitude: 40.7484,
    longitude: -73.9857,
    hasWebsite: false,
    websiteStatus: 'social_media',
  },
  {
    id: 'mock-4',
    placeId: 'ChIJmock4',
    name: 'Family Dental Care',
    address: '321 Health Street, Queens, NY 11375',
    phone: '+1 718-555-0404',
    category: 'Dentist',
    rating: 4.9,
    reviewCount: 312,
    latitude: 40.7282,
    longitude: -73.8317,
    hasWebsite: false,
    websiteStatus: 'no_website',
  },
  {
    id: 'mock-5',
    placeId: 'ChIJmock5',
    name: 'Mario\'s Pizzeria',
    address: '555 Pizza Lane, Bronx, NY 10451',
    phone: '+1 718-555-0505',
    category: 'Restaurant',
    rating: 4.6,
    reviewCount: 445,
    latitude: 40.8176,
    longitude: -73.9217,
    hasWebsite: false,
    websiteStatus: 'no_website',
  },
  {
    id: 'mock-6',
    placeId: 'ChIJmock6',
    name: 'Tech Repair Pro',
    address: '888 Circuit Road, Manhattan, NY 10002',
    phone: '+1 212-555-0606',
    website: 'https://techrepairpro.com',
    category: 'Electronics Store',
    rating: 4.3,
    reviewCount: 78,
    latitude: 40.7157,
    longitude: -73.9876,
    hasWebsite: true,
    websiteStatus: 'active',
  },
  {
    id: 'mock-7',
    placeId: 'ChIJmock7',
    name: 'Green Thumb Garden Center',
    address: '123 Bloom Street, Staten Island, NY 10301',
    phone: '+1 718-555-0707',
    category: 'Garden Center',
    rating: 4.7,
    reviewCount: 203,
    latitude: 40.6275,
    longitude: -74.0761,
    hasWebsite: false,
    websiteStatus: 'no_website',
  },
  {
    id: 'mock-8',
    placeId: 'ChIJmock8',
    name: 'FitLife Gym',
    address: '999 Strong Avenue, Brooklyn, NY 11215',
    phone: '+1 718-555-0808',
    category: 'Gym',
    rating: 4.4,
    reviewCount: 567,
    latitude: 40.671,
    longitude: -73.9837,
    hasWebsite: false,
    websiteStatus: 'no_website',
  },
  {
    id: 'mock-9',
    placeId: 'ChIJmock9',
    name: 'Pet Paradise',
    address: '777 Paws Road, Queens, NY 11432',
    phone: '+1 718-555-0909',
    category: 'Pet Store',
    rating: 4.5,
    reviewCount: 134,
    latitude: 40.7089,
    longitude: -73.8029,
    hasWebsite: false,
    websiteStatus: 'no_website',
  },
  {
    id: 'mock-10',
    placeId: 'ChIJmock10',
    name: 'Elite Hair Studio',
    address: '444 Style Street, Manhattan, NY 10011',
    phone: '+1 212-555-1010',
    category: 'Hair Salon',
    rating: 4.8,
    reviewCount: 289,
    latitude: 40.7411,
    longitude: -73.9947,
    hasWebsite: false,
    websiteStatus: 'no_website',
  },
];

// Category mapping for Google Places types
const CATEGORY_MAP: Record<string, string[]> = {
  restaurant: ['restaurant', 'cafe', 'bakery', 'meal_takeaway', 'food'],
  retail: ['store', 'clothing_store', 'electronics_store', 'furniture_store'],
  health: ['dentist', 'doctor', 'hospital', 'pharmacy', 'physiotherapist'],
  beauty: ['beauty_salon', 'hair_care', 'spa'],
  auto: ['car_repair', 'car_wash', 'gas_station'],
  service: ['plumber', 'electrician', 'moving_company', 'cleaning_service'],
  professional: ['lawyer', 'accounting', 'real_estate_agency'],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location, category, radius = 5000 } = body;

    if (!location) {
      return NextResponse.json(
        { success: false, error: 'Location is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    // If no API key, return mock data
    if (!apiKey) {
      console.log('No Google Places API key, returning mock data');

      // Filter mock data by category if specified
      let results = [...MOCK_BUSINESSES];
      if (category && category !== 'all') {
        results = results.filter(
          (b) => b.category?.toLowerCase().includes(category.toLowerCase())
        );
      }

      // Save to database
      for (const business of results) {
        try {
          await db.business.upsert({
            where: { placeId: business.placeId },
            create: {
              placeId: business.placeId,
              name: business.name,
              address: business.address,
              phone: business.phone,
              website: business.website,
              category: business.category,
              rating: business.rating,
              reviewCount: business.reviewCount,
              latitude: business.latitude,
              longitude: business.longitude,
              hasWebsite: business.hasWebsite,
              websiteStatus: business.websiteStatus,
            },
            update: {
              name: business.name,
              address: business.address,
              hasWebsite: business.hasWebsite,
              websiteStatus: business.websiteStatus,
            },
          });
        } catch (dbError) {
          console.error('Error saving business to DB:', dbError);
        }
      }

      return NextResponse.json({
        success: true,
        businesses: results,
        total: results.length,
      });
    }

    // Real Google Places API implementation
    const categoryTypes = category && CATEGORY_MAP[category]
      ? CATEGORY_MAP[category]
      : ['establishment'];

    // Text Search API
    const searchUrl = new URL(
      'https://maps.googleapis.com/maps/api/place/textsearch/json'
    );
    searchUrl.searchParams.set('query', `${category || 'business'} in ${location}`);
    searchUrl.searchParams.set('radius', String(radius));
    searchUrl.searchParams.set('key', apiKey);

    const searchResponse = await fetch(searchUrl.toString());
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', searchData);
      return NextResponse.json(
        { success: false, error: 'Failed to search businesses' },
        { status: 500 }
      );
    }

    const places = searchData.results || [];
    const businesses: Business[] = [];

    // Process each place
    for (const place of places.slice(0, 20)) {
      // Limit to 20 for MVP
      const business: Business = {
        id: `place-${place.place_id}`,
        placeId: place.place_id,
        name: place.name,
        address: place.formatted_address,
        category: place.types?.[0]?.replace(/_/g, ' ') || 'Business',
        rating: place.rating,
        reviewCount: place.user_ratings_total,
        latitude: place.geometry?.location?.lat,
        longitude: place.geometry?.location?.lng,
        hasWebsite: !!place.website,
        websiteStatus: place.website ? 'active' : 'no_website',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Get detailed info
      if (place.place_id) {
        try {
          const detailsUrl = new URL(
            'https://maps.googleapis.com/maps/api/place/details/json'
          );
          detailsUrl.searchParams.set('place_id', place.place_id);
          detailsUrl.searchParams.set(
            'fields',
            'website,formatted_phone_number,international_phone_number'
          );
          detailsUrl.searchParams.set('key', apiKey);

          const detailsResponse = await fetch(detailsUrl.toString());
          const detailsData = await detailsResponse.json();

          if (detailsData.result) {
            business.phone =
              detailsData.result.international_phone_number ||
              detailsData.result.formatted_phone_number;
            business.website = detailsData.result.website;
            business.hasWebsite = !!detailsData.result.website;
            business.websiteStatus = detailsData.result.website
              ? 'active'
              : 'no_website';
          }
        } catch (detailsError) {
          console.error('Error fetching place details:', detailsError);
        }
      }

      // Save to database
      try {
        await db.business.upsert({
          where: { placeId: business.placeId },
          create: {
            placeId: business.placeId,
            name: business.name,
            address: business.address,
            phone: business.phone,
            website: business.website,
            category: business.category,
            rating: business.rating,
            reviewCount: business.reviewCount,
            latitude: business.latitude,
            longitude: business.longitude,
            hasWebsite: business.hasWebsite,
            websiteStatus: business.websiteStatus,
          },
          update: {
            name: business.name,
            hasWebsite: business.hasWebsite,
            websiteStatus: business.websiteStatus,
          },
        });
      } catch (dbError) {
        console.error('Error saving to database:', dbError);
      }

      businesses.push(business);
    }

    return NextResponse.json({
      success: true,
      businesses,
      total: businesses.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
