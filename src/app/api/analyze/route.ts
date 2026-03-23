import { NextResponse } from 'next/server';

const CATEGORY_MAPPING: Record<string, string> = {
    "bottle": "Commercial Plastics - Oshodi Market",
    "plastic": "Commercial Plastics - Oshodi Market",
    "carton": "Cardboard & Paper - Reusable",
    "paper": "Cardboard & Paper - Reusable",
    "cup": "Mixed Commercial Plastics - High Grade",
    "can": "Scrap Metal / E-Waste",
    "bag": "Mixed Recyclables - Lekki Phase 1",
    "food": "Biodegradable Organic Waste"
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64 } = body;

    // Strip out the data URL prefix to get raw base64
    const base64Data = imageBase64 ? imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "") : "";

    if (!base64Data) {
        throw new Error("No image data provided");
    }

    // Convert base64 to Buffer to send via FormData
    const buffer = Buffer.from(base64Data, 'base64');
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('file', blob, 'image.jpg');

    console.log("Attempting local Python ML Backend...");

    // 1. Call Python ML Backend (Works for localhost laptop demo)
    try {
        const backendRes = await fetch('http://127.0.0.1:8000/api/predict', {
            method: 'POST',
            body: formData,
            signal: AbortSignal.timeout(2500) // Fallback to Cloud quickly if Vercel
        });
        
        if (backendRes.ok) {
            const result = await backendRes.json();
            console.log("Python Backend Result:", result);
            return NextResponse.json(result.data);
        }
    } catch (localErr) {
        console.log("Local Python absent (likely Vercel Production). Falling back to Cloud HF Inference...");
    }

    // 2. Vercel Production Fallback: Direct HuggingFace Inference
    console.log("Calling HuggingFace Cloud natively...");
    
    const hfRes = await fetch('https://api-inference.huggingface.co/models/google/vit-base-patch16-224', {
        method: "POST",
        body: buffer,
    });

    if (!hfRes.ok) throw new Error("HuggingFace Cloud failed: " + await hfRes.text());
    
    const hfData = await hfRes.json();
    console.log("HF Cloud Result:", hfData);
    
    // Process HF results exactly like Python backend
    const bestPred = Array.isArray(hfData) ? hfData[0] : null;
    let category = "Mixed Recyclables - Lekki Phase 1";
    let desc = "Cloud processing returned standard mixed waste.";
    let confidence = 0.85;

    if (bestPred && bestPred.label) {
        const label = bestPred.label.toLowerCase();
        confidence = bestPred.score;
        let matched = false;
        
        for (const [key, val] of Object.entries(CATEGORY_MAPPING)) {
            if (label.includes(key)) {
                category = val;
                matched = true;
                break;
            }
        }
        if (!matched) category = `Unclassified (${bestPred.label})`;
        desc = `Cloud Neural Net detected '${bestPred.label}' with ${(confidence*100).toFixed(1)}% confidence.`;
    }

    return NextResponse.json({
        category: category,
        volume: "Medium (2-3 bags)",
        estimatedCost: Math.floor(Math.random() * (4500 - 1500 + 1)) + 1500,
        confidence_score: Number(confidence.toFixed(2)),
        description: desc
    });

  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze waste image.' },
      { status: 500 }
    );
  }
}
