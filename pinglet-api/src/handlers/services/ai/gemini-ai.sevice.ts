import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from './groq-ai.service';

export async function Gemini(text: string): Promise<any> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    tools: [
      {
        googleSearch: {},
      },
    ],
    responseMimeType: 'text/plain',
  };

  const model = 'gemini-2.5-pro';

  const contents = [
    {
      role: 'system',
      parts: [{ text: SYSTEM_PROMPT }],
    },
    {
      role: 'user',
      parts: [{ text }],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let output = '';
  for await (const chunk of response) {
    if (chunk.text) {
      output += chunk.text;
    }
  }

  try {
    return JSON.parse(output);
  } catch (err) {
    throw new Error(`Gemini did not return valid JSON. Raw output: ${output}`);
  }
}
