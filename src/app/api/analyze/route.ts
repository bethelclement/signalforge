import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64 } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback response if API key is not configured in Vercel yet
      return NextResponse.json({
        category: "Mixed Recyclables (Mock - Add Gemini Key)",
        volume: "Medium (approx 2 bags)",
        estimatedCost: 2500,
        description: "Configure GEMINI_API_KEY in Vercel to activate real computer vision scanning."
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are WasteWise AI, an expert computer vision system for waste management in Lagos, Nigeria.
      Analyze this image of waste. Identify the primary type of waste, estimate its volume, 
      and provide a short, professional description for the PSP operator. 
      Also, estimate a clearance cost in Naira (between 1500 and 15000) based on severity.
      Respond strictly in valid JSON with exactly this format:
      {
        "category": "String (e.g. Commercial Plastics - Oshodi)",
        "volume": "String (e.g. Medium (2-3 bags))",
        "estimatedCost": Number,
        "description": "String"
      }
    `;

    // Strip out the data URL prefix to get raw base64
    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // Extract JSON from potential markdown blocks
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/{[\s\S]*}/);
    const parsedData = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : JSON.parse(responseText);

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze waste image.' },
      { status: 500 }
    );
  }
}
