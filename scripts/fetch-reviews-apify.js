#!/usr/bin/env node

/**
 * Apify Review Fetcher
 *
 * Fetches reviews from Google Maps, TripAdvisor, and Booking.com using Apify actors
 * Takes a JSON submission file as input and outputs review data ready for AI analysis
 *
 * Prerequisites:
 * - Node.js 18+
 * - Apify account with API token
 * - npm install apify-client
 *
 * Usage:
 *   node fetch-reviews-apify.js <path-to-submission.json>
 *
 * Example:
 *   node fetch-reviews-apify.js ../downloads/anantara-siam_1768896171188.json
 */

const fs = require('fs');
const path = require('path');
const { ApifyClient } = require('apify-client');

// Configuration
const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN; // Set this in your environment
const MAX_REVIEWS_PER_SOURCE = 50; // Limit to keep costs down

// Apify Actor IDs
const ACTORS = {
  googleMaps: 'compass/google-maps-scraper',
  tripAdvisor: 'maxcopell/tripadvisor',
  booking: 'voyager/booking-scraper'
};

/**
 * Main function
 */
async function main() {
  // Check for API token
  if (!APIFY_API_TOKEN) {
    console.error('❌ Error: APIFY_API_TOKEN environment variable not set');
    console.error('Set it with: export APIFY_API_TOKEN=your_token_here');
    process.exit(1);
  }

  // Check for input file
  const submissionPath = process.argv[2];
  if (!submissionPath) {
    console.error('❌ Error: No submission file provided');
    console.error('Usage: node fetch-reviews-apify.js <path-to-submission.json>');
    process.exit(1);
  }

  // Read submission JSON
  let submission;
  try {
    const rawData = fs.readFileSync(submissionPath, 'utf8');
    submission = JSON.parse(rawData);
    console.log(`✅ Loaded submission: ${submission.property.hotelName}`);
  } catch (error) {
    console.error(`❌ Error reading submission file: ${error.message}`);
    process.exit(1);
  }

  // Initialize Apify client
  const client = new ApifyClient({ token: APIFY_API_TOKEN });

  // Fetch reviews from all sources
  const results = {
    submissionId: submission.id,
    hotelName: submission.property.hotelName,
    fetchedAt: new Date().toISOString(),
    reviews: {}
  };

  try {
    // Fetch Google Maps reviews
    if (submission.reviewSources.googleMaps) {
      console.log('\n📍 Fetching Google Maps reviews...');
      results.reviews.googleMaps = await fetchGoogleMapsReviews(
        client,
        submission.reviewSources.googleMaps,
        submission.timePeriod
      );
      console.log(`   ✅ Fetched ${results.reviews.googleMaps.length} reviews`);
    }

    // Fetch TripAdvisor reviews
    if (submission.reviewSources.tripAdvisor) {
      console.log('\n🏖️  Fetching TripAdvisor reviews...');
      results.reviews.tripAdvisor = await fetchTripAdvisorReviews(
        client,
        submission.reviewSources.tripAdvisor,
        submission.timePeriod
      );
      console.log(`   ✅ Fetched ${results.reviews.tripAdvisor.length} reviews`);
    }

    // Fetch Booking.com reviews
    if (submission.reviewSources.selectedOTAs.includes('booking')) {
      console.log('\n🏨 Fetching Booking.com reviews...');
      results.reviews.booking = await fetchBookingReviews(
        client,
        submission.reviewSources.otaUrls.booking,
        submission.timePeriod
      );
      console.log(`   ✅ Fetched ${results.reviews.booking.length} reviews`);
    }

    // Save results
    const outputPath = submissionPath.replace('.json', '_reviews.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n✅ Review data saved to: ${outputPath}`);
    console.log(`\n📊 Total reviews fetched: ${getTotalReviews(results)}`);

    // Generate analysis-ready text file
    const textOutputPath = submissionPath.replace('.json', '_reviews.txt');
    generateAnalysisInput(submission, results, textOutputPath);
    console.log(`✅ Analysis input saved to: ${textOutputPath}`);

    console.log('\n🎉 Done! You can now use the _reviews.txt file with the analysis prompt.');

  } catch (error) {
    console.error(`\n❌ Error fetching reviews: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Fetch Google Maps reviews
 */
async function fetchGoogleMapsReviews(client, url, timePeriod) {
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
}

/**
 * Fetch TripAdvisor reviews
 */
async function fetchTripAdvisorReviews(client, url, timePeriod) {
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
}

/**
 * Fetch Booking.com reviews
 */
async function fetchBookingReviews(client, url, timePeriod) {
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
}

/**
 * Get total review count
 */
function getTotalReviews(results) {
  return Object.values(results.reviews).reduce(
    (sum, reviews) => sum + reviews.length,
    0
  );
}

/**
 * Generate analysis-ready text file
 */
function generateAnalysisInput(submission, reviewData, outputPath) {
  const lines = [];

  // Header
  lines.push('='.repeat(80));
  lines.push('HOTEL SUBMISSION + REVIEW DATA FOR AI ANALYSIS');
  lines.push('='.repeat(80));
  lines.push('');

  // Submission metadata
  lines.push('SUBMISSION DATA:');
  lines.push(JSON.stringify(submission, null, 2));
  lines.push('');
  lines.push('-'.repeat(80));
  lines.push('');

  // Google Maps reviews
  if (reviewData.reviews.googleMaps) {
    lines.push(`GOOGLE MAPS REVIEWS (${reviewData.reviews.googleMaps.length} reviews):`);
    lines.push('');
    reviewData.reviews.googleMaps.forEach((review, idx) => {
      lines.push(`Review ${idx + 1}:`);
      lines.push(`Rating: ${review.rating}/5`);
      lines.push(`Date: ${review.date}`);
      lines.push(`Author: ${review.author}`);
      lines.push(`Text: ${review.text}`);
      lines.push('');
    });
    lines.push('-'.repeat(80));
    lines.push('');
  }

  // TripAdvisor reviews
  if (reviewData.reviews.tripAdvisor) {
    lines.push(`TRIPADVISOR REVIEWS (${reviewData.reviews.tripAdvisor.length} reviews):`);
    lines.push('');
    reviewData.reviews.tripAdvisor.forEach((review, idx) => {
      lines.push(`Review ${idx + 1}:`);
      lines.push(`Rating: ${review.rating}/5`);
      lines.push(`Date: ${review.date}`);
      lines.push(`Author: ${review.author}`);
      if (review.title) lines.push(`Title: ${review.title}`);
      if (review.subratings && Object.keys(review.subratings).length > 0) {
        lines.push(`Subratings: ${JSON.stringify(review.subratings)}`);
      }
      lines.push(`Text: ${review.text}`);
      lines.push('');
    });
    lines.push('-'.repeat(80));
    lines.push('');
  }

  // Booking.com reviews
  if (reviewData.reviews.booking) {
    lines.push(`BOOKING.COM REVIEWS (${reviewData.reviews.booking.length} reviews):`);
    lines.push('');
    reviewData.reviews.booking.forEach((review, idx) => {
      lines.push(`Review ${idx + 1}:`);
      lines.push(`Score: ${review.rating}/10`);
      lines.push(`Date: ${review.date}`);
      lines.push(`Author: ${review.author}`);
      if (review.scores && Object.keys(review.scores).length > 0) {
        lines.push(`Category Scores: ${JSON.stringify(review.scores)}`);
      }
      if (review.positiveText) {
        lines.push(`Positive: ${review.positiveText}`);
      }
      if (review.negativeText) {
        lines.push(`Negative: ${review.negativeText}`);
      }
      lines.push('');
    });
    lines.push('-'.repeat(80));
    lines.push('');
  }

  // Footer
  lines.push('');
  lines.push('='.repeat(80));
  lines.push(`Total reviews: ${getTotalReviews(reviewData)}`);
  lines.push(`Fetched at: ${reviewData.fetchedAt}`);
  lines.push('='.repeat(80));

  fs.writeFileSync(outputPath, lines.join('\n'));
}

// Run main function
main().catch(console.error);
