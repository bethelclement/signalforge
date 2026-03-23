from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import time
import random

app = FastAPI(title="WasteWise ML Engine API", version="1.0.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated ML Model Categories localized for Lagos
CATEGORIES = [
    "Commercial Plastics - Oshodi Market",
    "Organic Waste - Epe",
    "Industrial Debris - Ikeja",
    "Mixed Recyclables - Lekki Phase 1",
    "Hazardous Medical Waste - Yaba"
]

@app.post("/api/predict")
async def analyze_waste_image(file: UploadFile = File(...)):
    """
    Accepts an uploaded image of waste, processes it through the 
    classification model, and returns categorization and clearance cost estimate.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be an image.")

    # In production, we would load the .h5 or .pt model here:
    # model = load_model('model_v1_lagos.h5')
    # prediction = model.predict(preprocessed_image)
    
    # Simulating ML prediction latency (ResNet50 inference time)
    time.sleep(1.8)
    
    # Mocking prediction output
    predicted_category = random.choice(CATEGORIES)
    estimated_volume = random.choice(["Low (1 bag)", "Medium (2-3 bags)", "High (Truckload)"])
    base_cost = random.randint(1500, 15000)
    
    return {
        "status": "success",
        "model_version": "v1.4.2_lagos",
        "data": {
            "category": predicted_category,
            "volume": estimated_volume,
            "estimatedCost": base_cost,
            "confidence_score": round(random.uniform(0.85, 0.99), 2),
            "description": f"Model identified {predicted_category.lower()} requiring specialized PSP handler."
        }
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "WasteWise ML Python Engine"}
