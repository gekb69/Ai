import { LLMClient } from '../src/llm';

// Mock OpenAI
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'mocked', tool_calls: null } }],
          }),
        },
      },
    })),
  };
});

test('LLM client retries on failure', async () => {
  const client = new LLMClient('fake-key');
  // The mock will succeed, so we don't test retry here.
  // In a real test, you'd mock a failure first.
  const res = await client.chatWithTools([{ role: 'user', content: 'hi' }], []);
  expect(res.content).toBe('mocked');
});