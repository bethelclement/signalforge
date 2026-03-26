import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = body.amount ? String(body.amount) : '250000'; // in kobo
    const custEmail = body.email || 'user@signalforge.io';

    // Interswitch Webpay configuration (sandbox defaults from docs)
    const MERCHANT_CODE = process.env.INTERSWITCH_MERCHANT_CODE || 'MX6072';
    const PAY_ITEM_ID = process.env.INTERSWITCH_PAY_ITEM_ID || '9405967';
    const MAC_KEY = process.env.INTERSWITCH_MAC_KEY || 'D3D1D05AFE42AD50818167EAC73C109168A0F108F32645C8B59E897FA930DA44F9230910DAC9E20641823799A107A02068F7BC0F4CC41D2952E249552255710F';

    // Dynamically grab the Vercel live domain or fallback to localhost
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';

    const SITE_REDIRECT_URL = process.env.INTERSWITCH_REDIRECT_URL || `${protocol}://${host}/api/payment-callback`;

    // Interswitch QA endpoint (new URL from docs)
    const ACTION_URL = 'https://newwebpay.qa.interswitchng.com/collections/w/pay';

    // Generate unique transaction reference
    const txn_ref = 'WW-' + Date.now() + Math.floor(Math.random() * 1000);

    // Calculate the MAC hash (SHA-512)
    const stringToHash = txn_ref + MERCHANT_CODE + PAY_ITEM_ID + amount + SITE_REDIRECT_URL + MAC_KEY;
    const hash = createHash('sha512').update(stringToHash).digest('hex');

    return NextResponse.json({
      merchant_code: MERCHANT_CODE,
      pay_item_id: PAY_ITEM_ID,
      amount,
      currency: '566',
      site_redirect_url: SITE_REDIRECT_URL,
      txn_ref,
      hash,
      cust_email: custEmail,
      action_url: ACTION_URL
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate payment payload' }, { status: 500 });
  }
}
