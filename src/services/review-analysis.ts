/**
 * Review Analysis Service
 *
 * Orchestrates the full flow:
 * 1. Scrape reviews from URLs via Apify
 * 2. Analyze reviews via Claude
 * 3. Return structured insights
 *
 * API keys are stored securely in Supabase Edge Function secrets
 */

import { supabase } from '../config/supabase';
import type { FormData } from '../App';

export interface ReviewData {
  source: string;
  author: string;
  text: string;
  rating?: number;
  date?: string;
  title?: string;
  language?: string;
}

export interface ScrapeResult {
  success: boolean;
  totalReviews: number;
  reviews: ReviewData[];
  breakdown: {
    googleMaps: number;
    tripAdvisor: number;
    booking: number;
  };
  error?: string;
}

export interface AnalysisResult {
  overallSentiment: number;
  reviewCount: number;
  averageRating: number;
  positiveDrivers: {
    theme: string;
    score: number;
    impact: 'High' | 'Medium' | 'Low';
    examples: string[];
  }[];
  negativeDrivers: {
    theme: string;
    score: number;
    impact: 'High' | 'Medium' | 'Low';
    examples: string[];
  }[];
  actionItems: {
    task: string;
    owner: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    rationale: string;
  }[];
  otaComparison?: {
    source: string;
    rating: number;
    sentiment: number;
    reviewCount: number;
  }[];
}

export interface FullAnalysisResult {
  success: boolean;
  scrapeResult: ScrapeResult;
  analysis: AnalysisResult;
  error?: string;
}

export type ProgressCallback = (step: string, message: string) => void;

/**
 * Scrape reviews from provided URLs
 */
export async function scrapeReviews(
  formData: FormData,
  onProgress?: ProgressCallback
): Promise<ScrapeResult> {
  onProgress?.('scraping', 'Starting review collection...');

  const { data, error } = await supabase.functions.invoke('scrape-reviews', {
    body: {
      googleMapsUrl: formData.googleMapsUrl || undefined,
      tripAdvisorUrl: formData.tripAdvisorUrl || undefined,
      bookingUrl: formData.otaUrls?.booking || undefined,
      agodaUrl: formData.otaUrls?.agoda || undefined,
      expediaUrl: formData.otaUrls?.expedia || undefined,
      maxReviews: 50, // Limit for POC
    },
  });

  if (error) {
    console.error('Scraping error:', error);
    throw new Error(`Failed to scrape reviews: ${error.message}`);
  }

  onProgress?.('scraping', `Collected ${data.totalReviews} reviews`);
  return data as ScrapeResult;
}

/**
 * Analyze scraped reviews with Claude
 */
export async function analyzeReviews(
  reviews: ReviewData[],
  formData: FormData,
  onProgress?: ProgressCallback
): Promise<AnalysisResult> {
  onProgress?.('analyzing', 'Analyzing reviews with AI...');

  const { data, error } = await supabase.functions.invoke('analyze-reviews', {
    body: {
      hotelName: formData.hotelName,
      reviews: reviews.map(r => ({
        source: r.source,
        text: r.text,
        rating: r.rating,
        date: r.date,
        language: r.language,
      })),
      hotelContext: {
        brand: formData.brand,
        city: formData.city,
        country: formData.country,
        keywords: formData.keywords,
        knownIssues: formData.notes?.topGuestIssues,
        recentChanges: formData.notes?.recentChangesNotes,
      },
    },
  });

  if (error) {
    console.error('Analysis error:', error);
    throw new Error(`Failed to analyze reviews: ${error.message}`);
  }

  onProgress?.('analyzing', 'Analysis complete!');
  return data as AnalysisResult;
}

/**
 * Full analysis pipeline: scrape → analyze → return results
 */
export async function runFullAnalysis(
  formData: FormData,
  onProgress?: ProgressCallback
): Promise<FullAnalysisResult> {
  try {
    // Step 1: Scrape reviews
    onProgress?.('scraping', 'Collecting reviews from platforms...');
    const scrapeResult = await scrapeReviews(formData, onProgress);

    if (!scrapeResult.success || scrapeResult.totalReviews === 0) {
      return {
        success: false,
        scrapeResult,
        analysis: {} as AnalysisResult,
        error: 'No reviews found to analyze',
      };
    }

    // Step 2: Analyze with Claude
    onProgress?.('analyzing', `Analyzing ${scrapeResult.totalReviews} reviews...`);
    const analysis = await analyzeReviews(scrapeResult.reviews, formData, onProgress);

    onProgress?.('complete', 'Analysis complete!');

    return {
      success: true,
      scrapeResult,
      analysis,
    };
  } catch (error) {
    console.error('Full analysis error:', error);
    return {
      success: false,
      scrapeResult: { success: false, totalReviews: 0, reviews: [], breakdown: { googleMaps: 0, tripAdvisor: 0, booking: 0 } },
      analysis: {} as AnalysisResult,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
