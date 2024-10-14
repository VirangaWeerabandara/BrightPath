import React, { useState } from 'react';
import background from '../assets/background2.png';
import ProductCard from '../components/productCard';

const CoursePage = () => {        
    return (
        <section  className="h-[2656px] sm:h-[512px] md:h-[1024px] lg:h-[2048px]  py-12 bg-white bg-cover sm:py-16 lg:py-20" style={{backgroundImage: `url(${background})`}}>
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Our featured items</h2>
            <p className="mt-4 text-base font-normal leading-7 text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus faucibus massa dignissim tempus.</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-10 lg:mt-16 lg:grid-cols-4 lg:gap-4">
            <div className="relative group">
                <div className="overflow-hidden aspect-w-1 aspect-h-1">
                    <img className="object-cover w-full h-full transition-all duration-300 group-hover:scale-125" src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-1.png" alt="" />
                </div>
                <div className="absolute left-3 top-3">
                    <p className="rounded-full bg-white px-1.5 py-1 text-[8px] font-bold uppercase tracking-wide text-gray-900 sm:px-3 sm:py-1.5 sm:text-xs">New</p>
                </div>
                <div className="flex items-start justify-between mt-4 space-x-4">
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                            <a href="#" title="">
                                Beoplay M5 Bluetooth Speaker
                                <span className="absolute inset-0" aria-hidden="true"></span>
                            </a>
                        </h3>
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">$99.00</p>
                    </div>
                </div>
            </div>

            <div className="relative group">
                <div className="overflow-hidden aspect-w-1 aspect-h-1">
                    <img className="object-cover w-full h-full transition-all duration-300 group-hover:scale-125" src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-2.png" alt="" />
                </div>
                <div className="flex items-start justify-between mt-4 space-x-4">
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                            <a href="#" title="">
                                Apple Smart Watch 6 - Special Edition
                                <span className="absolute inset-0" aria-hidden="true"></span>
                            </a>
                        </h3>
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">$299.00</p>
                    </div>
                </div>
            </div>

            <div className="relative group">
                <div className="overflow-hidden aspect-w-1 aspect-h-1">
                    <img className="object-cover w-full h-full transition-all duration-300 group-hover:scale-125" src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-2.png" alt="" />
                </div>
                <div className="flex items-start justify-between mt-4 space-x-4">
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                            <a href="#" title="">
                                Apple Smart Watch 6 - Special Edition
                                <span className="absolute inset-0" aria-hidden="true"></span>
                            </a>
                        </h3>
                        
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">$299.00</p>
                    </div>
                </div>
            </div>

            <div>
                <ProductCard
                    imageUrl="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-2.png"
                    productName="Apple Smart Watch 8 - Special Edition"
                    price={299.00}
                />
            </div>

            <div>
                <ProductCard
                    imageUrl="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-2.png"
                    productName="Apple Smart Watch 8 - Special Edition"
                    price={299.00}
                />
            </div>

            <div className="relative group">
                <div className="overflow-hidden aspect-w-1 aspect-h-1">
                    <img className="object-cover w-full h-full transition-all duration-300 group-hover:scale-125" src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png" alt="" />
                </div>
                <div className="absolute left-3 top-3">
                    <p className="rounded-full bg-gray-900 px-1.5 py-1 text-[8px] font-bold uppercase tracking-wide text-white sm:px-3 sm:py-1.5 sm:text-xs">Sale</p>
                </div>
                <div className="flex items-start justify-between mt-4 space-x-4">
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                            <a href="#" title="">
                                Beylob 90 Speaker
                                <span className="absolute inset-0" aria-hidden="true"></span>
                            </a>
                        </h3>
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">$49.00</p>
                        <del className="mt-0.5 text-xs font-bold text-gray-500 sm:text-sm"> $99.00 </del>
                    </div>
                </div>
            </div>

            <div className="relative group">
                <div className="overflow-hidden aspect-w-1 aspect-h-1">
                    <img className="object-cover w-full h-full transition-all duration-300 group-hover:scale-125" src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-4.png" alt="" />
                </div>
                <div className="flex items-start justify-between mt-4 space-x-4">
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                            <a href="#" title="">
                                Martino 75 Bluetooth
                                <span className="absolute inset-0" aria-hidden="true"></span>
                            </a>
                        </h3>
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">$79.00</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

    )
}
export default CoursePage;