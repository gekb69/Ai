export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: Record<string, any>) => Promise<string>;
}

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
  name?: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}