import { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/background2.png";
import logo from "../assets/logo.png";
import ProductCard from "../components/productCard";
import { FaChevronLeft, FaChevronRight, FaUserCircle } from "react-icons/fa";
import { Button } from "flowbite-react";
import { useEffect, useRef } from "react";
import { SignInForm } from "../components/signInForm";
import { useCourses } from "../hooks/useCourses";
import CourseDetailsCard from "../components/courseDetailsCard";
import SettingsCard from "../components/SettingsCard";

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
];

const CoursePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const { courses, loading, error } = useCourses(selectedCategory);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const scrollCategories = (direction: "left" | "right") => {
    const container = document.getElementById("categories-container");
    if (container) {
      const scrollAmount = 200;
      const scrollTo =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;
      container.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  const handleProfileUpdate = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Optionally reset search query when changing category
    setSearchQuery("");
  };

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleSignInSuccess = (userData: any) => {
    setUser(userData);
  };

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

  const filteredCourses = courses.filter((course) => {
    const searchTerms = searchQuery.toLowerCase();
    return (
      course.name.toLowerCase().includes(searchTerms) ||
      course.category.toLowerCase().includes(searchTerms) ||
      course.description.toLowerCase().includes(searchTerms)
    );
  });

  return (
    <>
      <section
        className="h-[2048px] bg-white bg-cover   sm:h-[512px]  md:h-[1024px] lg:h-[2048px] "
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="sticky top-0 z-50 border-b border-transparent bg-transparent backdrop-blur-lg">
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
        </div>
        <div className="max-w-8xl mx-auto px-4 py-2 sm:px-4 lg:px-4">
          <div className="relative px-10">
            {/* Left scroll button */}
            <button
              onClick={() => scrollCategories("left")}
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-lg bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white/90"
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
                  onClick={() => handleCategorySelect(category)}
                  className={`
                whitespace-nowrap rounded-lg px-6 py-2 transition-all duration-200
                ${
                  selectedCategory === category
                    ? "bg-primary-600 font-semibold text-white shadow-lg"
                    : "bg-white/70 text-gray-700 backdrop-blur-sm hover:bg-white/90 hover:text-gray-900"
                }
            `}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Right scroll button */}
            <button
              onClick={() => scrollCategories("right")}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-lg bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white/90"
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
              Explore our {selectedCategory.toLowerCase()} courses and start
              learning today
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 lg:mt-16 lg:grid-cols-4 lg:gap-4">
            {loading ? (
              <div className="col-span-full text-center text-gray-600">
                <p>Loading courses...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center text-red-600">
                <p>Error: {error}</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="col-span-full py-10 text-center">
                <p className="text-lg text-gray-600">
                  No courses available in {selectedCategory.toLowerCase()}{" "}
                  category
                </p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="col-span-full py-10 text-center">
                <p className="text-lg text-gray-600">
                  No courses match your search "{searchQuery}"
                </p>
              </div>
            ) : (
              <>
                {filteredCourses.map((course) => (
                  <ProductCard
                    key={course._id}
                    imageUrl={course.thumbnails?.[0]}
                    courseName={course.name}
                    category={course.category}
                    _id={course._id}
                    description={course.description}
                    onClick={() => handleCourseClick(course)}
                  />
                ))}

                {selectedCourse && (
                  <CourseDetailsCard
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    course={selectedCourse}
                    isLoggedIn={!!user}
                  />
                )}
              </>
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
  );
};
export default CoursePage;
