import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = body.amount ? String(body.amount) : '250000'; // in kobo

    // Interswitch Webpay test configuration
    const PRODUCT_ID = process.env.INTERSWITCH_PRODUCT_ID || '1076';
    const PAY_ITEM_ID = process.env.INTERSWITCH_PAY_ITEM_ID || '101007';
    const MAC_KEY = process.env.INTERSWITCH_MAC_KEY || 'D3D1D05AFE42AD50818167EAC73C109168A0F108F32645C8B59E897FA930DA44F9230910DAC9E20641823799A107A02068F7BC0F4CC41D2952E249552255710F';
    
    // In production, this would be your live domain
    const SITE_REDIRECT_URL = process.env.INTERSWITCH_REDIRECT_URL || 'http://localhost:3000/success';
    
    // Standard QA Interswitch Endpoint
    const Interswitch_URL = 'https://qa.interswitchng.com/collections/w/pay';

    // Generate unique transaction reference
    const txn_ref = 'WW-' + Date.now() + Math.floor(Math.random() * 1000);

    // Calculate the MAC hash
    const stringToHash = txn_ref + PRODUCT_ID + PAY_ITEM_ID + amount + SITE_REDIRECT_URL + MAC_KEY;
    const hash = crypto.createHash('sha512').update(stringToHash).digest('hex');

    return NextResponse.json({
      product_id: PRODUCT_ID,
      pay_item_id: PAY_ITEM_ID,
      amount,
      currency: '566',
      site_redirect_url: SITE_REDIRECT_URL,
      txn_ref,
      hash,
      action_url: Interswitch_URL
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate payment payload' }, { status: 500 });
  }
}
