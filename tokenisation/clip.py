from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch

# Load model and processor
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Load image and text
image = Image.open("jeans2.jpg")
texts = ["Dark-blue denim jeans; straight-leg fit; five-pocket styling; yellow stitching detail; button-fly closure; no visible patterns or distress.", "Blue denim cargo pants; relaxed fit; faded wash; multiple patch pockets; button closure.", "Black cargo pants; multiple utility pockets; solid color; tapered fit; button closure."]

# Preprocess
inputs = processor(text=texts, images=image, return_tensors="pt", padding=True)

# Get similarity logits
outputs = model(**inputs)
logits_per_image = outputs.logits_per_image  # image-text similarity
probs = logits_per_image.softmax(dim=1)      # normalize to probabilities

print(f"Probabilities: {probs}")