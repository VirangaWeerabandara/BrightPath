import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../assets/background2.png';
import logo from '../assets/logo.png';
import ProductCard from '../components/productCard';
import { FaChevronLeft, FaChevronRight, FaUserCircle } from 'react-icons/fa';
import { Button } from 'flowbite-react';
import { useEffect, useRef } from 'react';
import { SignInForm } from '../components/signInForm';
import { useCourses } from '../hooks/useCourses';
import { useEnrolledCourses } from '../hooks/useEnrolledCourses';




const MyLearningPage = () => {  
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");   
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [openModal, setOpenModal] = useState(false);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const { courses = [], loading, error } = useEnrolledCourses();

              
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
          {loading ? (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-gray-600">Loading your courses...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-red-600">Error: {error}</p>
            </div>
          ) : courses?.length === 0 ? ( // Add optional chaining
            <div className="col-span-full text-center py-10">
              <div className="space-y-4">
                <p className="text-lg text-gray-600">You haven't enrolled in any courses yet</p>
                <Button
                  onClick={() => navigate('/courses')}
                  gradientDuoTone="purpleToBlue"
                >
                  Browse Courses
                </Button>
              </div>
            </div>
          ) : (
            courses?.map((course) => ( // Add optional chaining
              <ProductCard
                key={course._id}
                imageUrl={course.thumbnails?.[0]} // Add optional chaining
                courseName={course.name}
                category={course.category}
                _id={course._id}
                description={course.description}
                onClick={() => navigate(`/course/${course._id}`)}
              />
            ))
          )}
          </div>
    </div>
</section>
</>
    )
}
export default MyLearningPage;