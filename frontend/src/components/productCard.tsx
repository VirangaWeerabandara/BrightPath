import React from 'react';

interface ProductCardProps {
  imageUrl: string;
  courseName: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ imageUrl, courseName, category }) => {
  return (
    <div className="group relative">
      <div className="aspect-square overflow-hidden">
        <img
          className="size-full object-cover transition-all duration-300 group-hover:scale-125"
          src={imageUrl}
          alt={courseName}
        />
      </div>
      <div className="absolute left-3 top-3">
        <p className="rounded-full bg-white px-1.5 py-1 text-[8px] font-bold uppercase tracking-wide text-gray-900 sm:px-3 sm:py-1.5 sm:text-xs">
          {category}
        </p>
      </div>
      <div className="mt-4 flex items-start justify-between space-x-4">
        <div>
          <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
            <button type="button" className="text-left text-xs font-bold text-gray-900 sm:text-sm md:text-base" title={courseName}>
              {courseName}
              <span className="absolute inset-0" aria-hidden="true"></span>
            </button>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;