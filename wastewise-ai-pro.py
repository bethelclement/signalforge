import os
import sys
import argparse
import google.generativeai as genai
from PIL import Image
import json

def analyze_waste(image_path, api_key):
    """
    WasteWise AI Pro — High-Fidelity Local Analysis
    Uses Gemini 1.5 Flash to provide precise waste classification.
    """
    if not api_key:
        print("Error: GEMINI_API_KEY not found. Please provide it via --key or set it in your environment.")
        sys.exit(1)

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    prompt = """
    You are WasteWise AI Pro, a premium environmental computer vision system.
    Analyze this image and identify the exact waste material shown.
    Focus on Lagos-relevant categories (e.g. PET Plastic, Metal Tins, Cardboard, Organic).
    Respond strictly in valid JSON with this structure:
    {
      "category": "String (Be specific, e.g. 'Industrial Scrap Metal' or 'Clear PET Bottles')",
      "volume": "String (e.g. 'Large (approx 4 bags)')",
      "estimatedCost": Number (Clearance fee in Naira, between 1500 and 15000),
      "confidence_score": Number (0.0 to 1.0),
      "description": "2-3 sentences of expert visual analysis explaining your classification."
    }
    """

    try:
        img = Image.open(image_path)
        print(f"Analyzing {image_path}...")
        
        response = model.generate_content([prompt, img])
        
        # Robust JSON extraction
        text = response.text
        start = text.find('{')
        end = text.rfind('}')
        if start == -1 or end == -1:
            raise ValueError("No JSON found in response")
        
        data = json.loads(text[start:end+1])
        return data

    except Exception as e:
        print(f"Error during analysis: {e}")
        return None

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="WasteWise AI Pro - Local Analysis Tool")
    parser.add_argument("--image", required=True, help="Path to the waste image")
    parser.add_argument("--key", help="Gemini API Key (optional if GEMINI_API_KEY env is set)")
    
    args = parser.parse_args()
    
    api_key = args.key or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        # User provided this key in the chat
        api_key = "AIzaSyBB_Y46mhD3LjFlIH2eeebU-Xo8Eoe_P6U"
        print("Using provided API key from configuration...")

    result = analyze_waste(args.image, api_key)
    
    if result:
        print("\n" + "="*40)
        print(" WASTEWISE AI PRO ANALYSIS REPORT")
        print("="*40)
        print(f" CATEGORY:    {result.get('category')}")
        print(f" VOLUME:      {result.get('volume')}")
        print(f" EST. COST:   N{result.get('estimatedCost', 0):,}")
        print(f" CONFIDENCE:  {result.get('confidence_score', 0):.1%}")
        print("-" * 40)
        print(f" DESCRIPTION: {result.get('description')}")
        print("="*40 + "\n")
