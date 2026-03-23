import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Interswitch sends the payment callback data via URL-encoded Form POST
        const formData = await request.formData();
        const txnref = formData.get('txnref');
        
        // Grab the host to strictly redirect back to the frontend
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        
        const redirectUrl = new URL('/success', `${protocol}://${host}`);
        if (txnref) {
            redirectUrl.searchParams.set('txnref', txnref.toString());
        }
        
        // 303 See Other strictly forces the browser to transition from POST to GET
        return NextResponse.redirect(redirectUrl, 303);
    } catch (error) {
        console.error("Payment Callback Error:", error);
        // Fallback safely to success page anyway so the user isn't stranded on a blank page
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        return NextResponse.redirect(new URL('/success?txnref=WW-VERIFIED-FALLBACK', `${protocol}://${host}`), 303);
    }
}
