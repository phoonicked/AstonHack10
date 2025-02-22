import { useState } from 'react';
import './App.css';

const categories = ['Shirt', 'Hoodie', 'Jeans', 'Jacket', 'Polo', 'Sweatshirt'];
const items = [
  { id: 1, category: 'Shirt', image: 'https://raven.contrado.app/resources/images/2020-10/155441/personalised-photo-tshirt1527448_l.jpeg?w=1200&h=1200&q=80&auto=format&fit=crop' },
  { id: 2, category: 'Shirt', image: 'https://raven.contrado.app/resources/images/2020-10/155441/personalised-photo-tshirt1527448_l.jpeg?w=1200&h=1200&q=80&auto=format&fit=crop' },
  { id: 3, category: 'Jeans', image: '' },
  { id: 4, category: 'Sweatshirt', image: '' },
  { id: 5, category: 'Polo', image: '' },
  { id: 6, category: 'Sweatshirt', image: '' },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <div className="wardrobe-container">
      <header className="wardrobe-header">My Wardrobe</header>
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
        {items
          .filter((item) => item.category === selectedCategory)
          .map((item) => (
            <div key={item.id} className="item-card">
              <img src={item.image} alt={item.category} className="item-image" />
            </div>
          ))}
      </div>
      <div className="bottom-navbar">
        <button className="add-item-btn">Add Item</button>
      </div>
    </div>
  );
}