import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../assets/background2.png';
import logo from '../assets/logo.png';
import ProductCard from '../components/productCard';
import { FaChevronLeft, FaChevronRight, FaUserCircle } from 'react-icons/fa';
import { Button } from 'flowbite-react';
import { useEffect, useRef } from 'react';
import { SignInForm } from '../components/signInForm';


const COURSE_CATEGORIES = [
    "All",
    "Programming",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Design",
    "Business",
    "Marketing",
    "Music",
    "Photography",
    "dasds",
    "dasds",
    "dasds",
    "dasds",
    "dasds",
    "dasds",
  ];

const MyLearningPage = () => {  
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");   
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [openModal, setOpenModal] = useState(false);
    const emailInputRef = useRef<HTMLInputElement>(null);
              
    const scrollCategories = (direction: 'left' | 'right') => {
        const container = document.getElementById('categories-container');
        if (container) {
            const scrollAmount = 200;
            const scrollTo = direction === 'left' 
                ? container.scrollLeft - scrollAmount 
                : container.scrollLeft + scrollAmount;
            container.scrollTo({
                left: scrollTo,
                behavior: 'smooth'
            });
        }
    };

    const handleSignInSuccess = (userData: any) => {
        setUser(userData);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
        <section  className="h-[2048px] bg-white bg-cover   sm:h-[512px]  md:h-[1024px] lg:h-[2048px] " style={{backgroundImage: `url(${background})`}}>
        <div className="sticky top-0 z-50 bg-transparent backdrop-blur-lg border-b border-transparent">
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between space-x-4">
                {/* Logo and Name */}
                <div 
                    className="flex items-center space-x-2 cursor-pointer" 
                    onClick={() => navigate('/')}
                >
                    <img src={logo} alt="BrightPath Logo" className="h-8 w-8" />
                    <span className="text-xl font-bold text-gray-900">BrightPath</span>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-2xl mx-4">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-300/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/90 transition-colors duration-200"
                    />
                </div>
                <div>
                {user ? (
    <div className="relative" ref={dropdownRef}>
        <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
            <FaUserCircle className="w-8 h-8 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">
                {user.firstName}
            </span>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                <button
                    onClick={() => {
                        navigate('/my-learning');
                        setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100/80 flex items-center space-x-2"
                >
                    <span>My Learning</span>
                </button>
                <button
                    onClick={() => {
                        navigate('/settings');
                        setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100/80 flex items-center space-x-2"
                >
                    <span>Settings</span>
                </button>
                <hr className="my-1 border-gray-200" />
                <button
                    onClick={() => {
                        // Add your logout logic here
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        setUser(null);
                        navigate('/');
                        setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100/80 flex items-center space-x-2"
                >
                    <span>Logout</span>
                </button>
            </div>
        )}
    </div>
) : (
    <>
        <Button
            onClick={() => setOpenModal(true)}
            outline gradientDuoTone="purpleToBlue" className='w-24 text-lg font-bold'
        >
            Login
        </Button>
        <SignInForm
            openModal={openModal}
            setOpenModal={setOpenModal}
            emailInputRef={emailInputRef}
            onSignInSuccess={handleSignInSuccess}
            
        />
    </>
)}
       
    </div>
            </div>
        </div>
    </div>
<div className="mx-auto max-w-8xl px-4 sm:px-4 lg:px-4 py-2">
    <div className="relative px-10">
        {/* Left scroll button */}
        <button 
            onClick={() => scrollCategories('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white/90 transition-all"
        >
            <FaChevronLeft className="text-gray-700" />
        </button>

        {/* Categories container */}
        <div 
            id="categories-container"
            className="flex items-center justify-start space-x-2 overflow-x-hidden px-8"
        >
            {COURSE_CATEGORIES.map((category) => (
                <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                        px-6 py-2 rounded-lg whitespace-nowrap transition-all duration-200
                        ${selectedCategory === category 
                            ? 'bg-primary-600 text-white font-semibold shadow-lg'
                            : 'bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-700 hover:text-gray-900'
                        }
                    `}
                >
                    {category}
                </button>
            ))}
        </div>

        {/* Right scroll button */}
        <button 
            onClick={() => scrollCategories('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white/90 transition-all"
        >
            <FaChevronRight className="text-gray-700" />
        </button>
    </div>
</div>
    <div className="mx-auto max-w-7.5xl px-2 sm:px-4 lg:px-6">
    <div className="mx-auto max-w-md text-center">
    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        {selectedCategory} Courses
    </h2>
    <p className="mt-4 text-base font-normal leading-7 text-gray-600">
        Explore our {selectedCategory.toLowerCase()} courses and start learning today
    </p>
</div>

        <div className="mt-10 grid grid-cols-2 gap-6 lg:mt-16 lg:grid-cols-4 lg:gap-4">
            <div className="group relative">
                <div className="aspect-w-1 aspect-h-1 overflow-hidden">
                    <img className="size-full object-cover transition-all duration-300 group-hover:scale-125" src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-1.png" alt="" />
                </div>
                <div className="absolute left-3 top-3">
                    <p className="rounded-full bg-white px-1.5 py-1 text-[8px] font-bold uppercase tracking-wide text-gray-900 sm:px-3 sm:py-1.5 sm:text-xs">New</p>
                </div>
                <div className="mt-4 flex items-start justify-between space-x-4">
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                            <button type="button" className="text-left text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                                Beoplay M5 Bluetooth Speaker
                                <span className="absolute inset-0" aria-hidden="true"></span>
                            </button>
                        </h3>
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">$99.00</p>
                    </div>
                </div>
            </div>

            <div className="group relative">
                <div className="aspect-w-1 aspect-h-1 overflow-hidden">
                    <img className="size-full object-cover transition-all duration-300 group-hover:scale-125" src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-2.png" alt="" />
                </div>
                <div className="mt-4 flex items-start justify-between space-x-4">
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                            <button type="button" className="text-left text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                                Apple Smart Watch 6 - Special Edition
                                <span className="absolute inset-0" aria-hidden="true"></span>
                            </button>
                        </h3>
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">$299.00</p>
                    </div>
                </div>
            </div>

            <div className="group relative">
                <div className="aspect-w-1 aspect-h-1 overflow-hidden">
                    <img className="size-full object-cover transition-all duration-300 group-hover:scale-125" src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-2.png" alt="" />
                </div>
                <div className="mt-4 flex items-start justify-between space-x-4">
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

            <div className="group relative">
                <div className="aspect-w-1 aspect-h-1 overflow-hidden">
                    <img className="size-full object-cover transition-all duration-300 group-hover:scale-125" src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png" alt="" />
                </div>
                <div className="absolute left-3 top-3">
                    <p className="rounded-full bg-gray-900 px-1.5 py-1 text-[8px] font-bold uppercase tracking-wide text-white sm:px-3 sm:py-1.5 sm:text-xs">Sale</p>
                </div>
                <div className="mt-4 flex items-start justify-between space-x-4">
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                            <button type="button" className="text-left text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                                Beylob 90 Speaker
                                <span className="absolute inset-0" aria-hidden="true"></span>
                            </button>
                        </h3>
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">$49.00</p>
                        <del className="mt-0.5 text-xs font-bold text-gray-500 sm:text-sm"> $99.00 </del>
                    </div>
                </div>
            </div>

            <div className="group relative">
                <div className="aspect-w-1 aspect-h-1 overflow-hidden">
                    <img className="size-full object-cover transition-all duration-300 group-hover:scale-125" src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-4.png" alt="" />
                </div>
                <div className="mt-4 flex items-start justify-between space-x-4">
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                            <button type="button" className="text-left text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                                Martino 75 Bluetooth
                                <span className="absolute inset-0" aria-hidden="true"></span>
                            </button>
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
</>
    )
}
export default MyLearningPage;