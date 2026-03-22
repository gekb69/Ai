import { LLMClient } from './llm';
import { Memory } from './memory';
import { Tool, Message, ToolCall } from './types';

export class Agent {
  private llm: LLMClient;
  private memory: Memory;
  private tools: Map<string, Tool>;
  private maxIterations: number;

  constructor(llm: LLMClient, tools: Tool[], maxIterations = 10) {
    this.llm = llm;
    this.memory = new Memory();
    this.tools = new Map(tools.map((t) => [t.name, t]));
    this.maxIterations = maxIterations;
  }

  async run(userInput: string): Promise<string> {
    this.memory.add({ role: 'user', content: userInput });

    let iteration = 0;
    while (iteration < this.maxIterations) {
      iteration++;
      const messages = this.memory.getHistory();
      const { content, toolCalls } = await this.llm.chatWithTools(
        messages,
        Array.from(this.tools.values())
      );

      if (toolCalls && toolCalls.length > 0) {
        // Execute tools
        for (const call of toolCalls as ToolCall[]) {
          const tool = this.tools.get(call.function.name);
          if (!tool) {
            this.memory.add({
              role: 'tool',
              content: `Error: tool ${call.function.name} not found`,
              tool_call_id: call.id,
              name: call.function.name,
            });
            continue;
          }

          try {
            let args = {};
            if (call.function.arguments) {
              args = JSON.parse(call.function.arguments);
            }
            const result = await tool.execute(args);
            this.memory.add({
              role: 'tool',
              content: result,
              tool_call_id: call.id,
              name: call.function.name,
            });
          } catch (error: any) {
            this.memory.add({
              role: 'tool',
              content: `Error: ${error.message}`,
              tool_call_id: call.id,
              name: call.function.name,
            });
          }
        }
        // Continue loop to let LLM see tool outputs
        continue;
      }

      // No tool calls – final answer
      if (content) {
        this.memory.add({ role: 'assistant', content });
        return content;
      }
    }

    throw new Error('Max iterations reached without final answer');
  }

  reset() {
    this.memory.clear();
  }
}