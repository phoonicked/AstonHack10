import { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { AiOutlineHome, AiOutlinePlus, AiOutlineUser, AiOutlineMessage, AiOutlineCloudUpload, AiOutlineCamera } from "react-icons/ai";
import { db, storage } from "./lib/firebase";
import "./App.css";

const dbCategories = ["shirts", "pants", "hoodies", "jackets", "polos", "sweatshirts"];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(dbCategories[0]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadClosing, setIsUploadClosing] = useState(false);
  const [showCameraPopup, setShowCameraPopup] = useState(false);
  const [videoStream, setVideoStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleOpenCamera = async () => {
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setVideoStream(stream);
      }
      setShowCameraPopup(true);
    } catch (error){
      alert('Error accessing camera: ' + error.message);
    }
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if(!blob) return;

      const imageRef = ref(storage, 'images/' + Date.now() + '.jpg');
      await uploadBytes(imageRef, blob);

      const imageUrl = await getDownloadURL(imageRef);
      await addDoc(collection(db, "shirts"), {image: imageUrl});

      if(videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
      }
      alert ('Photo uploaded successfully');
      setShowCameraPopup(false);
    }, 'image/jpeg');
  };

  const handleUploadPhoto = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();
  };

  const closePopup = () => {
    setIsUploadClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsUploadClosing(false);
    }, 300); // Match animation duration
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      console.log("Files dropped:", files);
    }
  };


  useEffect(() => {
    const fetchAllCollections = async () => {
      let allItems = [];
      let allCategories = [];

      for (const collectionName of dbCategories) {
        try {
          const querySnapshot = await getDocs(collection(db, collectionName));

          const collectionItems = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            category: collectionName,
            name: doc.data().name || "Unnamed Item",
            description: doc.data().description || "No description available",
            colour: doc.data().colour || "Unknown",
            image: doc.data().image || "",
          }));

          if (collectionItems.length > 0) {
            allCategories.push(collectionName);
          }

          allItems = [...allItems, ...collectionItems];
        } catch (error) {
          console.error(`Error fetching collection ${collectionName}:`, error);
        }
      }

      setItems(allItems);
      setCategories(allCategories);
      setSelectedCategory(allCategories[0] || "");
    };

    fetchAllCollections();
  }, []);

  return (
    <div className="wardrobe-container">
      <header className="wardrobe-header">My Wardrobe</header>

      <div className="main-content">
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {items.length > 0 ? (
          <div className="item-grid">
            {items
              .filter((item) => item.category === selectedCategory)
              .map((item) => (
                <div key={item.id} className="item-card">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="item-image" />
                  ) : (
                    <div className="placeholder">No Image</div>
                  )}
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="empty-category">
            <p>No items in this category</p>
          </div>
        )}
      </div>

      <div className="bottom-navbar">
        <button className="nav-btn"><AiOutlineHome size={30} /></button>
        <button className="nav-btn" onClick={() => setShowPopup(true)}><AiOutlinePlus size={30} /></button>
        <button className="nav-btn"><AiOutlineMessage size={30} /></button>
        <button className="nav-btn"><AiOutlineUser size={30} /></button>
      </div>

      {showPopup && (
        <div className={`popup-overlay ${isUploadClosing ? "closing" : ""}`} onClick={closePopup}>
          <div className={`popup-content ${isUploadClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}>
            <div
              className={`upload-box ${isDragging ? "dragging" : ""}`}
              onDragEnter={handleDragStart}
              onDragOver={handleDragStart}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <AiOutlineCloudUpload className="upload-icon" />
              <p className="upload-text">Drag & drop your files here or</p>
              <button className="upload-btn">Choose files</button>
            </div>

            {/* Take Photo Button */}
            <button className="take-photo-btn" onClick={handleTakePhoto}>
              <AiOutlineCamera className="camera-icon" /> Take a Photo
            </button>
          </div>
        </div>
      )}

      {/* Camera Popup */}
      {showCameraPopup && (
        <div className="popup-overlay" onClick={() => setShowCameraPopup(false)}>
          <div className="camera-popup">
            <video ref={videoRef} className="camera-preview" autoPlay></video>
            <canvas ref={canvasRef} width="300" height="200" style={{ display: "none" }}></canvas>
            <button className="popup-btn" onClick={handleTakePhoto}>Capture Photo</button>
            <button className="close-btn" onClick={() => setShowCameraPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
