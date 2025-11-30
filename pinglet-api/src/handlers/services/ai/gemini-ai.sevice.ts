import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from './groq-ai.service';

// Initialize Gemini AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Configuration for Gemini model
const GEMINI_CONFIG = {
  model: 'gemini-2.0-flash-exp',
  temperature: 0.7,
  maxOutputTokens: 8192,
  topP: 0.95,
  topK: 40,
};

/**
 * Generate content using Gemini AI
 * @param text - User input text (HTML/CSS to convert)
 * @returns Parsed JavaScript code or raw text response
 */
export async function Gemini(text: string): Promise<any> {
  try {
    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error('Input text cannot be empty');
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Prepare conversation contents
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\nUser Input:\n${text}`
          }
        ],
      },
    ];

    // Generate content with Gemini
    const response = await ai.models.generateContent({
      model: GEMINI_CONFIG.model,
      contents,
      // generationConfig: {
      //   temperature: GEMINI_CONFIG.temperature,
      //   maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
      //   topP: GEMINI_CONFIG.topP,
      //   topK: GEMINI_CONFIG.topK,
      // },
    });

    // Extract text from response
    const responseText = response.text;

    if (!responseText) {
      throw new Error('Gemini returned an empty response');
    }

    // Try to parse as JSON first
    try {
      // Remove markdown code blocks if present
      let cleanedText = responseText.trim();

      // Remove ```json and ``` markers
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }

      // Try to parse as JSON
      const parsed = JSON.parse(cleanedText);

      // If it has a 'result' key, return that
      if (parsed.result) {
        return parsed.result;
      }

      return parsed;
    } catch (parseError) {
      // If JSON parsing fails, return raw text
      console.warn('Failed to parse Gemini response as JSON, returning raw text:', parseError);
      return responseText;
    }

  } catch (error) {
    console.error('Gemini AI Error:', error);

    if (error instanceof Error) {
      throw new Error(`Gemini AI failed: ${error.message}`);
    }

    throw new Error('Gemini AI encountered an unknown error');
  }
}

/**
 * Generate content with streaming support
 * @param text - User input text
 * @param onChunk - Callback for each chunk of text
 * @returns Complete generated text
 */
export async function GeminiStream(
  text: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Input text cannot be empty');
    }

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\nUser Input:\n${text}`
          }
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model: GEMINI_CONFIG.model,
      contents,
      // generationConfig: {
      //   temperature: GEMINI_CONFIG.temperature,
      //   maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
      //   topP: GEMINI_CONFIG.topP,
      //   topK: GEMINI_CONFIG.topK,
      // },
    });

    let fullText = '';

    for await (const chunk of response) {
      if (chunk.text) {
        fullText += chunk.text;
        if (onChunk) {
          onChunk(chunk.text);
        }
      }
    }

    return fullText;

  } catch (error) {
    console.error('Gemini AI Stream Error:', error);

    if (error instanceof Error) {
      throw new Error(`Gemini AI Stream failed: ${error.message}`);
    }

    throw new Error('Gemini AI Stream encountered an unknown error');
  }
}

/**
 * Validate and sanitize Gemini response
 * @param response - Raw response from Gemini
 * @returns Validated and sanitized response
 */
export function validateGeminiResponse(response: any): any {
  if (!response) {
    throw new Error('Invalid response: Response is null or undefined');
  }

  if (typeof response === 'string') {
    return response;
  }

  if (typeof response === 'object') {
    return response;
  }

  throw new Error('Invalid response type');
}
