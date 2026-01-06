import { GraphClient } from '@microsoft/teams.apps';

export interface TranscriptContent {
  id: string;
  content: string;
  createdDateTime: string;
  transcriptContentUrl?: string;
}

export interface MeetingTranscript {
  meetingId: string;
  transcripts: TranscriptContent[];
  meetingInfo?: {
    subject?: string;
    startDateTime?: string;
    endDateTime?: string;
    participants?: string[];
  };
}

/**
 * Fetches transcript from a Teams meeting using Microsoft Graph API
 */
export async function getMeetingTranscript(
  meetingId: string,
  graphClient: GraphClient
): Promise<MeetingTranscript> {
  try {
    // Get online meeting details
    const meetingResponse = await graphClient
      .api(`/me/onlineMeetings/${meetingId}`)
      .get();

    // Get transcripts for the meeting
    // Note: Transcripts may not be immediately available after a meeting
    const transcriptsResponse = await graphClient
      .api(`/me/onlineMeetings/${meetingId}/transcripts`)
      .get();

    const transcripts: TranscriptContent[] = transcriptsResponse.value || [];

    // For each transcript, fetch the actual content
    const transcriptContents = await Promise.all(
      transcripts.map(async (transcript: any) => {
        if (transcript.transcriptContentUrl) {
          try {
            const contentResponse = await fetch(transcript.transcriptContentUrl);
            const content = await contentResponse.text();
            return {
              id: transcript.id,
              content,
              createdDateTime: transcript.createdDateTime,
              transcriptContentUrl: transcript.transcriptContentUrl,
            };
          } catch (error) {
            console.error(`Failed to fetch transcript content for ${transcript.id}:`, error);
            return {
              id: transcript.id,
              content: 'Failed to fetch transcript content',
              createdDateTime: transcript.createdDateTime,
            };
          }
        }
        return {
          id: transcript.id,
          content: 'No content URL available',
          createdDateTime: transcript.createdDateTime,
        };
      })
    );

    return {
      meetingId,
      transcripts: transcriptContents,
      meetingInfo: {
        subject: meetingResponse.subject,
        startDateTime: meetingResponse.startDateTime,
        endDateTime: meetingResponse.endDateTime,
        participants: meetingResponse.participants?.map((p: any) => p.identity?.user?.displayName || 'Unknown'),
      },
    };
  } catch (error: any) {
    if (error.statusCode === 404) {
      throw new Error(`Meeting ${meetingId} not found or transcript not available`);
    }
    if (error.statusCode === 403) {
      throw new Error('Insufficient permissions to access transcripts. Required: OnlineMeetingTranscript.Read.All');
    }
    throw new Error(`Failed to fetch transcript: ${error.message}`);
  }
}

/**
 * Formats transcript content into a readable text format
 */
export function formatTranscript(transcript: MeetingTranscript): string {
  let formatted = '';
  
  if (transcript.meetingInfo?.subject) {
    formatted += `Meeting: ${transcript.meetingInfo.subject}\n`;
  }
  if (transcript.meetingInfo?.startDateTime) {
    formatted += `Date: ${new Date(transcript.meetingInfo.startDateTime).toLocaleString()}\n`;
  }
  if (transcript.meetingInfo?.participants && transcript.meetingInfo.participants.length > 0) {
    formatted += `Participants: ${transcript.meetingInfo.participants.join(', ')}\n`;
  }
  formatted += '\n--- Transcript ---\n\n';

  transcript.transcripts.forEach((t, index) => {
    formatted += `[Transcript ${index + 1} - ${new Date(t.createdDateTime).toLocaleString()}]\n`;
    formatted += `${t.content}\n\n`;
  });

  return formatted;
}

