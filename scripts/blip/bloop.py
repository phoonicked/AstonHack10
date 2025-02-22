from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image

# Load the BLIP model and processor
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# Load an example image
image = Image.open('blur.webp')

# Provide a refined guiding prompt
prompt = "Description specifying item, color, type, pattern: clothing, "

# Generate a guided caption with improved parameters
inputs = processor(images=image, text=prompt, return_tensors="pt")
out = model.generate(
    **inputs, 
    max_new_tokens=140,
    # num_beams=5,
    early_stopping=True,
    repetition_penalty=1.2  # Adjust as needed
)
caption = processor.decode(out[0], skip_special_tokens=True)

print(f"Generated Caption: {caption}")
