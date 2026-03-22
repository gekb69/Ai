# AI Agent – Production‑Ready Agent Framework

A modular, secure AI agent inspired by OpenClaw and Manos. Supports tool calling, memory, and safe execution.

## Features

- **ReAct‑style loop** with tool integration
- **Built‑in tools**: calculator, file I/O (sandboxed), command execution (allowlist), web search (mock)
- **OpenAI GPT‑4 Turbo** with automatic retries and error handling
- **Conversation memory** with automatic trimming
- **Security**:
  - No `eval` without sanitization
  - Path traversal protection for file tools
  - Command allowlist for shell commands
- **Fully tested** with Jest (unit tests for all components)

## Installation

```bash
git clone https://github.com/your-username/ai-agent.git
cd ai-agent
npm install
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
npm run build
npm start