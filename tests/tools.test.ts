import { tools } from '../src/tools';
import fs from 'fs/promises';
import path from 'path';

describe('Calculator Tool', () => {
  it('should compute basic expression', async () => {
    const calc = tools.find(t => t.name === 'calculator')!;
    const res = await calc.execute({ expression: '2+2*3' });
    expect(res).toBe('8');
  });

  it('should reject unsafe expression', async () => {
    const calc = tools.find(t => t.name === 'calculator')!;
    await expect(calc.execute({ expression: 'process.exit()' })).rejects.toThrow();
  });
});

describe('File Tools', () => {
  const testFile = path.join(process.cwd(), 'test.txt');

  beforeAll(async () => {
    await fs.writeFile(testFile, 'hello');
  });

  afterAll(async () => {
    await fs.unlink(testFile).catch(() => {});
  });

  it('should read file', async () => {
    const read = tools.find(t => t.name === 'read_file')!;
    const res = await read.execute({ filepath: 'test.txt' });
    expect(res).toBe('hello');
  });

  it('should block path traversal', async () => {
    const read = tools.find(t => t.name === 'read_file')!;
    await expect(read.execute({ filepath: '../etc/passwd' })).rejects.toThrow('Access denied');
  });
});