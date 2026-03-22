import { Memory } from '../src/memory';

test('memory stores and trims', () => {
  const mem = new Memory();
  for (let i = 0; i < 60; i++) {
    mem.add({ role: 'user', content: `msg ${i}` });
  }
  expect(mem.getHistory().length).toBeLessThanOrEqual(50);
});