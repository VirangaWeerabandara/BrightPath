import React, { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "../components/layout/TeacherDashboardLayout";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { env } from "../config/env.config";
import { FaTrash } from "react-icons/fa";
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface Course {
  _id: string;
  name: string;
  description: string;
  category: string;
  videos: string[];
  thumbnails: string[];
  createdAt: string;
}

export default function TeacherCoursePage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const user = JSON.parse(userStr);

      const response = await axios.get(
        `${env.apiUrl}/courses/teacher/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setCourses(response.data.data.courses);
      } else {
        throw new Error("Failed to fetch courses");
      }
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      toast.error(error.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [courses, searchTerm]);

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * coursesPerPage;
    return filteredCourses.slice(startIndex, startIndex + coursesPerPage);
  }, [filteredCourses, currentPage, coursesPerPage]);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
  }) => {
    return (
      <div className="mt-6 flex items-center justify-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-md bg-gray-100 px-3 py-1 text-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`rounded-md px-3 py-1 ${
              currentPage === page
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-md bg-gray-100 px-3 py-1 text-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  const extractPublicId = (url: string, type: "video" | "image") => {
    try {
      // Extract the last part of the URL before file extension
      const regex = /\/(?:video|upload)\/(?:v\d+\/)?(.+?)\.[^.]+$/;
      const match = url.match(regex);
      if (!match || !match[1]) return null;

      // Add the appropriate folder prefix
      const folder =
        type === "video" ? "BrightPath_Videos" : "BrightPath_Images";
      return `${folder}/${match[1].split("/").pop()}`; // Get only the last part of the path
    } catch (error) {
      console.error("Error extracting public ID:", error);
      return null;
    }
  };

  const handleDeleteCourse = async (course: Course) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const deleteFileFromCloudinary = async (
        url: string,
        type: "video" | "image",
      ) => {
        const publicId = extractPublicId(url, type);
        if (!publicId) return true;

        try {
          const encodedPublicId = encodeURIComponent(publicId);
          console.log("Attempting to delete with publicId:", publicId);

          const response = await axios.delete(
            `${env.apiUrl}/upload/file/${encodedPublicId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          return response.data.success;
        } catch (error) {
          console.error("Error deleting file:", error);
          return false;
        }
      };

      // Delete videos and thumbnails from Cloudinary
      const deletePromises = [
        ...course.videos.map((videoUrl) =>
          deleteFileFromCloudinary(videoUrl, "video"),
        ),
        ...course.thumbnails.map((thumbnailUrl) =>
          deleteFileFromCloudinary(thumbnailUrl, "image"),
        ),
      ];

      await Promise.all(deletePromises);

      // Delete course from database
      const response = await axios.delete(
        `${env.apiUrl}/courses/${course._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        toast.success("Course deleted successfully");
        fetchCourses(); // Refresh the course list
      }
    } catch (error: any) {
      console.error("Error deleting course:", error);
      toast.error(error.response?.data?.message || "Failed to delete course");
    } finally {
      setShowDeleteModal(false);
      setCourseToDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <button
            onClick={() => navigate("/create-course")}
            className="hover:bg-primary-700 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors"
          >
            Create New Course
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="max-w-8xl mx-auto space-y-6">
              {paginatedCourses.map((course) => (
                <div
                  key={course._id}
                  className="flex h-40 flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg md:flex-row" // Added h-40 for fixed height
                >
                  <div className="relative h-40 flex-shrink-0 md:w-56">
                    {" "}
                    {/* Fixed height to match parent */}
                    <img
                      src={course.thumbnails[0] || "/placeholder-course.jpg"}
                      alt={course.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute right-0 top-0 m-2">
                      <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-600">
                        {course.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-grow flex-col justify-between p-4">
                    {" "}
                    {/* Reduced padding */}
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-gray-900">
                        {" "}
                        {/* Reduced text size and margin */}
                        {course.name}
                      </h3>
                      <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
                        {" "}
                        {/* Added line-clamp-2 */}
                        {course.description}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/course/edit/${course._id}`)}
                        className="hover:bg-primary-700 rounded-lg bg-primary-600 px-4 py-1.5 text-sm font-medium text-white transition-colors"
                      >
                        Edit Course →
                      </button>
                      <div className="flex flex-col items-end justify-center gap-1">
                        {" "}
                        {/* Added justify-center */}
                        <button
                          onClick={() => {
                            setCourseToDelete(course);
                            setShowDeleteModal(true);
                          }}
                          className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                        <span className="text-xs text-gray-500">
                          Created:{" "}
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredCourses.length > coursesPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="py-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              No courses found
            </h3>
            <p className="mt-2 text-gray-500">
              {searchTerm
                ? "Try adjusting your search"
                : "Start by creating a new course"}
            </p>
          </div>
        )}
      </div>

      {showDeleteModal && courseToDelete && (
        <Modal
          show={showDeleteModal}
          size="md"
          popup
          onClose={() => {
            setShowDeleteModal(false);
            setCourseToDelete(null);
          }}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this course?
                <br />
                <span className="font-medium text-gray-800">
                  {courseToDelete.name}
                </span>
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  color="failure"
                  onClick={() => handleDeleteCourse(courseToDelete)}
                >
                  Yes, delete it
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCourseToDelete(null);
                  }}
                >
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </DashboardLayout>
  );
}
