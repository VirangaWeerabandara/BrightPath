import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { env } from "../config/env.config";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo.png";
import background from "../assets/background2.png";
import { Footer } from "flowbite-react";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

interface Course {
  _id: string;
  name: string;
  description: string;
  videos: string[];
  titles: string[];
  thumbnails: string[];
  teacherId: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export default function CourseViewPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${env.apiUrl}/courses/${courseId}`);
        setCourse(response.data.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>No course found</div>;

  return (
    <section
      className="flex min-h-screen flex-col bg-white bg-cover [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100/20 [&::-webkit-scrollbar]:w-2"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Navigation Bar */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-white/10 backdrop-blur-lg">
        <div className="max-w-8xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-6">
              <div
                className="flex cursor-pointer items-center space-x-2"
                onClick={() => navigate("/")}
              >
                <img src={logo} alt="BrightPath Logo" className="h-8 w-8" />
                <span className="text-xl font-bold text-gray-900">
                  BrightPath
                </span>
              </div>
              <div className="h-6 w-px bg-gray-200/50" />
              <h1 className="text-lg font-semibold text-gray-900">
                {course.name}
              </h1>
            </div>

            {/* Right Section */}
            {user && (
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
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg bg-white/90 py-1 shadow-lg backdrop-blur-sm">
                    <button
                      onClick={() => {
                        navigate("/my-learning");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100/80"
                    >
                      My Learning
                    </button>
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100/80"
                    >
                      Settings
                    </button>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100/80"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex h-full">
          {/* Video and Info Section - Add scrollbar styling */}
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100/20 [&::-webkit-scrollbar]:w-2">
            {/* Video Player */}
            <div className="aspect-video bg-black shadow-lg">
              <video
                key={course.videos[currentVideoIndex]}
                className="h-full w-full"
                controls
                autoPlay
                src={course.videos[currentVideoIndex]}
              />
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {course.titles[currentVideoIndex]}
              </h1>
              <p className="mt-2 text-sm text-gray-800">
                Instructor: {course.teacherId.firstName}{" "}
                {course.teacherId.lastName}
              </p>
              <div className="mt-4 border-t border-gray-200/50 pt-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  About this course
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-800">
                  {course.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="height-full w-80 border-l border-white/20 bg-white/20 backdrop-blur-md">
            <div className="p-4">
              <h3 className="mb-4 font-semibold text-gray-900">
                Course Content
              </h3>
              <div className="h-[calc(100vh-180px)] space-y-2 overflow-y-auto pr-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100/60 [&::-webkit-scrollbar]:w-2">
                {course.videos.map((video, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentVideoIndex(index)}
                    className={`w-full rounded-lg p-2 text-left transition-all ${
                      currentVideoIndex === index
                        ? "bg-white/30 backdrop-blur-md"
                        : "backdrop-blur-sm hover:bg-white/20"
                    }`}
                  >
                    <div className="mb-2 aspect-video overflow-hidden rounded-lg shadow-sm">
                      <img
                        src={course.thumbnails[index]}
                        alt={course.titles[index]}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p
                      className={`text-sm ${
                        currentVideoIndex === index
                          ? "font-medium text-purple-700"
                          : "text-gray-800"
                      }`}
                    >
                      {course.titles[index]}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer container className="mt-auto bg-primary-100">
        <div className="w-full">
          <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
            <div>
              <Footer.Brand
                href="https://flowbite.com"
                src={logo}
                alt="BrightPath Logo"
                name="BrightPath"
              />
            </div>
            <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
              <div>
                <Footer.Title title="about" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">Flowbite</Footer.Link>
                  <Footer.Link href="#">Tailwind CSS</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title="Follow us" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">Github</Footer.Link>
                  <Footer.Link href="#">Discord</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title="Legal" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">Privacy Policy</Footer.Link>
                  <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
                </Footer.LinkGroup>
              </div>
            </div>
          </div>
          <Footer.Divider />
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <Footer.Copyright href="#" by="BrightPath™" year={2024} />
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <Footer.Icon href="#" icon={BsFacebook} />
              <Footer.Icon href="#" icon={BsInstagram} />
              <Footer.Icon href="#" icon={BsTwitter} />
              <Footer.Icon href="#" icon={BsGithub} />
              <Footer.Icon href="#" icon={BsDribbble} />
            </div>
          </div>
        </div>
      </Footer>
    </section>
  );
}
