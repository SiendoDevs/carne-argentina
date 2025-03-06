// components/CategoryTabs.tsx

import React from "react";

interface CategoryTabsProps {
  activeCategory: string;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  setActiveCategory,
}) => {
  const categories = ["Novillos", "Novillitos", "Vaquillonas", "Vacas"];

  return (
    <div className="mb-6">
      <ul className="flex space-x-4">
        {categories.map((categoria) => (
          <li
            key={categoria}
            className={`cursor-pointer ${
              activeCategory === categoria
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveCategory(categoria)}
          >
            {categoria}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryTabs;
