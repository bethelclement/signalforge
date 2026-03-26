import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/health', () => {
  it('returns health status for all services', async () => {
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty('gemini');
    expect(data).toHaveProperty('interswitch');
    expect(data).toHaveProperty('timestamp');
  });

  it('returns valid gemini status shape', async () => {
    const res = await GET();
    const data = await res.json();

    expect(data.gemini).toHaveProperty('status');
    expect(data.gemini).toHaveProperty('model');
    expect(['operational', 'degraded', 'offline']).toContain(data.gemini.status);
    expect(data.gemini.model).toBe('gemini-2.0-flash');
  });

  it('returns valid interswitch status shape', async () => {
    const res = await GET();
    const data = await res.json();

    expect(data.interswitch).toHaveProperty('status');
    expect(data.interswitch).toHaveProperty('endpoint');
    expect(['operational', 'offline']).toContain(data.interswitch.status);
    expect(data.interswitch.endpoint).toBe('QA');
  });

  it('returns valid ISO timestamp', async () => {
    const res = await GET();
    const data = await res.json();

    const parsed = new Date(data.timestamp);
    expect(parsed.getTime()).not.toBeNaN();
  });
});
