import { Agent } from '../src/agent';
import { LLMClient } from '../src/llm';
import { tools } from '../src/tools';

jest.mock('../src/llm');

describe('Agent', () => {
  let mockLLM: jest.Mocked<LLMClient>;

  beforeEach(() => {
    mockLLM = new LLMClient('key') as jest.Mocked<LLMClient>;
  });

  it('should return final answer without tools', async () => {
    mockLLM.chatWithTools.mockResolvedValueOnce({
      content: 'Final answer',
      toolCalls: null,
    });
    const agent = new Agent(mockLLM, tools);
    const res = await agent.run('hello');
    expect(res).toBe('Final answer');
  });

  it('should handle tool calls', async () => {
    // First response: tool call
    mockLLM.chatWithTools.mockResolvedValueOnce({
      content: null,
      toolCalls: [
        {
          id: '1',
          type: 'function',
          function: { name: 'calculator', arguments: '{"expression":"2+2"}' },
        },
      ],
    });
    // Second response: final answer after tool
    mockLLM.chatWithTools.mockResolvedValueOnce({
      content: 'Result is 4',
      toolCalls: null,
    });

    const agent = new Agent(mockLLM, tools);
    const res = await agent.run('calculate 2+2');
    expect(res).toBe('Result is 4');
    expect(mockLLM.chatWithTools).toHaveBeenCalledTimes(2);
  });
});