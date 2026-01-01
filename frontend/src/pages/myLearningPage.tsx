import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import background from "../assets/background2.png";
import logo from "../assets/logo.png";
import ProductCard from "../components/productCard";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";
import { Button } from "flowbite-react";
import { useEffect, useRef } from "react";
import { SignInForm } from "../components/signInForm";
import { useEnrolledCourses } from "../hooks/useEnrolledCourses";
import SettingsCard from "../components/SettingsCard";
import {
  PageTransition,
  containerVariants,
  itemVariants,
} from "../components/pageTransition";

const MyLearningPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );
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
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <PageTransition>
      <section
        className="h-[2048px] bg-white bg-cover   sm:h-[512px]  md:h-[1024px] lg:h-[2048px] "
        style={{ backgroundImage: `url(${background})` }}
      >
        <motion.div
          className="sticky top-0 z-50 border-b border-transparent bg-transparent backdrop-blur-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="max-w-8xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between space-x-4">
              {/* Logo and Name */}
              <div
                className="flex cursor-pointer items-center space-x-2"
                onClick={() => navigate("/")}
              >
                <img src={logo} alt="BrightPath Logo" className="h-8 w-8" />
                <span className="text-xl font-bold text-gray-900">
                  BrightPath
                </span>
              </div>

              {/* Search Bar */}
              <div className="mx-4 max-w-2xl flex-1">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="focus:ring-primary-500 w-full rounded-md border border-gray-300/50 bg-white/70 px-4 py-2 backdrop-blur-sm transition-colors duration-200 focus:bg-white/90 focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <div
                      className="flex cursor-pointer items-center space-x-2"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <FaUserCircle className="h-8 w-8 text-gray-700" />
                      <span className="text-sm font-medium text-gray-700">
                        {user.firstName}
                      </span>
                    </div>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg bg-white py-1 shadow-lg">
                        <button
                          onClick={() => {
                            navigate("/my-learning");
                            setIsDropdownOpen(false);
                          }}
                          className="flex w-full items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100/80"
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
                            localStorage.removeItem("user");
                            localStorage.removeItem("token");
                            setUser(null);
                            navigate("/");
                            setIsDropdownOpen(false);
                          }}
                          className="flex w-full items-center space-x-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100/80"
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
                      outline
                      gradientDuoTone="purpleToBlue"
                      className="w-24 text-lg font-bold"
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
        </motion.div>

        <motion.div
          className="max-w-8xl mx-auto mt-2 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative mb-10 flex items-center justify-between">
            <motion.div
              onClick={() => navigate("/courses")}
              className="group flex cursor-pointer items-center"
              whileHover={{ x: -5 }}
              transition={{ duration: 0.2 }}
            >
              <FaArrowLeft className="h-6 w-6 text-gray-600 transition-colors duration-200 group-hover:text-primary-600" />
              <span className="ml-2 text-gray-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Browse Courses
              </span>
            </motion.div>
            <div className="absolute left-1/2 -translate-x-1/2 transform">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                My Courses
              </h2>
            </div>
          </div>
        </motion.div>
        <div className="mx-auto max-w-7.5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mt-10 grid grid-cols-2 gap-6 lg:mt-16 lg:grid-cols-4 lg:gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {loading ? (
              <div className="col-span-full py-10 text-center">
                <p className="text-lg text-gray-600">Loading your courses...</p>
              </div>
            ) : error ? (
              <div className="col-span-full py-10 text-center">
                <p className="text-lg text-red-600">Error: {error}</p>
              </div>
            ) : courses?.length === 0 ? (
              <div className="col-span-full py-10 text-center">
                <div className="space-y-4">
                  <p className="text-lg text-gray-600">
                    You haven't enrolled in any courses yet
                  </p>
                  <motion.div
                    className="flex justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => navigate("/courses")}
                      className="hover:bg-primary-700 focus:ring-primary-400 rounded-full bg-primary-600 px-6 py-2 font-semibold text-white shadow-lg transition-colors duration-150 focus:ring-2"
                    >
                      Browse Courses
                    </Button>
                  </motion.div>
                </div>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="col-span-full py-10 text-center">
                <p className="text-lg text-gray-600">
                  No courses match your search "{searchQuery}"
                </p>
              </div>
            ) : (
              filteredCourses.map((course) => (
                <motion.div key={course._id} variants={itemVariants}>
                  <ProductCard
                    imageUrl={course.thumbnails?.[0]}
                    courseName={course.name}
                    category={course.category}
                    _id={course._id}
                    description={course.description}
                    onClick={() => navigate(`/course/${course._id}`)}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
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
    </PageTransition>
  );
};
export default MyLearningPage;
