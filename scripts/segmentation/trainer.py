import kagglehub

# Download latest version
path = kagglehub.dataset_download("thusharanair/deepfashion2-original-with-dataframes", force_download=True)

print("Path to dataset files:", path)