import os
import sys
import argparse
import google.generativeai as genai
import requests
import io
from PIL import Image
import json

def analyze_waste(image_source, api_key, is_url=False):
    """
    WasteWise AI Pro — High-Fidelity Local Analysis (v2.6)
    Supports direct local files and Google Image URLs.
    """
    if not api_key:
        print("Error: GEMINI_API_KEY not found. Please set it in your environment or use --key.")
        sys.exit(1)

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    prompt = """
    You are WasteWise AI Pro, trained on global waste datasets including Google Images.
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
        if is_url:
            print(f"🌐 Fetching image from URL: {image_source}...")
            response = requests.get(image_source, timeout=10)
            img = Image.open(io.BytesIO(response.content))
        else:
            img = Image.open(image_source)

        print(f"🚀 Analyzing with Gemini 1.5 Pro Engine...")
        
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
    parser = argparse.ArgumentParser(description="WasteWise AI Pro - Multi-Source Analysis v2.6")
    parser.add_argument("--image", help="Path to the local waste image")
    parser.add_argument("--url", help="URL of a waste image (e.g. from Google Images)")
    parser.add_argument("--key", help="Gemini API Key")
    
    args = parser.parse_args()
    
    if not args.image and not args.url:
        print("Usage: python3 wastewise-ai-pro.py --image <path> OR --url <url>")
        sys.exit(1)
    
    api_key = args.key or os.environ.get("GEMINI_API_KEY")

    source = args.url if args.url else args.image
    is_url = True if args.url else False

    result = analyze_waste(source, api_key, is_url=is_url)
    
    if result:
        print("\n" + "💎"*25)
        print(" WASTEWISE AI PRO v2.6 | GOOGLE IMAGE EXPERT")
        print("💎"*25)
        print(f" SOURCE TYPE: {'WEB URL' if is_url else 'LOCAL FILE'}")
        print(f" CATEGORY:    {result.get('category')}")
        print(f" VOLUME:      {result.get('volume')}")
        print(f" EST. COST:   N{result.get('estimatedCost', 0):,}")
        print(f" CONFIDENCE:  {result.get('confidence_score', 0):.1%}")
        print("-" * 50)
        print(f" DESCRIPTION: {result.get('description')}")
        print("="*50 + "\n")
