import React from "react";
import { motion } from "framer-motion";
import defaultThumbnail from "../assets/default-course-thumbnail.png"; // Add a default thumbnail image

interface ProductCardProps {
  imageUrl?: string;
  courseName: string;
  category: string;
  description: string;
  _id: string;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  courseName,
  category,
  onClick,
}) => {
  return (
    <motion.div
      className="group relative cursor-pointer"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="aspect-square overflow-hidden rounded-lg shadow-md transition-shadow duration-300 group-hover:shadow-xl">
        <motion.img
          className="size-full object-cover"
          src={imageUrl || defaultThumbnail}
          alt={courseName}
          onError={(e) => {
            e.currentTarget.src = defaultThumbnail;
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <motion.div
        className="absolute left-3 top-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="rounded-full bg-white px-1.5 py-1 text-[8px] font-bold uppercase tracking-wide text-gray-900 shadow-sm sm:px-3 sm:py-1.5 sm:text-xs">
          {category}
        </p>
      </motion.div>
      <div className="mt-4 flex items-start justify-between space-x-4">
        <div>
          <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
            <button
              type="button"
              className="text-left text-xs font-bold text-gray-900 sm:text-sm md:text-base"
              title={courseName}
            >
              {courseName}
              <span className="absolute inset-0" aria-hidden="true"></span>
            </button>
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
