import React, { useState,useEffect } from "react";
import "./index.css";
import all from "../../assets/category/all.png";
import pasta from "../../assets/category/pasta.png";
import korean from "../../assets/category/korean.png";
import chinese from  "../../assets/category/chinese.png"
import japanese from "../../assets/category/japanese.png";
import bunsik from "../../assets/category/bunsik.png";


export default function Category({ onSelectedCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(0);

  const handleCategorySelection = (categoryId) => {
    setSelectedCategory(categoryId);
    onSelectedCategory(categoryId);
  };

  useEffect(() => {
    // filterClassList();
    onSelectedCategory (selectedCategory);
  },[selectedCategory]);

  const categories = [
    { id: 0, label: "모두", image: all },
    { id: 1, label: "한식", image: korean },
    { id: 2, label: "양식", image: pasta },
    { id: 3, label: "중식", image: chinese },
    { id: 4, label: "일식", image: japanese },
    { id: 5, label: "분식", image: bunsik },
  ];
  return(
    <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category.id}
            id="btn"
            className={selectedCategory === category.id ? "selected" : ""}
            onClick={() => handleCategorySelection(category.id)}
          >
            <img className="category-img" src={category.image}></img>
            <div className="label">{category.label}</div>
          </button>
        ))}
      </div>
  );
}