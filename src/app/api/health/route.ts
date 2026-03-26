import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

async function checkGemini(): Promise<{ status: string; model: string }> {
  const model = 'gemini-1.5-flash';
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return { status: 'offline', model };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    await genAI.getGenerativeModel({ model }).countTokens('ping');
    return { status: 'operational', model };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('API key') || message.includes('401') || message.includes('403')) {
      return { status: 'offline', model };
    }
    return { status: 'degraded', model };
  }
}

async function checkInterswitch(): Promise<{ status: string; endpoint: string }> {
  const endpoint = 'QA';
  try {
    await fetch('https://newwebpay.qa.interswitchng.com', {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000),
    });
    return { status: 'operational', endpoint };
  } catch {
    return { status: 'offline', endpoint };
  }
}

export async function GET() {
  const [gemini, interswitch] = await Promise.all([
    checkGemini(),
    checkInterswitch(),
  ]);

  return NextResponse.json({
    gemini,
    interswitch,
    timestamp: new Date().toISOString(),
  });
}
