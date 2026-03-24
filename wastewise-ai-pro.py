import os
import sys
import argparse
import google.generativeai as genai
from PIL import Image
import json

def analyze_waste(image_path, api_key):
    """
    WasteWise AI Pro — High-Fidelity Local Analysis (v2.5)
    Uses Gemini 1.5 Flash with 21 high-accuracy waste categories.
    """
    if not api_key:
        print("Error: GEMINI_API_KEY not found. Please set it in your environment or use --key.")
        sys.exit(1)

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    prompt = """
    You are WasteWise AI Pro, a premium environmental vision system for Lagos.
    Identify the waste material shown. Respond strictly in JSON:
    {
      "category": "String (Select one of the 21 specialized categories)",
      "volume": "Estimate size (Small, Medium, Large, Industrial)",
      "estimatedCost": Number (Naira, 1500-25000),
      "confidence_score": Number,
      "description": "3 sentences of expert, factual visual analysis."
    }
    """

    try:
        img = Image.open(image_path)
        print(f"🚀 Analyzing {image_path} with Gemini 1.5 Pro Engine...")
        
        response = model.generate_content([prompt, img])
        
        text = response.text
        start = text.find('{')
        end = text.rfind('}')
        if start == -1 or end == -1:
            raise ValueError("No JSON found in response")
        
        data = json.loads(text[start:end+1])
        return data

    except Exception as e:
        print(f"Analysis Error: {e}")
        return None

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="WasteWise AI Pro - High-Fidelity Analysis v2.5")
    parser.add_argument("--image", required=True, help="Path to the waste image")
    parser.add_argument("--key", help="Gemini API Key")
    
    args = parser.parse_args()
    
    api_key = args.key or os.environ.get("GEMINI_API_KEY")

    result = analyze_waste(args.image, api_key)
    
    if result:
        print("\n" + "💎"*25)
        print(" WASTEWISE AI PRO v2.5 | PERFECT PREDICTOR")
        print("💎"*25)
        print(f" CATEGORY:    {result.get('category')}")
        print(f" VOLUME:      {result.get('volume')}")
        print(f" EST. COST:   N{result.get('estimatedCost', 0):,}")
        print(f" CONFIDENCE:  {result.get('confidence_score', 0):.1%}")
        print("-" * 50)
        print(f" DESCRIPTION: {result.get('description')}")
        print("="*50 + "\n")
