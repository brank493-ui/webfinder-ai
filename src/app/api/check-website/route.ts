import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, url } = body;

    let targetUrl = url;
    let business: Awaited<ReturnType<typeof db.business.findUnique>> = null;

    // Get business from database if ID provided
    if (businessId) {
      business = await db.business.findUnique({
        where: { id: businessId },
      });

      if (!business) {
        return NextResponse.json(
          { success: false, error: 'Business not found' },
          { status: 404 }
        );
      }

      targetUrl = business.website;
    }

    if (!targetUrl) {
      // No website URL provided
      if (business) {
        await db.business.update({
          where: { id: business.id },
          data: {
            hasWebsite: false,
            websiteStatus: 'no_website',
          },
        });
      }

      return NextResponse.json({
        success: true,
        status: 'no_website',
        message: 'No website URL found',
      });
    }

    // Check if it's just a social media link
    const socialMediaPatterns = [
      'facebook.com',
      'instagram.com',
      'twitter.com',
      'linkedin.com',
      'youtube.com',
      'tiktok.com',
      'yelp.com',
      'tripadvisor.com',
      'foursquare.com',
    ];

    const isSocialMedia = socialMediaPatterns.some((pattern) =>
      targetUrl.toLowerCase().includes(pattern)
    );

    if (isSocialMedia) {
      if (business) {
        await db.business.update({
          where: { id: business.id },
          data: {
            hasWebsite: false,
            websiteStatus: 'social_media',
          },
        });
      }

      return NextResponse.json({
        success: true,
        status: 'social_media',
        message: 'Only social media presence found',
        url: targetUrl,
      });
    }

    // Try to fetch the website
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(targetUrl, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        // Website is active
        if (business) {
          await db.business.update({
            where: { id: business.id },
            data: {
              hasWebsite: true,
              websiteStatus: 'active',
            },
          });
        }

        return NextResponse.json({
          success: true,
          status: 'active',
          message: 'Website is active and accessible',
          url: targetUrl,
          statusCode: response.status,
        });
      } else {
        // Website returned error status
        if (business) {
          await db.business.update({
            where: { id: business.id },
            data: {
              hasWebsite: false,
              websiteStatus: 'broken',
            },
          });
        }

        return NextResponse.json({
          success: true,
          status: 'broken',
          message: `Website returned status ${response.status}`,
          url: targetUrl,
          statusCode: response.status,
        });
      }
    } catch (fetchError) {
      // Couldn't reach website
      if (business) {
        await db.business.update({
          where: { id: business.id },
          data: {
            hasWebsite: false,
            websiteStatus: 'broken',
          },
        });
      }

      return NextResponse.json({
        success: true,
        status: 'broken',
        message: 'Could not reach website',
        url: targetUrl,
        error: fetchError instanceof Error ? fetchError.message : 'Unknown error',
      });
    }
  } catch (error) {
    console.error('Website check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check website' },
      { status: 500 }
    );
  }
}
