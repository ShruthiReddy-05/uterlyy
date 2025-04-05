import { apiRequest } from './queryClient';

export interface PeriodAnalysisData {
  periodLogs: Array<{
    date: string;
    flow?: 'light' | 'medium' | 'heavy' | 'none';
    symptoms?: string[];
    mood?: string;
    notes?: string;
  }>;
  cycles: Array<{
    startDate: string;
    endDate?: string;
    periodLength?: number;
    cycleLength?: number;
  }>;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

/**
 * Get a response from the chatbot API based on the period data and user query
 */
export async function getChatResponse(
  periodData: PeriodAnalysisData, 
  userQuery: string,
  chatHistory: ChatMessage[]
): Promise<string> {
  try {
    // Only include a subset of chat history to avoid huge payloads
    const recentChatHistory = chatHistory
      .slice(-10) // Only include last 10 messages
      .filter(msg => msg.role === 'user' || msg.role === 'bot'); // Filter out system messages
    
    // Call the backend API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: userQuery,
        chatHistory: recentChatHistory
      }),
    });
    
    // Check for errors
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error getting response from AI assistant');
    }
    
    // Parse the response
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error in getChatResponse:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get response from AI assistant");
  }
}