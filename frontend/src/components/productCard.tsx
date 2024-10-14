import React from 'react';

interface ProductCardProps {
  imageUrl: string;
  productName: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ imageUrl, productName, price }) => {
  return (
    <div className="relative group">
      <div className="overflow-hidden aspect-w-1 aspect-h-1">
        <img
          className="object-cover w-full h-full transition-all duration-300 group-hover:scale-125"
          src={imageUrl}
          alt={productName}
        />
      </div>
      <div className="flex items-start justify-between mt-4 space-x-4">
        <div>
          <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
            <a href="#" title={productName}>
              {productName}
              <span className="absolute inset-0" aria-hidden="true"></span>
            </a>
          </h3>
        </div>

        <div className="text-right">
          <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">${price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
