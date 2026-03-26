import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const txnref = searchParams.get('txnref');
    const amount = searchParams.get('amount');

    if (!txnref || !amount) {
      return NextResponse.json(
        { error: 'Missing required query params: txnref, amount' },
        { status: 400 }
      );
    }

    const MERCHANT_CODE = process.env.INTERSWITCH_MERCHANT_CODE || 'MX6072';
    const VERIFY_URL = 'https://qa.interswitchng.com/collections/api/v1/gettransaction.json';

    const url = `${VERIFY_URL}?merchantcode=${MERCHANT_CODE}&transactionreference=${encodeURIComponent(txnref)}&amount=${encodeURIComponent(amount)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Verification request failed', status: response.status },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: data.ResponseCode === '00',
      responseCode: data.ResponseCode,
      responseDescription: data.ResponseDescription,
      amount: data.Amount,
      transactionReference: data.MerchantReference,
      paymentReference: data.PaymentReference,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
