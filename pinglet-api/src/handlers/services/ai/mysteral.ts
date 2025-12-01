import { Mistral } from "@mistralai/mistralai";
import { ConversationInputs } from "@mistralai/mistralai/models/components";
import { SYSTEM_PROMPT } from "./groq-ai.service";

const client = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY,
});



export async function getMistralCompletion(text: string): Promise<string> {
    const messages: ConversationInputs = [{ role: "user", content: text }];
    const response: any = await client.beta.conversations.start({
        inputs: messages,
        model: "mistral-medium-latest",
        instructions: SYSTEM_PROMPT,
        completionArgs: {
            temperature: 0.7,
            maxTokens: 2048,
            topP: 1,
            responseFormat: {
                type: "json_object",

            },
        },

    }
    )

    return response.outputs[0]?.content;

}
