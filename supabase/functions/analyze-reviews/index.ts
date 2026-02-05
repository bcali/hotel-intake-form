/**
 * Supabase Edge Function: Analyze Reviews with Claude
 *
 * This function securely calls the Claude API to analyze hotel reviews.
 * Deploy with: supabase functions deploy analyze-reviews
 *
 * Required secrets (set via Supabase dashboard):
 * - ANTHROPIC_API_KEY: Your Claude API key from console.anthropic.com
 */

import Anthropic from 'npm:@anthropic-ai/sdk@0.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReviewData {
  source: string;
  text: string;
  rating?: number;
  date?: string;
  language?: string;
}

interface AnalyzeRequest {
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

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const anthropic = new Anthropic({ apiKey });
    const { hotelName, reviews, hotelContext } = await req.json() as AnalyzeRequest;

    // Build the analysis prompt
    const reviewsText = reviews.map((r, i) =>
      `Review ${i + 1} (${r.source}${r.rating ? `, ${r.rating}/5` : ''}${r.date ? `, ${r.date}` : ''}):\n${r.text}`
    ).join('\n\n---\n\n');

    const contextInfo = hotelContext ? `
Hotel Context:
- Brand: ${hotelContext.brand || 'N/A'}
- Location: ${hotelContext.city || 'N/A'}, ${hotelContext.country || 'N/A'}
- Keywords/Focus Areas: ${hotelContext.keywords?.join(', ') || 'N/A'}
- Known Issues: ${hotelContext.knownIssues || 'None specified'}
- Recent Changes: ${hotelContext.recentChanges || 'None specified'}
` : '';

    const prompt = `You are an expert hotel industry analyst. Analyze the following guest reviews for "${hotelName}" and provide actionable insights.

${contextInfo}

REVIEWS TO ANALYZE:
${reviewsText}

Provide your analysis in the following JSON format (no markdown, just valid JSON):
{
  "overallSentiment": <number 0-100>,
  "reviewCount": ${reviews.length},
  "averageRating": <calculated average or estimate>,
  "positiveDrivers": [
    {
      "theme": "<specific theme name>",
      "score": <0-100>,
      "impact": "High" | "Medium" | "Low",
      "examples": ["<brief quote from review>", "<another quote>"]
    }
  ],
  "negativeDrivers": [
    {
      "theme": "<specific issue>",
      "score": <0-100 where lower is worse>,
      "impact": "High" | "Medium" | "Low",
      "examples": ["<brief quote from review>"]
    }
  ],
  "actionItems": [
    {
      "task": "<specific actionable task>",
      "owner": "<department: Front Office, Housekeeping, F&B, Engineering, Management>",
      "priority": "Critical" | "High" | "Medium" | "Low",
      "rationale": "<why this matters based on review data>"
    }
  ],
  "otaComparison": [
    {
      "source": "<platform name>",
      "rating": <average rating>,
      "sentiment": <0-100>,
      "reviewCount": <count>
    }
  ]
}

Focus on:
1. Identifying specific, actionable themes (not generic ones)
2. Prioritizing by impact on guest satisfaction and bookings
3. Assigning realistic owners based on hotel operations
4. Providing concrete examples from the reviews
5. Comparing performance across different OTA platforms if data allows`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    // Extract the text content
    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse the JSON response
    const analysisText = textContent.text.trim();
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch {
      // If Claude wrapped it in markdown code blocks, extract it
      const jsonMatch = analysisText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse Claude response as JSON');
      }
    }

    // Add raw analysis for debugging
    analysis.rawAnalysis = analysisText;

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
