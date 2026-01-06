import { z } from 'zod';
import { App } from '@microsoft/teams.apps';
import { DevtoolsPlugin } from '@microsoft/teams.dev';
import { McpPlugin } from '@microsoft/teams.mcp';
import { getMeetingTranscript, formatTranscript, type MeetingTranscript } from './helpers/graph-api.js';
import { generateSummary, extractActionItems, type SummaryLength } from './helpers/summarizer.js';
import { createConfluencePage, formatSummaryForConfluence } from './helpers/confluence.js';

// Initialize the MCP plugin
const mcpServerPlugin = new McpPlugin({
  name: 'teams-transcript-summarizer',
  description: 'Pulls Teams meeting transcripts, summarizes them, and exports to Confluence',
  // Optional: Enable inspector for development
  // inspector: 'http://localhost:5173?proxyPort=9000',
});

// Tool 1: Pull transcript from a meeting
mcpServerPlugin.tool(
  'pullTranscript',
  'Pulls the transcript from a Teams meeting by meeting ID. Requires OnlineMeetingTranscript.Read.All permission.',
  {
    meetingId: z.string().describe('The Teams meeting ID (can be found in the meeting URL or Graph API)'),
  },
  {
    readOnlyHint: true,
    idempotentHint: false,
  },
  async ({ meetingId }, { authInfo, graphClient }) => {
    try {
      if (!graphClient) {
        throw new Error('Graph client not available. Ensure your app is properly authenticated.');
      }

      const transcript = await getMeetingTranscript(meetingId, graphClient);
      const formatted = formatTranscript(transcript);

      return {
        content: [
          {
            type: 'text',
            text: `Transcript retrieved successfully for meeting ${meetingId}\n\n${formatted}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool 2: Summarize transcript
mcpServerPlugin.tool(
  'summarizeTranscript',
  'Summarizes a Teams meeting transcript using AI. Supports short, medium, or detailed summaries.',
  {
    transcript: z.string().describe('The transcript text to summarize'),
    summaryLength: z.enum(['short', 'medium', 'detailed']).optional().describe('Length of summary (default: medium)'),
  },
  {
    readOnlyHint: true,
    idempotentHint: true,
  },
  async ({ transcript, summaryLength = 'medium' }) => {
    try {
      const summary = await generateSummary(transcript, summaryLength as SummaryLength);
      
      return {
        content: [
          {
            type: 'text',
            text: `Summary (${summaryLength}):\n\n${summary}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool 3: Extract action items from transcript
mcpServerPlugin.tool(
  'extractActionItems',
  'Extracts action items from a Teams meeting transcript using AI.',
  {
    transcript: z.string().describe('The transcript text to extract action items from'),
  },
  {
    readOnlyHint: true,
    idempotentHint: true,
  },
  async ({ transcript }) => {
    try {
      const actionItems = await extractActionItems(transcript);
      
      return {
        content: [
          {
            type: 'text',
            text: `Action Items:\n\n${actionItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool 4: Export to Confluence
mcpServerPlugin.tool(
  'exportToConfluence',
  'Exports a summary to Confluence as a new page. Requires Confluence API credentials.',
  {
    title: z.string().describe('The title for the Confluence page'),
    content: z.string().describe('The content (summary) to export. Can be plain text or HTML.'),
    spaceKey: z.string().describe('The Confluence space key (e.g., "TEAM", "PROD")'),
    parentPageId: z.string().optional().describe('Optional parent page ID to create this as a child page'),
  },
  {
    readOnlyHint: false,
    idempotentHint: false,
  },
  async ({ title, content, spaceKey, parentPageId }) => {
    try {
      const page = await createConfluencePage({
        title,
        content,
        spaceKey,
        parentPageId,
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully created Confluence page!\n\nTitle: ${page.title}\nID: ${page.id}\nURL: ${page.url}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool 5: Combined workflow - pull, summarize, and export
mcpServerPlugin.tool(
  'processMeetingToConfluence',
  'Complete workflow: Pulls a meeting transcript, summarizes it, extracts action items, and exports to Confluence in one step.',
  {
    meetingId: z.string().describe('The Teams meeting ID'),
    confluenceTitle: z.string().describe('Title for the Confluence page'),
    spaceKey: z.string().describe('The Confluence space key'),
    summaryLength: z.enum(['short', 'medium', 'detailed']).optional().describe('Length of summary (default: medium)'),
    parentPageId: z.string().optional().describe('Optional parent page ID to create this as a child page'),
  },
  {
    readOnlyHint: false,
    idempotentHint: false,
  },
  async ({ meetingId, confluenceTitle, spaceKey, summaryLength, parentPageId }, { authInfo, graphClient }) => {
    try {
      if (!graphClient) {
        throw new Error('Graph client not available. Ensure your app is properly authenticated.');
      }

      // Step 1: Pull transcript
      const transcript = await getMeetingTranscript(meetingId, graphClient);
      const transcriptText = formatTranscript(transcript);
      
      // Step 2: Summarize
      const summary = await generateSummary(transcriptText, (summaryLength || 'medium') as SummaryLength);
      
      // Step 3: Extract action items
      const actionItems = await extractActionItems(transcriptText);
      
      // Step 4: Format for Confluence
      const confluenceContent = formatSummaryForConfluence(summary, transcript, actionItems);
      
      // Step 5: Export to Confluence
      const page = await createConfluencePage({
        title: confluenceTitle,
        content: confluenceContent,
        spaceKey,
        parentPageId,
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `Meeting processed successfully!\n\n` +
                  `Meeting ID: ${meetingId}\n` +
                  `Confluence Page: ${page.title}\n` +
                  `Page ID: ${page.id}\n` +
                  `URL: ${page.url}\n\n` +
                  `Summary Preview:\n${summary.substring(0, 300)}${summary.length > 300 ? '...' : ''}\n\n` +
                  `Action Items: ${actionItems.length > 0 && !actionItems[0].toLowerCase().includes('no action items') ? actionItems.length : 0}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Initialize the Teams App
const app = new App({
  plugins: [
    new DevtoolsPlugin(),
    mcpServerPlugin,
  ],
});

// Optional: Handle incoming messages to track conversations
// This can be useful for the "piping messages to user" feature mentioned in the docs
app.on('message', async ({ send, activity }) => {
  // You can add logic here to handle incoming messages
  // For example, storing conversation IDs for proactive messaging
  console.log('Received message:', activity.text);
});

export default app;

