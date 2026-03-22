import { Agent } from './agent';
import { LLMClient } from './llm';
import { tools } from './tools';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Missing OPENAI_API_KEY in environment');
    process.exit(1);
  }

  const llm = new LLMClient(apiKey);
  const agent = new Agent(llm, tools);

  console.log('AI Agent ready. Type "exit" to quit.');
  process.stdout.write('You: ');
  for await (const line of console) {
    const input = line.trim();
    if (input === 'exit') break;
    if (input === '') continue;

    try {
      const response = await agent.run(input);
      console.log(`Agent: ${response}`);
    } catch (err) {
      console.error(`Error: ${err instanceof Error ? err.message : err}`);
    }
    process.stdout.write('You: ');
  }
}

if (require.main === module) {
  main().catch(console.error);
}