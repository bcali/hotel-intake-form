/**
 * Supabase Edge Function: Scrape Reviews with Apify
 *
 * Scrapes hotel reviews from Google Maps, TripAdvisor, and OTAs using Apify actors.
 * Deploy with: supabase functions deploy scrape-reviews
 *
 * Required secrets:
 * - APIFY_API_TOKEN: Your Apify API token
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapeRequest {
  googleMapsUrl?: string;
  tripAdvisorUrl?: string;
  bookingUrl?: string;
  agodaUrl?: string;
  expediaUrl?: string;
  maxReviews?: number;
}

interface Review {
  source: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  title?: string;
  language?: string;
}

// Apify actor IDs for different platforms
const ACTORS = {
  googleMaps: 'compass/crawler-google-places',
  tripAdvisor: 'maxcopell/tripadvisor-reviews',
  booking: 'voyager/booking-reviews-scraper',
};

async function runApifyActor(
  actorId: string,
  input: Record<string, unknown>,
  apiToken: string
): Promise<unknown[]> {
  const runUrl = `https://api.apify.com/v2/acts/${actorId}/runs?token=${apiToken}`;

  // Start the actor run
  const runResponse = await fetch(runUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!runResponse.ok) {
    const error = await runResponse.text();
    throw new Error(`Failed to start Apify actor ${actorId}: ${error}`);
  }

  const runData = await runResponse.json();
  const runId = runData.data.id;

  // Wait for the run to complete (poll every 5 seconds, max 5 minutes)
  const maxWaitTime = 5 * 60 * 1000; // 5 minutes
  const pollInterval = 5000; // 5 seconds
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const statusUrl = `https://api.apify.com/v2/actor-runs/${runId}?token=${apiToken}`;
    const statusResponse = await fetch(statusUrl);
    const statusData = await statusResponse.json();

    if (statusData.data.status === 'SUCCEEDED') {
      // Fetch the dataset
      const datasetId = statusData.data.defaultDatasetId;
      const datasetUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiToken}`;
      const datasetResponse = await fetch(datasetUrl);
      return await datasetResponse.json();
    }

    if (statusData.data.status === 'FAILED' || statusData.data.status === 'ABORTED') {
      throw new Error(`Apify actor ${actorId} failed with status: ${statusData.data.status}`);
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error(`Apify actor ${actorId} timed out after 5 minutes`);
}

async function scrapeGoogleMaps(url: string, maxReviews: number, apiToken: string): Promise<Review[]> {
  if (!url) return [];

  try {
    const results = await runApifyActor(
      ACTORS.googleMaps,
      {
        startUrls: [{ url }],
        maxReviews,
        language: 'en',
        reviewsSort: 'newest',
      },
      apiToken
    );

    // Transform to common format
    return (results as any[]).flatMap(place =>
      (place.reviews || []).map((review: any) => ({
        source: 'Google Maps',
        author: review.name || 'Anonymous',
        rating: review.stars || 0,
        date: review.publishedAtDate || '',
        text: review.text || '',
        language: review.language || 'en',
      }))
    );
  } catch (error) {
    console.error('Google Maps scraping error:', error);
    return [];
  }
}

async function scrapeTripAdvisor(url: string, maxReviews: number, apiToken: string): Promise<Review[]> {
  if (!url) return [];

  try {
    const results = await runApifyActor(
      ACTORS.tripAdvisor,
      {
        startUrls: [{ url }],
        maxReviews,
        language: 'ALL',
      },
      apiToken
    );

    // Transform to common format
    return (results as any[]).map((review: any) => ({
      source: 'TripAdvisor',
      author: review.user?.username || 'Anonymous',
      rating: review.rating || 0,
      date: review.publishedDate || '',
      text: review.text || '',
      title: review.title || '',
      language: review.language || 'en',
    }));
  } catch (error) {
    console.error('TripAdvisor scraping error:', error);
    return [];
  }
}

async function scrapeBooking(url: string, maxReviews: number, apiToken: string): Promise<Review[]> {
  if (!url) return [];

  try {
    const results = await runApifyActor(
      ACTORS.booking,
      {
        startUrls: [{ url }],
        maxReviews,
      },
      apiToken
    );

    // Transform to common format
    return (results as any[]).map((review: any) => ({
      source: 'Booking.com',
      author: review.reviewer?.name || 'Anonymous',
      rating: review.rating || 0,
      date: review.date || '',
      text: `${review.positive || ''} ${review.negative || ''}`.trim(),
      title: review.title || '',
      language: review.language || 'en',
    }));
  } catch (error) {
    console.error('Booking.com scraping error:', error);
    return [];
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get('APIFY_API_TOKEN');
    if (!apiToken) {
      throw new Error('APIFY_API_TOKEN not configured');
    }

    const body: ScrapeRequest = await req.json();
    const maxReviews = body.maxReviews || 50;

    console.log('Scraping reviews for URLs:', {
      googleMaps: body.googleMapsUrl,
      tripAdvisor: body.tripAdvisorUrl,
      booking: body.bookingUrl,
    });

    // Scrape all sources in parallel
    const [googleReviews, tripAdvisorReviews, bookingReviews] = await Promise.all([
      scrapeGoogleMaps(body.googleMapsUrl || '', maxReviews, apiToken),
      scrapeTripAdvisor(body.tripAdvisorUrl || '', maxReviews, apiToken),
      scrapeBooking(body.bookingUrl || '', maxReviews, apiToken),
    ]);

    const allReviews = [...googleReviews, ...tripAdvisorReviews, ...bookingReviews];

    console.log(`Scraped ${allReviews.length} reviews total`);

    return new Response(
      JSON.stringify({
        success: true,
        totalReviews: allReviews.length,
        reviews: allReviews,
        breakdown: {
          googleMaps: googleReviews.length,
          tripAdvisor: tripAdvisorReviews.length,
          booking: bookingReviews.length,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Scraping error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
