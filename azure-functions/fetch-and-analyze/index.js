/**
 * Azure Function: fetch-and-analyze
 *
 * Fetches hotel reviews from multiple sources via Apify and analyzes them with Microsoft Copilot
 *
 * Input (POST JSON):
 * {
 *   "hotelName": "Anantara Siam",
 *   "timePeriod": { "startDate": "2026-01-01", "endDate": "2026-01-20" },
 *   "reviewSources": {
 *     "googleMaps": "https://...",
 *     "tripAdvisor": "https://...",
 *     "otaUrls": { "booking": "https://..." }
 *   }
 * }
 *
 * Output:
 * {
 *   "success": true,
 *   "analysis": { ... dashboard data ... },
 *   "rawReviews": { googleMaps: [...], tripAdvisor: [...], booking: [...] }
 * }
 */

const { ApifyClient } = require('apify-client');
const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Environment variables
const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY;
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;
const TENANT_ID = process.env.TENANT_ID;
const CLIENT_ID = process.env.CLIENT_ID;

// Apify actor IDs
const ACTORS = {
  googleMaps: 'compass/google-maps-scraper',
  tripAdvisor: 'maxcopell/tripadvisor',
  booking: 'voyager/booking-scraper'
};

const MAX_REVIEWS_PER_SOURCE = 50;

/**
 * Main function handler
 */
module.exports = async function (context, req) {
  // CORS headers for OPTIONS preflight
  if (req.method === 'OPTIONS') {
    context.res = {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: ''
    };
    return;
  }

  try {
    // 1. Validate authentication token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      context.res = {
        status: 401,
        body: { error: 'Missing or invalid authorization header' }
      };
      return;
    }

    const token = authHeader.substring(7);
    const user = await validateToken(token, context);

    if (!user) {
      context.res = {
        status: 401,
        body: { error: 'Invalid token' }
      };
      return;
    }

    context.log(`Authenticated user: ${user.email || user.preferred_username}`);

    // 2. Validate input
    const { hotelName, timePeriod, reviewSources } = req.body;

    if (!hotelName || !reviewSources) {
      context.res = {
        status: 400,
        body: { error: 'Missing required fields: hotelName, reviewSources' }
      };
      return;
    }

    // 3. Fetch reviews from Apify
    context.log('Fetching reviews from Apify...');
    const apifyClient = new ApifyClient({ token: APIFY_API_TOKEN });

    const reviews = {
      googleMaps: [],
      tripAdvisor: [],
      booking: []
    };

    // Fetch Google Maps reviews
    if (reviewSources.googleMaps) {
      context.log('Fetching Google Maps reviews...');
      reviews.googleMaps = await fetchGoogleMapsReviews(
        apifyClient,
        reviewSources.googleMaps,
        context
      );
      context.log(`Fetched ${reviews.googleMaps.length} Google Maps reviews`);
    }

    // Fetch TripAdvisor reviews
    if (reviewSources.tripAdvisor) {
      context.log('Fetching TripAdvisor reviews...');
      reviews.tripAdvisor = await fetchTripAdvisorReviews(
        apifyClient,
        reviewSources.tripAdvisor,
        context
      );
      context.log(`Fetched ${reviews.tripAdvisor.length} TripAdvisor reviews`);
    }

    // Fetch Booking.com reviews
    if (reviewSources.otaUrls?.booking) {
      context.log('Fetching Booking.com reviews...');
      reviews.booking = await fetchBookingReviews(
        apifyClient,
        reviewSources.otaUrls.booking,
        context
      );
      context.log(`Fetched ${reviews.booking.length} Booking.com reviews`);
    }

    // 4. Analyze with Microsoft Copilot
    context.log('Analyzing reviews with Copilot...');
    const analysis = await analyzeReviews(hotelName, reviews, context);

    // 5. Return results
    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: {
        success: true,
        hotelName,
        totalReviews: reviews.googleMaps.length + reviews.tripAdvisor.length + reviews.booking.length,
        analysis,
        rawReviews: reviews,
        processedAt: new Date().toISOString(),
        processedBy: user.email || user.preferred_username
      }
    };

  } catch (error) {
    context.log.error('Error in fetch-and-analyze:', error);

    context.res = {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    };
  }
};

/**
 * Validate Azure AD token
 */
async function validateToken(token, context) {
  try {
    const client = jwksClient({
      jwksUri: `https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`
    });

    const decodedToken = jwt.decode(token, { complete: true });
    const kid = decodedToken.header.kid;

    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();

    const verified = jwt.verify(token, signingKey, {
      audience: CLIENT_ID,
      issuer: `https://login.microsoftonline.com/${TENANT_ID}/v2.0`
    });

    return verified;
  } catch (error) {
    context.log.error('Token validation error:', error);
    return null;
  }
}

/**
 * Fetch Google Maps reviews
 */
async function fetchGoogleMapsReviews(client, url, context) {
  try {
    const run = await client.actor(ACTORS.googleMaps).call({
      startUrls: [{ url }],
      maxReviews: MAX_REVIEWS_PER_SOURCE,
      reviewsSort: 'newest',
      language: 'en'
    });

    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    return items.flatMap(item =>
      (item.reviews || []).map(review => ({
        author: review.name,
        rating: review.stars,
        date: review.publishedAtDate,
        text: review.text,
        source: 'Google Maps'
      }))
    );
  } catch (error) {
    context.log.error('Google Maps fetch error:', error);
    return [];
  }
}

/**
 * Fetch TripAdvisor reviews
 */
async function fetchTripAdvisorReviews(client, url, context) {
  try {
    const run = await client.actor(ACTORS.tripAdvisor).call({
      startUrls: [{ url }],
      maxItems: MAX_REVIEWS_PER_SOURCE,
      language: 'en'
    });

    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    return items.map(review => ({
      author: review.username || 'Anonymous',
      rating: review.rating,
      date: review.publishedDate,
      title: review.title,
      text: review.text,
      subratings: review.subratings || {},
      source: 'TripAdvisor'
    }));
  } catch (error) {
    context.log.error('TripAdvisor fetch error:', error);
    return [];
  }
}

/**
 * Fetch Booking.com reviews
 */
async function fetchBookingReviews(client, url, context) {
  try {
    const run = await client.actor(ACTORS.booking).call({
      startUrls: [{ url }],
      maxReviews: MAX_REVIEWS_PER_SOURCE,
      language: 'en'
    });

    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    return items.flatMap(item =>
      (item.reviews || []).map(review => ({
        author: review.author || 'Anonymous',
        rating: review.score,
        date: review.date,
        positiveText: review.positiveText,
        negativeText: review.negativeText,
        scores: review.scores || {},
        source: 'Booking.com'
      }))
    );
  } catch (error) {
    context.log.error('Booking.com fetch error:', error);
    return [];
  }
}

/**
 * Analyze reviews with Microsoft Copilot (Azure OpenAI)
 */
async function analyzeReviews(hotelName, reviews, context) {
  try {
    const client = new OpenAIClient(
      AZURE_OPENAI_ENDPOINT,
      new AzureKeyCredential(AZURE_OPENAI_KEY)
    );

    // Build review text for analysis
    const reviewText = buildReviewText(reviews);

    // Analysis prompt (simplified for POC - full prompt from ANALYSIS-PROMPT.md)
    const systemPrompt = `You are a hotel operations analyst. Analyze guest reviews and provide structured insights.

Return ONLY valid JSON with this exact structure:
{
  "sentiment": {"overall": number 0-100, "trend": "improving|stable|declining"},
  "topPositiveThemes": [{"theme": string, "mentions": number, "impact": "high|medium|low"}],
  "topNegativeThemes": [{"theme": string, "mentions": number, "impact": "high|medium|low"}],
  "actionItems": [{"priority": "P0|P1|P2", "department": string, "action": string, "impact": string}],
  "executiveSummary": string
}`;

    const userPrompt = `Hotel: ${hotelName}

Reviews to analyze:
${reviewText}

Provide structured analysis as JSON.`;

    const response = await client.getChatCompletions(
      AZURE_OPENAI_DEPLOYMENT,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      {
        temperature: 0.3,
        maxTokens: 2000
      }
    );

    const analysisText = response.choices[0].message.content;

    // Parse JSON response
    const analysis = JSON.parse(analysisText);

    return analysis;

  } catch (error) {
    context.log.error('Copilot analysis error:', error);

    // Return minimal fallback analysis
    return {
      sentiment: { overall: 50, trend: 'stable' },
      topPositiveThemes: [],
      topNegativeThemes: [],
      actionItems: [],
      executiveSummary: `Analysis failed: ${error.message}. Please review manually.`
    };
  }
}

/**
 * Build consolidated review text for analysis
 */
function buildReviewText(reviews) {
  const lines = [];

  // Google Maps
  if (reviews.googleMaps.length > 0) {
    lines.push(`GOOGLE MAPS REVIEWS (${reviews.googleMaps.length}):`);
    reviews.googleMaps.forEach((r, i) => {
      lines.push(`${i+1}. Rating: ${r.rating}/5, Date: ${r.date}`);
      lines.push(`   ${r.text}`);
    });
    lines.push('');
  }

  // TripAdvisor
  if (reviews.tripAdvisor.length > 0) {
    lines.push(`TRIPADVISOR REVIEWS (${reviews.tripAdvisor.length}):`);
    reviews.tripAdvisor.forEach((r, i) => {
      lines.push(`${i+1}. Rating: ${r.rating}/5, Date: ${r.date}`);
      if (r.title) lines.push(`   Title: ${r.title}`);
      lines.push(`   ${r.text}`);
    });
    lines.push('');
  }

  // Booking
  if (reviews.booking.length > 0) {
    lines.push(`BOOKING.COM REVIEWS (${reviews.booking.length}):`);
    reviews.booking.forEach((r, i) => {
      lines.push(`${i+1}. Score: ${r.rating}/10, Date: ${r.date}`);
      if (r.positiveText) lines.push(`   Positive: ${r.positiveText}`);
      if (r.negativeText) lines.push(`   Negative: ${r.negativeText}`);
    });
    lines.push('');
  }

  return lines.join('\n');
}
