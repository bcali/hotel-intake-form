import * as dotenv from 'dotenv';

dotenv.config();

export interface ConfluencePageParams {
  title: string;
  content: string;
  spaceKey: string;
  parentPageId?: string;
}

export interface ConfluencePage {
  id: string;
  title: string;
  url: string;
}

/**
 * Creates a new page in Confluence
 */
export async function createConfluencePage(
  params: ConfluencePageParams
): Promise<ConfluencePage> {
  const baseUrl = process.env.CONFLUENCE_BASE_URL;
  const username = process.env.CONFLUENCE_USERNAME;
  const apiToken = process.env.CONFLUENCE_API_TOKEN;

  if (!baseUrl || !username || !apiToken) {
    throw new Error(
      'Confluence configuration missing. Please set CONFLUENCE_BASE_URL, CONFLUENCE_USERNAME, and CONFLUENCE_API_TOKEN in your .env file'
    );
  }

  // Create basic auth header
  const auth = Buffer.from(`${username}:${apiToken}`).toString('base64');

  // Prepare the page content in Confluence Storage Format
  const body = {
    type: 'page',
    title: params.title,
    space: {
      key: params.spaceKey,
    },
    body: {
      storage: {
        value: params.content,
        representation: 'storage',
      },
    },
  };

  // If parent page is specified, add it
  if (params.parentPageId) {
    (body as any).ancestors = [{ id: params.parentPageId }];
  }

  try {
    const response = await fetch(`${baseUrl}/wiki/rest/api/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Confluence API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const page = await response.json();

    return {
      id: page.id,
      title: page.title,
      url: `${baseUrl}${page._links.webui}`,
    };
  } catch (error: any) {
    throw new Error(`Failed to create Confluence page: ${error.message}`);
  }
}

/**
 * Formats summary and transcript info for Confluence Storage Format
 */
export function formatSummaryForConfluence(
  summary: string,
  transcript: any,
  actionItems?: string[]
): string {
  let content = `<h1>Meeting Summary</h1>\n<p>${escapeHtml(summary)}</p>\n`;

  if (transcript.meetingInfo) {
    content += `<h2>Meeting Details</h2>\n<ul>`;
    if (transcript.meetingInfo.subject) {
      content += `<li><strong>Subject:</strong> ${escapeHtml(transcript.meetingInfo.subject)}</li>`;
    }
    if (transcript.meetingInfo.startDateTime) {
      content += `<li><strong>Date:</strong> ${escapeHtml(new Date(transcript.meetingInfo.startDateTime).toLocaleString())}</li>`;
    }
    if (transcript.meetingInfo.participants && transcript.meetingInfo.participants.length > 0) {
      content += `<li><strong>Participants:</strong> ${escapeHtml(transcript.meetingInfo.participants.join(', '))}</li>`;
    }
    content += `</ul>\n`;
  }

  if (actionItems && actionItems.length > 0 && !actionItems[0].toLowerCase().includes('no action items')) {
    content += `<h2>Action Items</h2>\n<ul>`;
    actionItems.forEach(item => {
      content += `<li>${escapeHtml(item)}</li>`;
    });
    content += `</ul>\n`;
  }

  content += `<h2>Meeting ID</h2>\n<p><code>${escapeHtml(transcript.meetingId)}</code></p>`;

  return content;
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

