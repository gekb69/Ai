import OpenAI from 'openai';
import { Message, Tool } from './types';

export class LLMClient {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4-turbo-preview') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async chatWithTools(
    messages: Message[],
    tools: Tool[],
    maxRetries = 3
  ): Promise<{ content: string | null; toolCalls: any[] | null }> {
    const toolDefinitions = tools.map((t) => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      },
    }));

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.client.chat.completions.create({
          model: this.model,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
            ...(m.tool_call_id && { tool_call_id: m.tool_call_id }),
            ...(m.name && { name: m.name }),
          })) as any,
          tools: toolDefinitions,
          tool_choice: 'auto',
        });

        const choice = response.choices[0];
        return {
          content: choice.message.content,
          toolCalls: choice.message.tool_calls || null,
        };
      } catch (error) {
        if (attempt === maxRetries) throw error;
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
    throw new Error('Max retries exceeded');
  }
}