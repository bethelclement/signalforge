import { describe, it, expect } from 'vitest';
import { GET, POST } from './route';

describe('GET /api/payment-callback', () => {
  it('redirects to /success with all query params', async () => {
    const req = new Request(
      'http://localhost:3000/api/payment-callback?txnref=WW-123&resp=00&desc=Approved',
      { headers: { host: 'localhost:3000' } }
    );
    const res = await GET(req);

    expect(res.status).toBe(303);
    const location = res.headers.get('location')!;
    expect(location).toContain('/success');
    expect(location).toContain('txnref=WW-123');
    expect(location).toContain('resp=00');
    expect(location).toContain('desc=Approved');
  });

  it('handles txnRef casing variant from Interswitch', async () => {
    const req = new Request(
      'http://localhost:3000/api/payment-callback?txnRef=WW-456&resp=00',
      { headers: { host: 'localhost:3000' } }
    );
    const res = await GET(req);

    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toContain('txnref=WW-456');
  });

  it('redirects to /success even with no params', async () => {
    const req = new Request(
      'http://localhost:3000/api/payment-callback',
      { headers: { host: 'localhost:3000' } }
    );
    const res = await GET(req);

    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toContain('/success');
  });

  it('handles failed payment response codes', async () => {
    const req = new Request(
      'http://localhost:3000/api/payment-callback?txnref=WW-FAIL&resp=Z6&desc=Declined',
      { headers: { host: 'localhost:3000' } }
    );
    const res = await GET(req);

    expect(res.status).toBe(303);
    const location = res.headers.get('location')!;
    expect(location).toContain('resp=Z6');
    expect(location).toContain('desc=Declined');
  });

  it('uses https for production hosts', async () => {
    const req = new Request(
      'http://localhost:3000/api/payment-callback?txnref=WW-100&resp=00',
      { headers: { host: 'signalforge-rosy.vercel.app' } }
    );
    const res = await GET(req);

    expect(res.headers.get('location')).toMatch(/^https:\/\/signalforge-rosy\.vercel\.app/);
  });
});

describe('POST /api/payment-callback', () => {
  it('converts POST form data to GET redirect (303)', async () => {
    const formData = new FormData();
    formData.append('txnref', 'WW-789');
    formData.append('resp', '00');
    formData.append('desc', 'Approved');

    const req = new Request('http://localhost:3000/api/payment-callback', {
      method: 'POST',
      headers: { host: 'localhost:3000' },
      body: formData,
    });
    const res = await POST(req);

    expect(res.status).toBe(303);
    const location = res.headers.get('location')!;
    expect(location).toContain('/success');
    expect(location).toContain('txnref=WW-789');
    expect(location).toContain('resp=00');
  });

  it('handles POST with txnRef casing variant', async () => {
    const formData = new FormData();
    formData.append('txnRef', 'WW-CASE');
    formData.append('resp', '00');

    const req = new Request('http://localhost:3000/api/payment-callback', {
      method: 'POST',
      headers: { host: 'localhost:3000' },
      body: formData,
    });
    const res = await POST(req);

    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toContain('txnref=WW-CASE');
  });

  it('falls back gracefully on malformed POST body', async () => {
    const req = new Request('http://localhost:3000/api/payment-callback', {
      method: 'POST',
      headers: { host: 'localhost:3000', 'Content-Type': 'text/plain' },
      body: 'garbage',
    });
    const res = await POST(req);

    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toContain('/success');
    expect(res.headers.get('location')).toContain('WW-VERIFIED-FALLBACK');
  });
});
