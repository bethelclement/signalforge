import { NextResponse } from 'next/server';

function buildRedirectUrl(host: string, txnref: string | null, resp?: string | null, desc?: string | null): URL {
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const url = new URL('/success', `${protocol}://${host}`);
    if (txnref) url.searchParams.set('txnref', txnref);
    if (resp) url.searchParams.set('resp', resp);
    if (desc) url.searchParams.set('desc', desc);
    return url;
}

// Handle Interswitch GET redirect callbacks (QA environment sometimes uses GET)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const host = request.headers.get('host') || 'localhost:3000';
        // Normalize both casing variants: txnref and txnRef
        const txnref = searchParams.get('txnref') || searchParams.get('txnRef') || null;
        const resp = searchParams.get('resp') || null;
        const desc = searchParams.get('desc') || null;
        return NextResponse.redirect(buildRedirectUrl(host, txnref, resp, desc), 303);
    } catch (error) {
        console.error("Payment Callback GET Error:", error);
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        return NextResponse.redirect(new URL('/success?txnref=WW-VERIFIED-FALLBACK', `${protocol}://${host}`), 303);
    }
}

// Handle Interswitch POST callback (primary method)
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const host = request.headers.get('host') || 'localhost:3000';
        // Normalize both casing variants: txnref and txnRef
        const txnref = (formData.get('txnref') || formData.get('txnRef') || '').toString() || null;
        const resp = (formData.get('resp') || '').toString() || null;
        const desc = (formData.get('desc') || '').toString() || null;
        
        // 303 See Other forces the browser from POST to GET
        return NextResponse.redirect(buildRedirectUrl(host, txnref, resp, desc), 303);
    } catch (error) {
        console.error("Payment Callback POST Error:", error);
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        return NextResponse.redirect(new URL('/success?txnref=WW-VERIFIED-FALLBACK', `${protocol}://${host}`), 303);
    }
}
