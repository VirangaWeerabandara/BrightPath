import React from "react";
import defaultThumbnail from "../assets/default-course-thumbnail.png"; // Add a default thumbnail image

interface ProductCardProps {
  imageUrl: string;
  courseName: string;
  category: string;
  _id: string;
  description: string;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  courseName,
  category,
  _id,
  description,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg"
    >
      <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
        <img
          src={imageUrl || "/default-course-thumbnail.png"} // Add a default thumbnail
          alt={courseName}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{courseName}</h3>
        <p className="mt-1 text-sm text-gray-500">{category}</p>
      </div>
    </div>
  );
};

export default ProductCard;
