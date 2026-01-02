import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { env } from "../config/env.config";
import background from "../assets/background2.png";
import logo from "../assets/logo.png";
import { FaArrowLeft } from "react-icons/fa";

interface Course {
  _id: string;
  name: string;
  description: string;
  category?: string;
  videos: string[];
  titles: string[];
  thumbnails: string[];
  teacherId: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function CourseViewPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${env.apiUrl}/courses/${courseId}`);
        if (isMounted) {
          setCourse(response.data.data);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchCourse();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-sm">
          <div className="rounded-2xl bg-red-50 p-8 text-red-800">
            <h2 className="text-2xl font-bold">Error</h2>
            <p className="mt-2">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 rounded-xl bg-red-600 px-6 py-2 text-white hover:bg-red-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-sm">
          <div className="text-center text-gray-500">No course found</div>
        </div>
      </div>
    );
  }

  return (
    <section
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Header */}
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

            {/* Back Button */}
            <motion.button
              onClick={() => navigate("/my-learning")}
              className="flex items-center gap-2 rounded-lg bg-white/70 px-4 py-2 font-semibold text-gray-700 backdrop-blur-sm transition-all hover:bg-white/90"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft />
              My Learning
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 p-8 text-white shadow-xl">
            <div className="relative z-10">
              <h1 className="mb-2 text-4xl font-bold">{course.name}</h1>
              <p className="text-lg text-purple-100">
                {course.category || "Course"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Course Info */}
        <motion.div
          className="mb-6 rounded-2xl bg-white/90 p-8 shadow-lg backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            About this Course
          </h2>
          <p className="mb-6 leading-relaxed text-gray-700">
            {course.description}
          </p>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Instructor
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                <span className="font-semibold">
                  {course.teacherId.firstName[0]}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {course.teacherId.firstName} {course.teacherId.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {course.teacherId.email}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Course Content */}
        <motion.div
          className="rounded-2xl bg-white/90 p-8 shadow-lg backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Course Content
          </h2>

          {/* Video Player */}
          <div className="mb-8 aspect-video max-w-4xl overflow-hidden rounded-2xl bg-black shadow-lg sm:mx-auto">
            <video
              key={course.videos[currentVideoIndex]}
              className="size-full"
              controls
              autoPlay
              src={course.videos[currentVideoIndex]}
            />
          </div>

          {/* Current Video Info */}
          <div className="mb-8 border-b border-gray-200 pb-6">
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              {course.titles[currentVideoIndex]}
            </h3>
            <p className="text-gray-600">
              Instructor: {course.teacherId.firstName}{" "}
              {course.teacherId.lastName}
            </p>
          </div>

          {/* Video List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">
                Videos in this Course
              </h3>
              <span className="text-sm font-semibold text-purple-600">
                {course.videos.length} videos
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {course.videos.map((video, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentVideoIndex(index)}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group overflow-hidden rounded-xl transition-all duration-200 ${
                    currentVideoIndex === index
                      ? "shadow-xl ring-2 ring-purple-600 ring-offset-2"
                      : "shadow-md hover:shadow-xl"
                  }`}
                >
                  <div className="relative aspect-video overflow-hidden bg-black">
                    <img
                      src={course.thumbnails[index]}
                      alt={course.titles[index]}
                      className="size-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                        <span className="text-xl text-purple-600"></span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-3 transition-all ${
                      currentVideoIndex === index
                        ? "bg-gradient-to-br from-purple-50 to-indigo-50"
                        : "bg-white group-hover:bg-purple-50/50"
                    }`}
                  >
                    <p
                      className={`truncate text-xs font-semibold ${
                        currentVideoIndex === index
                          ? "text-purple-700"
                          : "text-gray-900"
                      }`}
                    >
                      {course.titles[index]}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">
                      {index + 1} of {course.videos.length}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
