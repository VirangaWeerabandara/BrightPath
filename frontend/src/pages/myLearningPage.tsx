import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../assets/background2.png';
import logo from '../assets/logo.png';
import ProductCard from '../components/productCard';
import { FaUserCircle,FaArrowLeft } from 'react-icons/fa';
import { Button } from 'flowbite-react';
import { useEffect, useRef } from 'react';
import { SignInForm } from '../components/signInForm';
import { useEnrolledCourses } from '../hooks/useEnrolledCourses';
import SettingsCard from '../components/SettingsCard';




const MyLearningPage = () => {  
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [openModal, setOpenModal] = useState(false);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const { courses = [], loading, error } = useEnrolledCourses();
    const [showSettings, setShowSettings] = useState(false);

    const handleSignInSuccess = (userData: any) => {
        setUser(userData);
    };

    const handleProfileUpdate = (userData: any) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      };

    const filteredCourses = courses.filter(course => 
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

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
    setShowSettings(true);
    setIsDropdownOpen(false);
  }}
  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100/80"
>
  Settings
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

    <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 mt-2">
    <div className="flex items-center justify-between mb-10 relative">
        <div 
            onClick={() => navigate('/courses')}
            className="flex items-center cursor-pointer group"
        >
            <FaArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors duration-200" />
            <span className="ml-2 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Browse Courses
            </span>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                My Courses
            </h2>
        </div>
    </div>
</div>
<div className="mx-auto max-w-7.5xl px-4 sm:px-6 lg:px-8">
<div className="mt-10 grid grid-cols-2 gap-6 lg:mt-16 lg:grid-cols-4 lg:gap-4">
  {loading ? (
    <div className="col-span-full text-center py-10">
      <p className="text-lg text-gray-600">Loading your courses...</p>
    </div>
  ) : error ? (
    <div className="col-span-full text-center py-10">
      <p className="text-lg text-red-600">Error: {error}</p>
    </div>
  ) : courses?.length === 0 ? (
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
  ) : filteredCourses.length === 0 ? (
    <div className="col-span-full text-center py-10">
      <p className="text-lg text-gray-600">
        No courses match your search "{searchQuery}"
      </p>
    </div>
  ) : (
    filteredCourses.map((course) => (
      <ProductCard
        key={course._id}
        imageUrl={course.thumbnails?.[0]}
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
    {user && (
  <SettingsCard
    show={showSettings}
    onClose={() => setShowSettings(false)}
    user={user}
    onUpdateSuccess={handleProfileUpdate}
  />
)}
</section>
</>
    )
}
export default MyLearningPage;