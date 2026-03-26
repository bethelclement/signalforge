import { describe, it, expect } from 'vitest';
import { POST } from './route';

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost:3000/api/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', host: 'localhost:3000' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/pay', () => {
  it('returns valid Interswitch payment payload', async () => {
    const res = await POST(makeRequest({ amount: 250000 }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.merchant_code).toBe('MX6072');
    expect(data.pay_item_id).toBe('9405967');
    expect(data.amount).toBe('250000');
    expect(data.currency).toBe('566');
    expect(data.txn_ref).toMatch(/^WW-\d+/);
    expect(data.hash).toHaveLength(128);
    expect(data.action_url).toContain('interswitchng.com');
    expect(data.site_redirect_url).toContain('/api/payment-callback');
  });

  it('defaults amount to 250000 when not provided', async () => {
    const res = await POST(makeRequest({}));
    const data = await res.json();
    expect(data.amount).toBe('250000');
  });

  it('converts numeric amount to string', async () => {
    const res = await POST(makeRequest({ amount: 500000 }));
    const data = await res.json();
    expect(data.amount).toBe('500000');
    expect(typeof data.amount).toBe('string');
  });

  it('passes customer email through', async () => {
    const res = await POST(makeRequest({ amount: 100000, email: 'test@example.com' }));
    const data = await res.json();
    expect(data.cust_email).toBe('test@example.com');
  });

  it('uses default email when none provided', async () => {
    const res = await POST(makeRequest({ amount: 100000 }));
    const data = await res.json();
    expect(data.cust_email).toBe('user@signalforge.io');
  });

  it('generates unique transaction refs across calls', async () => {
    const refs = new Set<string>();
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest({ amount: 100000 }));
      const data = await res.json();
      refs.add(data.txn_ref);
    }
    expect(refs.size).toBe(5);
  });

  it('produces a valid SHA-512 hex hash', async () => {
    const res = await POST(makeRequest({ amount: 100000 }));
    const data = await res.json();
    expect(data.hash).toMatch(/^[a-f0-9]{128}$/);
  });

  it('uses http protocol for localhost', async () => {
    const res = await POST(makeRequest({ amount: 100000 }));
    const data = await res.json();
    expect(data.site_redirect_url).toMatch(/^http:\/\/localhost/);
  });

  it('uses https protocol for production host', async () => {
    const req = new Request('http://localhost:3000/api/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', host: 'signalforge-rosy.vercel.app' },
      body: JSON.stringify({ amount: 100000 }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.site_redirect_url).toMatch(/^https:\/\/signalforge-rosy\.vercel\.app/);
  });

  it('returns 500 on malformed request body', async () => {
    const req = new Request('http://localhost:3000/api/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', host: 'localhost:3000' },
      body: 'not json',
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBeTruthy();
  });
});
