import { describe, it, expect } from 'vitest';
import { GET } from './route';

function makeRequest(params: Record<string, string>) {
  const url = new URL('http://localhost:3000/api/verify-payment');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return new Request(url.toString());
}

describe('GET /api/verify-payment', () => {
  it('returns 400 when txnref is missing', async () => {
    const res = await GET(makeRequest({ amount: '250000' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('txnref');
  });

  it('returns 400 when amount is missing', async () => {
    const res = await GET(makeRequest({ txnref: 'WW-123' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('amount');
  });

  it('returns 400 when both params are missing', async () => {
    const res = await GET(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it('attempts verification when params are provided', async () => {
    // Hits real Interswitch QA — may timeout or return 502
    const res = await GET(makeRequest({ txnref: 'WW-TEST-123', amount: '250000' }));
    // Should not be a validation error
    expect(res.status).not.toBe(400);
    // Could be 200 (ISW responded), 502 (ISW down), or 500 (network error)
    expect([200, 500, 502]).toContain(res.status);
  }, 15000);
});
