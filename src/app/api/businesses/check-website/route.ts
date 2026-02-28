import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, url } = body;

    let targetUrl = url;
    let business = null;

    // If businessId is provided, get the business from database
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
      // No URL to check
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
        data: {
          hasWebsite: false,
          status: 'no_website',
          message: 'No website URL found',
        },
      });
    }

    // Check if it's just a Facebook page
    const isFacebookOnly = targetUrl.includes('facebook.com');

    // Try to verify the website is accessible
    let isAccessible = false;
    let status = 'unknown';

    try {
      const response = await fetch(targetUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      });
      isAccessible = response.ok;
      status = isAccessible ? 'has_website' : 'broken';
    } catch {
      status = 'broken';
    }

    // Override status for Facebook-only pages
    if (isFacebookOnly) {
      status = 'facebook_only';
    }

    // Update business in database if provided
    if (business) {
      await db.business.update({
        where: { id: business.id },
        data: {
          hasWebsite: status === 'has_website',
          websiteStatus: status,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        hasWebsite: status === 'has_website',
        status,
        url: targetUrl,
        isFacebookOnly,
        isAccessible,
      },
    });
  } catch (error) {
    console.error('Check Website Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check website' },
      { status: 500 }
    );
  }
}
