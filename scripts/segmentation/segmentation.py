import cv2
import numpy as np
from detectron2.config import get_cfg
from detectron2.engine import DefaultPredictor
from detectron2 import model_zoo
from detectron2.utils.visualizer import Visualizer
from detectron2.data import MetadataCatalog

# COCO class names (indexed by class ID, with index 0 as background)
COCO_INSTANCE_CATEGORY_NAMES = [
    'person', 'bicycle', 'car', 'motorcycle', 'airplane', 
    'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant',
    'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse',
    'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack',
    'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard',
    'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard',
    'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife',
    'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli',
    'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
    'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse',
    'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster',
    'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear',
    'hair drier', 'toothbrush'
]

# Define the classes you want to keep
desired_classes = ["person", "dog"]

# ----- Set Up the Model -----
cfg = get_cfg()
# Load config file and weights for Mask R-CNN with a ResNet-50 backbone trained on COCO.
cfg.merge_from_file(model_zoo.get_config_file("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml"))
cfg.MODEL.WEIGHTS = model_zoo.get_checkpoint_url("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml")
cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.5  # set threshold for this model
cfg.MODEL.DEVICE = "cpu"  # Force CPU usage

predictor = DefaultPredictor(cfg)

# ----- Load an Image -----
# Update the image_path to point to your image file.
image_path = r"image.jpg"  
print("Loading image from:", image_path)
im = cv2.imread(image_path)
if im is None:
    raise FileNotFoundError(f"Image not found at path: {image_path}")

# ----- Run Inference -----
outputs = predictor(im)
instances = outputs["instances"]

# ----- Filter Predictions -----
# Get the predicted class indices as a numpy array.
pred_classes = instances.pred_classes.cpu().numpy()

# Create a boolean mask: True if the detected class is in the desired_classes list.
mask = np.array([COCO_INSTANCE_CATEGORY_NAMES[i] in desired_classes for i in pred_classes])
print(pred_classes)
print(mask)

filtered_instances = instances[mask]

# ----- Visualize the Filtered Results -----
# Optionally, you can use metadata from the training dataset; if not available, leave as None.
metadata = MetadataCatalog.get(cfg.DATASETS.TRAIN[0]) if cfg.DATASETS.TRAIN else None
v = Visualizer(im[:, :, ::-1], metadata=metadata, scale=1.2)
out = v.draw_instance_predictions(filtered_instances.to("cpu"))

# Display the image with filtered predictions.
cv2.imshow("Filtered Predictions", out.get_image()[:, :, ::-1])
cv2.waitKey(0)
cv2.destroyAllWindows()
