import openai
from PIL import Image
import base64
import requests
import io

# OpenAI API Key (replace with your own)
OPENAI_API_KEY = "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"

def encode_image(image_path):
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode("utf-8")

def generate_clothing_description(image_path):
    image_base64 = encode_image(image_path)
    
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    prompt = "Describe this clothing item in detail (using telepgrahic speech), including its color, type, sub-type and any patterns."

    data = {
        "model": "gpt-4-turbo",
        "messages": [
            {"role": "system", "content": "You are an AI which uses telegraphic speech to assign a concise description to a clothing item such that it can be uniquely identified by the CLIP AI model by openAI"},
            {"role": "user", "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": { "url" : f"data:image/jpeg;base64,{image_base64}"}}
            ]}
        ],
        "max_tokens": 200
    }
    
    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        return f"Error: {response.status_code}, {response.text}"

# Example usage
image_path = "jeans.jpg"  # Change to the path of your clothing image
description = generate_clothing_description(image_path)
print("Generated Clothing Description:", description)
