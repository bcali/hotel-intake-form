/**
 * API Service Layer for Azure Functions
 *
 * Handles all API calls to Azure Functions backend
 */

import { apiConfig } from '../config/msal-config';

export interface FetchAndAnalyzeRequest {
  hotelName: string;
  timePeriod: {
    startDate: string;
    endDate: string;
  };
  reviewSources: {
    googleMaps?: string;
    tripAdvisor?: string;
    selectedOTAs: string[];
    otaUrls: {
      booking?: string;
      agoda?: string;
      expedia?: string;
    };
  };
}

export interface SentimentData {
  overall: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface ThemeData {
  theme: string;
  mentions: number;
  impact: 'high' | 'medium' | 'low';
}

export interface ActionItem {
  priority: 'P0' | 'P1' | 'P2';
  department: string;
  action: string;
  impact: string;
}

export interface AnalysisData {
  sentiment: SentimentData;
  topPositiveThemes: ThemeData[];
  topNegativeThemes: ThemeData[];
  actionItems: ActionItem[];
  executiveSummary: string;
}

export interface ReviewData {
  author: string;
  rating: number;
  date: string;
  text?: string;
  title?: string;
  positiveText?: string;
  negativeText?: string;
  source: string;
}

export interface FetchAndAnalyzeResponse {
  success: boolean;
  hotelName: string;
  totalReviews: number;
  analysis: AnalysisData;
  rawReviews: {
    googleMaps: ReviewData[];
    tripAdvisor: ReviewData[];
    booking: ReviewData[];
  };
  processedAt: string;
  processedBy: string;
  error?: string;
}

/**
 * Call Azure Function to fetch reviews and analyze
 */
export const fetchAndAnalyze = async (
  request: FetchAndAnalyzeRequest,
  accessToken: string,
  onProgress?: (message: string) => void
): Promise<FetchAndAnalyzeResponse> => {
  const url = `${apiConfig.functionUrl}${apiConfig.endpoints.fetchAndAnalyze}`;

  onProgress?.('Connecting to analysis service...');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `API request failed with status ${response.status}`
      );
    }

    const data: FetchAndAnalyzeResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Analysis failed');
    }

    onProgress?.('Analysis complete!');

    return data;

  } catch (error) {
    console.error('API Error:', error);

    if (error instanceof Error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }

    throw new Error('Analysis failed due to an unknown error');
  }
};

/**
 * Health check endpoint (optional - for testing)
 */
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${apiConfig.functionUrl}/api/health`, {
      method: 'GET'
    });
    return response.ok;
  } catch {
    return false;
  }
};
