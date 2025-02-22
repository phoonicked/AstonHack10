import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { AiFillHome, AiOutlinePlus, AiOutlineUser } from "react-icons/ai";
import { db } from "./lib/firebase";
import "./App.css";

const dbCategories = ["shirts", "pants", "hoodies", "jackets", "polos", "sweatshirts"];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(dbCategories[0]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleTakePhoto = () => {
    const videoElement = document.createElement('video');
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
        videoElement.play();
      })
      .catch((error) => {
        alert('Error accessing camera: ' + error.message);
      });
  };

  const handleUploadPhoto = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();
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
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add a Photo</h2>
            <button className="popup-btn" onClick={handleTakePhoto}>Take a Photo</button>
            <button className="popup-btn" onClick={handleUploadPhoto}>Upload a Photo</button>
            <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Camera Popup */}
      {showCameraPopup && (
        <div className="popup-overlay" onClick={() => setShowCameraPopup(false)}>
          <div className="camera-popup">
            <video ref={videoRef} className="camera-preview" autoPlay></video>
            <canvas ref={canvasRef} width="300" height="200" style={{ display: "none" }}></canvas>
            <button className="popup-btn" onClick={handleCapturePhoto}>Capture Photo</button>
            <button className="close-btn" onClick={() => setShowCameraPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
