import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// The model to use (Gemini 1.5 Pro model)
// Note: The error was using 'gemini-pro' which might be deprecated in the v1beta API version
// Using 'gemini-1.5-pro' which is the current model name
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

/**
 * Generate a response from Gemini based on the period data and user query
 */
export async function generateChatResponse(
  periodData: any,
  userQuery: string,
  chatHistory: Array<{ role: string; content: string }> 
): Promise<string> {
  try {
    // Construct the context from period data
    const context = constructContextFromData(periodData);
    
    // Construct chat history for context
    const historyText = chatHistory
      .slice(-10) // Only send the last 10 messages for context
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');
    
    // Build the prompt
    const prompt = `
You are a supportive and knowledgeable menstrual health assistant for an app called Uterly. 
You help users understand their period patterns, symptoms, and cycle health.

USER'S PERIOD DATA CONTEXT:
${context}

RECENT CONVERSATION:
${historyText}

USER QUERY: ${userQuery}

Please analyze the provided period data and respond to the user's query. 
If appropriate, mention patterns you notice in their flow, symptoms, or mood.
Give personalized, supportive advice based on their unique cycle data.
Keep responses concise (maximum 4 paragraphs) and conversational.
Do not fabricate data or make claims not supported by the information provided.
If you cannot answer based on the available data, honestly tell the user.
`;

    // Get the response from Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting response from Gemini:", error);
    return "I'm sorry, I couldn't process your request at the moment. Please try again later.";
  }
}

/**
 * Constructs a descriptive context string from the period data
 */
function constructContextFromData(data: any): string {
  if (!data.periodLogs || data.periodLogs.length === 0) {
    return "No period data available yet.";
  }

  // Sort period logs by date
  const sortedLogs = [...data.periodLogs].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get cycle statistics
  const cycleStats = data.cycles && data.cycles.length > 0 
    ? `
- Average cycle length: ${calculateAverageCycleLength(data.cycles)} days
- Average period length: ${calculateAveragePeriodLength(data.cycles)} days
- Number of recorded cycles: ${data.cycles.length}
- Most recent cycle started: ${data.cycles[data.cycles.length - 1]?.startDate || 'Unknown'}`
    : "No complete cycles recorded yet.";

  // Analyze symptoms frequency
  const symptomsFrequency = analyzeSymptoms(sortedLogs);
  
  // Analyze mood patterns
  const moodPatterns = analyzeMoods(sortedLogs);

  // Most recent period details
  const recentLogs = sortedLogs.slice(-5); // last 5 logs
  const recentDetails = recentLogs.map((log: any) => 
    `- Date: ${log.date}, Flow: ${log.flow || 'Not recorded'}, Mood: ${log.mood || 'Not recorded'}, Symptoms: ${log.symptoms?.join(', ') || 'None recorded'}`
  ).join('\n');

  return `
CYCLE STATISTICS:
${cycleStats}

SYMPTOM PATTERNS:
${symptomsFrequency}

MOOD PATTERNS:
${moodPatterns}

MOST RECENT PERIOD LOGS:
${recentDetails}
`;
}

function calculateAverageCycleLength(cycles: any[]): number {
  if (!cycles || cycles.length <= 1) return 0;
  
  const lengths = cycles
    .filter(cycle => cycle.cycleLength)
    .map(cycle => cycle.cycleLength);
  
  if (lengths.length === 0) return 0;
  
  return Math.round(lengths.reduce((sum, len) => sum + len, 0) / lengths.length);
}

function calculateAveragePeriodLength(cycles: any[]): number {
  if (!cycles) return 0;
  
  const lengths = cycles
    .filter(cycle => cycle.periodLength)
    .map(cycle => cycle.periodLength);
  
  if (lengths.length === 0) return 0;
  
  return Math.round(lengths.reduce((sum, len) => sum + len, 0) / lengths.length);
}

function analyzeSymptoms(logs: any[]): string {
  const symptoms: Record<string, number> = {};
  let totalLogs = 0;
  
  logs.forEach(log => {
    if (log.symptoms && log.symptoms.length > 0) {
      totalLogs++;
      log.symptoms.forEach((symptom: string) => {
        symptoms[symptom] = (symptoms[symptom] || 0) + 1;
      });
    }
  });
  
  if (totalLogs === 0) return "No symptom data recorded yet.";
  
  // Sort symptoms by frequency
  const sortedSymptoms = Object.entries(symptoms)
    .sort((a, b) => b[1] - a[1])
    .map(([symptom, count]) => `${symptom} (${Math.round(count/totalLogs * 100)}% of periods)`);
  
  return sortedSymptoms.length > 0 
    ? sortedSymptoms.slice(0, 5).join('\n') 
    : "No common symptoms identified yet.";
}

function analyzeMoods(logs: any[]): string {
  const moods: Record<string, number> = {};
  let totalLogs = 0;
  
  logs.forEach(log => {
    if (log.mood) {
      totalLogs++;
      moods[log.mood] = (moods[log.mood] || 0) + 1;
    }
  });
  
  if (totalLogs === 0) return "No mood data recorded yet.";
  
  // Sort moods by frequency
  const sortedMoods = Object.entries(moods)
    .sort((a, b) => b[1] - a[1])
    .map(([mood, count]) => `${mood} (${Math.round(count/totalLogs * 100)}% of periods)`);
  
  return sortedMoods.length > 0 
    ? sortedMoods.slice(0, 5).join('\n') 
    : "No mood patterns identified yet.";
}