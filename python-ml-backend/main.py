from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import time
import io
import os
import json
from PIL import Image
import google.generativeai as genai

# SAFETY-PIN: Using provided key to ensure "Real" AI always works locally
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or "AIzaSyBB_Y46mhD3LjFlIH2eeebU-Xo8Eoe_P6U"
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    GEMINI_READY = True
else:
    GEMINI_READY = False

try:
    from transformers import pipeline
    print("Loading local ViT model (fallback)...")
    classifier = pipeline("image-classification", model="google/vit-base-patch16-224")
    MODEL_LOADED = True
except ImportError:
    MODEL_LOADED = False
    print("Transformers not installed. Skipping local ViT.")

app = FastAPI(title="WasteWise ML Engine API Pro", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Semantic Category Mapping for Lagos (used by the basic ViT fallback)
CATEGORY_MAPPING = {
    "bottle": "Clear PET Bottles (High Salvage)",
    "plastic": "HDPE Plastics (Detergent/Milk)",
    "carton": "Corrugated Cardboard (Baled)",
    "paper": "Mixed Office Paper/Newsprint",
    "cup": "Polypropylene (Food Packs)",
    "can": "Aluminum Beverage Cans",
    "bag": "LDPE Plastics (Pure Water Sachets)",
    "food": "Biodegradable Food Waste",
    "battery": "Lead-Acid Car Batteries",
    "electronic": "E-Waste (Small Electronics)"
}

@app.post("/api/predict")
async def analyze_waste_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be an image.")

    content = await file.read()
    image = Image.open(io.BytesIO(content))

    # --- PRIMARY: Gemini Vision Pro ---
    if GEMINI_READY:
        try:
            prompt = """
            You are WasteWise AI Pro, a premium environmental vision system for Lagos.
            Identify the waste material shown. Respond strictly in JSON:
            {
              "category": "String (PICK FROM: Clear PET Bottles, Aluminum Cans, Tin Metal, Corrugated Cardboard, HDPE Plastics, LDPE Plastics, Polypropylene, Glass Bottles, E-Waste, Car Batteries, Food Waste, Organic Waste, Office Paper, Styrofoam, Textiles, Construction Debris, Medical Waste, Landfill, Industrial Scrap)",
              "volume": "Estimate size (Small, Medium, Large)",
              "estimatedCost": Number (Naira, 1500-15000),
              "confidence_score": Number,
              "description": "2 expert sentences."
            }
            """
            response = gemini_model.generate_content([prompt, image])
            text = response.text
            start, end = text.find('{'), text.rfind('}')
            if start != -1 and end != -1:
                data = json.loads(text[start:end+1])
                return {"status": "success", "source": "GEMINI_VISION_PRO", "data": data}
        except Exception as e:
            print(f"Gemini error: {e}")

    # --- FALLBACK: Vision Transformer (ViT) ---
    if MODEL_LOADED:
        try:
            predictions = classifier(image)
            best_pred = predictions[0]
            label = best_pred["label"].lower()
            confidence = best_pred["score"]
            predicted_category = "General Non-Recyclable"
            for key, val in CATEGORY_MAPPING.items():
                if key in label:
                    predicted_category = val
                    break
            return {
                "status": "success",
                "source": "LOCAL_VIT_FALLBACK",
                "data": {
                    "category": predicted_category,
                    "volume": "Medium (2-3 bags)",
                    "estimatedCost": 2500,
                    "confidence_score": round(confidence, 2),
                    "description": f"Local ViT detected '{best_pred['label']}' with {confidence:.1%} confidence."
                }
            }
        except Exception as e:
            print(f"ViT error: {e}")

    return {
        "status": "success", "source": "STATIC_FALLBACK",
        "data": {
            "category": "General Non-Recyclable", "volume": "Medium", "estimatedCost": 2500,
            "confidence_score": 0.50, "description": "Static fallback triggered."
        }
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "2.0.0 PRO"}
