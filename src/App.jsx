import { useState } from 'react';
import { AiFillHome, AiOutlinePlus, AiOutlineUser } from 'react-icons/ai';
import './App.css';

const categories = ['Shirt', 'Hoodie', 'Jeans', 'Jacket', 'Polo', 'Sweatshirt'];
const items = [
  { id: 1, category: 'Shirt', image: 'https://raven.contrado.app/resources/images/2020-10/155441/personalised-photo-tshirt1527448_l.jpeg?w=1200&h=1200&q=80&auto=format&fit=crop' },
  { id: 2, category: 'Shirt', image: 'https://raven.contrado.app/resources/images/2020-10/155441/personalised-photo-tshirt1527448_l.jpeg?w=1200&h=1200&q=80&auto=format&fit=crop' },
  { id: 3, category: 'Shirt', image: 'https://raven.contrado.app/resources/images/2020-10/155441/personalised-photo-tshirt1527448_l.jpeg?w=1200&h=1200&q=80&auto=format&fit=crop' },
  { id: 4, category: 'Shirt', image: 'https://raven.contrado.app/resources/images/2020-10/155441/personalised-photo-tshirt1527448_l.jpeg?w=1200&h=1200&q=80&auto=format&fit=crop' },
  { id: 5, category: 'Shirt', image: 'https://raven.contrado.app/resources/images/2020-10/155441/personalised-photo-tshirt1527448_l.jpeg?w=1200&h=1200&q=80&auto=format&fit=crop' },
  { id: 6, category: 'Shirt', image: 'https://raven.contrado.app/resources/images/2020-10/155441/personalised-photo-tshirt1527448_l.jpeg?w=1200&h=1200&q=80&auto=format&fit=crop' },
  { id: 7, category: 'Jeans', image: '' },
  { id: 8, category: 'Sweatshirt', image: '' },
  { id: 9, category: 'Polo', image: '' },
  { id: 10, category: 'Sweatshirt', image: '' },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
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
  const filteredItems = items.filter((item) => item.category === selectedCategory);

  return (
    <div className="wardrobe-container">
      <header className="wardrobe-header">My Wardrobe</header>
      <div className="main-content">
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="item-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="item-card">
                {item.image ? (
                  <img src={item.image} alt={item.category} className="item-image" />
                ) : (
                  <div className="placeholder">No Image</div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-category">
              <p className="empty-category-text">No items in this category</p>
            </div>
          )}
        </div>
      </div>
      <div className="bottom-navbar">
        <button className="nav-btn"><AiFillHome size={30} /></button>
        <button className="nav-btn" onClick={() => setShowPopup(true)}><AiOutlinePlus size={30} /></button>
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
    </div>
  );
}