/**
 * Claude API Service
 *
 * Calls Supabase Edge Function to analyze reviews using Claude API
 * (API key is stored securely in Supabase, not in browser)
 */

import { supabase } from '../config/supabase';

export interface ReviewData {
  source: string;
  text: string;
  rating?: number;
  date?: string;
  language?: string;
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
  rawAnalysis?: string;
}

export interface AnalyzeReviewsRequest {
  hotelName: string;
  reviews: ReviewData[];
  hotelContext?: {
    brand?: string;
    city?: string;
    country?: string;
    keywords?: string[];
    knownIssues?: string;
    recentChanges?: string;
  };
}

/**
 * Analyze reviews using Claude via Supabase Edge Function
 */
export async function analyzeReviews(request: AnalyzeReviewsRequest): Promise<AnalysisResult> {
  const { data, error } = await supabase.functions.invoke('analyze-reviews', {
    body: request,
  });

  if (error) {
    console.error('Analysis error:', error);
    throw new Error(`Failed to analyze reviews: ${error.message}`);
  }

  return data as AnalysisResult;
}

/**
 * Generate a summary report from analysis results
 */
export async function generateReport(
  analysis: AnalysisResult,
  hotelName: string
): Promise<string> {
  const { data, error } = await supabase.functions.invoke('generate-report', {
    body: { analysis, hotelName },
  });

  if (error) {
    console.error('Report generation error:', error);
    throw new Error(`Failed to generate report: ${error.message}`);
  }

  return data.report as string;
}
