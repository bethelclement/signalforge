import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amount = searchParams.get('amount') || '250000'; // in kobo

  // Interswitch configuration constants
  const PRODUCT_ID = process.env.INTERSWITCH_PRODUCT_ID || '1076';
  const PAY_ITEM_ID = process.env.INTERSWITCH_PAY_ITEM_ID || '101007';
  const MAC_KEY = process.env.INTERSWITCH_MAC_KEY || 'D3D1D05AFE42AD50818167EAC73C109168A0F108F32645C8B59E897FA930DA44F9230910DAC9E20641823799A107A02068F7BC0F4CC41D2952E249552255710F';
  const SITE_REDIRECT_URL = process.env.INTERSWITCH_REDIRECT_URL || 'http://localhost:3000/success';
  const Interswitch_URL = 'https://sandbox.interswitchng.com/collections/w/pay';

  // Generate unique transaction reference
  const txn_ref = 'WW-' + Date.now() + Math.floor(Math.random() * 1000);

  // Calculate the MAC hash
  // String to hash: txn_ref + product_id + pay_item_id + amount + site_redirect_url + mac_key
  const stringToHash = txn_ref + PRODUCT_ID + PAY_ITEM_ID + amount + SITE_REDIRECT_URL + MAC_KEY;
  const hash = crypto.createHash('sha512').update(stringToHash).digest('hex');

  // Instead of redirecting immediately, we can render a form that auto-submits, 
  // or return the data to standard Next.js page.
  // For the MVP, we render an auto-submitting form.
  const html = `
    <html>
      <body onload="document.getElementById('isw-form').submit();" style="display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif; background-color:#f9fafb;">
        <div style="text-align:center;">
          <h2 style="color:#0f172a;">Redirecting to Interswitch Payment Gateway...</h2>
          <p style="color:#64748b;">Please wait while we securely transfer you.</p>
        </div>
        <form id="isw-form" action="${Interswitch_URL}" method="POST" style="display:none;">
          <input type="hidden" name="product_id" value="${PRODUCT_ID}" />
          <input type="hidden" name="pay_item_id" value="${PAY_ITEM_ID}" />
          <input type="hidden" name="amount" value="${amount}" />
          <input type="hidden" name="currency" value="566" />
          <input type="hidden" name="site_redirect_url" value="${SITE_REDIRECT_URL}" />
          <input type="hidden" name="txn_ref" value="${txn_ref}" />
          <input type="hidden" name="hash" value="${hash}" />
        </form>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
