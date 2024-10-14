import React from 'react';

interface ProductCardProps {
  imageUrl: string;
  productName: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ imageUrl, productName, price }) => {
  return (
    <div className="group relative">
      <div className="aspect-square overflow-hidden">
        <img
          className="size-full object-cover transition-all duration-300 group-hover:scale-125"
          src={imageUrl}
          alt={productName}
        />
      </div>
      <div className="mt-4 flex items-start justify-between space-x-4">
        <div>
          <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
            <button type="button" className="text-left text-xs font-bold text-gray-900 sm:text-sm md:text-base" title={productName}>
              {productName}
              <span className="absolute inset-0" aria-hidden="true"></span>
            </button>
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
