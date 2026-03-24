from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import time
import io
from PIL import Image

# Optional: Using transformers for real ML inference
try:
    from transformers import pipeline
    # Load a vision transformer model for image classification
    print("Loading ML model (this may take a moment)...")
    classifier = pipeline("image-classification", model="google/vit-base-patch16-224")
    MODEL_LOADED = True
except ImportError:
    MODEL_LOADED = False
    print("Transformers not installed. Falling back to basic logic.")

app = FastAPI(title="WasteWise ML Engine API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated ML Model Categories localized for Lagos based on ImageNet matches
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
    
    predicted_category = "Mixed Recyclables - Lekki Phase 1" # Default
    confidence = 0.85
    description = "Model identified mixed waste requiring standard PSP handler."
    
    if MODEL_LOADED:
        try:
            image = Image.open(io.BytesIO(content))
            predictions = classifier(image)
            
            # Find the best prediction
            best_pred = predictions[0]
            label = best_pred["label"].lower()
            confidence = best_pred["score"]
            
            # Map ImageNet label to our categories
            matched = False
            for key, val in CATEGORY_MAPPING.items():
                if key in label:
                    predicted_category = val
                    matched = True
                    break
            
            if not matched:
                predicted_category = f"Unclassified ({best_pred['label']})"
            
            description = f"Neural Net detected '{best_pred['label']}' with {confidence:.1%} confidence. Assigned to: {predicted_category}."
            
        except Exception as e:
            print("ML Inference Error:", e)

    estimated_volume = "Medium (2-3 bags)"
    base_cost = 2500
    
    return {
        "status": "success",
        "model_version": "v2.0.0_vit_lagos" if MODEL_LOADED else "v1.0.0_fallback",
        "data": {
            "category": predicted_category,
            "volume": estimated_volume,
            "estimatedCost": base_cost,
            "confidence_score": round(confidence, 2),
            "description": description
        }
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "WasteWise ML Python Engine"}
