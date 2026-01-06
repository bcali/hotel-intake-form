import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import * as dotenv from 'dotenv';

dotenv.config();

let openAIClient: OpenAIClient | null = null;

function getOpenAIClient(): OpenAIClient {
  if (!openAIClient) {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;

    if (!endpoint || !apiKey) {
      throw new Error(
        'Azure OpenAI configuration missing. Please set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY in your .env file'
      );
    }

    openAIClient = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
  }
  return openAIClient;
}

export type SummaryLength = 'short' | 'medium' | 'detailed';

const SUMMARY_PROMPTS: Record<SummaryLength, string> = {
  short: 'Provide a brief summary (2-3 sentences) of the key points from this meeting transcript.',
  medium: 'Provide a concise summary (1-2 paragraphs) covering the main topics, decisions, and action items from this meeting transcript.',
  detailed: 'Provide a comprehensive summary covering all major topics discussed, decisions made, action items with owners, and key takeaways from this meeting transcript.',
};

/**
 * Generates a summary of a transcript using Azure OpenAI
 */
export async function generateSummary(
  transcript: string,
  length: SummaryLength = 'medium'
): Promise<string> {
  const client = getOpenAIClient();
  const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';

  const prompt = `${SUMMARY_PROMPTS[length]}\n\nTranscript:\n${transcript}`;

  try {
    const response = await client.getChatCompletions(deploymentName, [
      {
        role: 'system',
        content: 'You are a helpful assistant that summarizes meeting transcripts clearly and concisely.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    const summary = response.choices[0]?.message?.content;
    if (!summary) {
      throw new Error('No summary generated from OpenAI');
    }

    return summary;
  } catch (error: any) {
    if (error.code === 'DeploymentNotFound') {
      throw new Error(
        `Deployment "${deploymentName}" not found. Please check AZURE_OPENAI_DEPLOYMENT_NAME in your .env file.`
      );
    }
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
}

/**
 * Extracts action items from a transcript
 */
export async function extractActionItems(transcript: string): Promise<string[]> {
  const client = getOpenAIClient();
  const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';

  const prompt = `Extract all action items from this meeting transcript. Format each action item as a single line with the person responsible (if mentioned) and the task. If no action items are found, return "No action items identified."\n\nTranscript:\n${transcript}`;

  try {
    const response = await client.getChatCompletions(deploymentName, [
      {
        role: 'system',
        content: 'You are a helpful assistant that extracts action items from meeting transcripts.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    const actionItemsText = response.choices[0]?.message?.content || 'No action items identified.';
    
    // Parse action items (assuming they're on separate lines or bullet points)
    const actionItems = actionItemsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.toLowerCase().includes('no action items'));

    return actionItems.length > 0 ? actionItems : ['No action items identified.'];
  } catch (error: any) {
    console.error('Failed to extract action items:', error);
    return ['Failed to extract action items.'];
  }
}

