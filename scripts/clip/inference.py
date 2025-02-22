from transformers import CLIPProcessor, CLIPModel
from PIL import Image

# Load model and processor
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Load image and text
image = Image.open("example.jpg")
texts = ["A cat sitting on a sofa", "A dog playing in the park", "a blue shirt", "a red shirt", "blue trousers"]

# Preprocess
inputs = processor(text=texts, images=image, return_tensors="pt", padding=True)

# Get similarity logits
outputs = model(**inputs)
logits_per_image = outputs.logits_per_image  # image-text similarity
probs = logits_per_image.softmax(dim=1)      # normalize to probabilities

print(f"Probabilities: {probs}")