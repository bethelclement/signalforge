from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import time
import io
import os
import json
from PIL import Image
import google.generativeai as genai

# Gemini Setup
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or "AIzaSyBB_Y46mhD3LjFlIH2eeebU-Xo8Eoe_P6U"
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    GEMINI_READY = True
else:
    GEMINI_READY = False

# Backup Vision Transformer (Local ViT)
try:
    from transformers import pipeline
    print("Loading local ViT model (fallback)...")
    classifier = pipeline("image-classification", model="google/vit-base-patch16-224")
    MODEL_LOADED = True
except ImportError:
    MODEL_LOADED = False
    print("Transformers not installed. Skipping local ViT.")

app = FastAPI(title="WasteWise ML Engine API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Semantic Category Mapping for Lagos (used by the basic ViT fallback)
CATEGORY_MAPPING = {
    "bottle": "Commercial Plastics - Oshodi Market",
    "plastic": "Commercial Plastics - Oshodi Market",
    "carton": "Cardboard & Paper - Reusable",
    "paper": "Cardboard & Paper - Reusable",
    "cup": "Mixed Commercial Plastics - High Grade",
    "can": "Scrap Metal / E-Waste",
    "bag": "Mixed Recyclables - Lekki Phase 1",
    "food": "Biodegradable Organic Waste"
}

@app.post("/api/predict")
async def analyze_waste_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be an image.")

    content = await file.read()
    image = Image.open(io.BytesIO(content))

    # --- PRIMARY: Gemini Vision ---
    if GEMINI_READY:
        try:
            prompt = """
            You are WasteWise AI Pro, a premium environmental computer vision system.
            Analyze this image and identify the exact waste material shown.
            Output JSON strictly: {
              "category": "String (e.g. 'PET Plastic Bottles')",
              "volume": "String (e.g. 'Medium (2 bags)')",
              "estimatedCost": Number (Naira, 1500-5000),
              "confidence_score": Number,
              "description": "2 sentences of expert visual analysis."
            }
            """
            
            response = gemini_model.generate_content([prompt, image])
            text = response.text
            start, end = text.find('{'), text.rfind('}')
            if start != -1 and end != -1:
                data = json.loads(text[start:end+1])
                return {
                    "status": "success",
                    "source": "GEMINI_VISION_PRO",
                    "data": data
                }
        except Exception as e:
            print(f"Gemini error: {e}")

    # --- FALLBACK: Vision Transformer (ViT) ---
    if MODEL_LOADED:
        try:
            predictions = classifier(image)
            best_pred = predictions[0]
            label = best_pred["label"].lower()
            confidence = best_pred["score"]
            predicted_category = "Mixed Recyclables - Commercial Axis"
            
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
                    "description": f"Local AI model (ViT) detected '{best_pred['label']}' with {confidence:.1%} confidence."
                }
            }
        except Exception as e:
            print(f"ViT error: {e}")

    # --- LAST RESORT: Static Fallback ---
    return {
        "status": "success",
        "source": "STATIC_FALLBACK",
        "data": {
            "category": "Mixed Recyclables",
            "volume": "Medium",
            "estimatedCost": 2500,
            "confidence_score": 0.50,
            "description": "Static fallback triggered. Machine learning engines unavailable."
        }
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "WasteWise ML Python Engine PRO"}
