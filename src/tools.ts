import { Tool } from './types';
import * as fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const SAFE_ROOT = process.env.SAFE_FS_ROOT || process.cwd();

export const tools: Tool[] = [
  {
    name: 'calculator',
    description: 'Perform basic arithmetic',
    parameters: {
      type: 'object',
      properties: {
        expression: { type: 'string', description: 'Math expression (e.g., 2+2*3)' },
      },
      required: ['expression'],
    },
    execute: async ({ expression }) => {
      // Security: evaluate only safe math
      const sanitized = expression.replace(/[^0-9+\-*/%().]/g, '');
      if (!sanitized) throw new Error('Invalid expression');
      try {
        const result = eval(`(${sanitized})`);
        return String(result);
      } catch {
        throw new Error('Calculation error');
      }
    },
  },
  {
    name: 'web_search',
    description: 'Simulate web search (returns mock results)',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' },
      },
      required: ['query'],
    },
    execute: async ({ query }) => {
      // In production, replace with actual API (e.g., SerpAPI)
      return `Mock search results for "${query}"`;
    },
  },
  {
    name: 'read_file',
    description: 'Read a file from safe directory',
    parameters: {
      type: 'object',
      properties: {
        filepath: { type: 'string' },
      },
      required: ['filepath'],
    },
    execute: async ({ filepath }) => {
      // Path traversal prevention
      const full = path.resolve(SAFE_ROOT, filepath);
      if (!full.startsWith(SAFE_ROOT)) {
        throw new Error('Access denied: path outside safe root');
      }
      const content = await fs.readFile(full, 'utf-8');
      return content;
    },
  },
  {
    name: 'write_file',
    description: 'Write content to a file inside safe directory',
    parameters: {
      type: 'object',
      properties: {
        filepath: { type: 'string' },
        content: { type: 'string' },
      },
      required: ['filepath', 'content'],
    },
    execute: async ({ filepath, content }) => {
      const full = path.resolve(SAFE_ROOT, filepath);
      if (!full.startsWith(SAFE_ROOT)) {
        throw new Error('Access denied: path outside safe root');
      }
      await fs.writeFile(full, content, 'utf-8');
      return `File written to ${full}`;
    },
  },
  {
    name: 'run_command',
    description: 'Execute a safe shell command (only allowed list)',
    parameters: {
      type: 'object',
      properties: {
        command: { type: 'string' },
      },
      required: ['command'],
    },
    execute: async ({ command }) => {
      const allowed = ['ls', 'pwd', 'echo', 'cat'];
      const cmd = command.trim().split(' ')[0];
      if (!allowed.includes(cmd)) {
        throw new Error(`Command "${cmd}" not allowed`);
      }
      const { stdout, stderr } = await execAsync(command);
      if (stderr) throw new Error(stderr);
      return stdout;
    },
  },
];