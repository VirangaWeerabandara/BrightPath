import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '../components/layout/TeacherDashboardLayout';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { env } from '../config/env.config';

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
  thumbnails: string[];
  createdAt: string;
}

export default function TeacherCoursePage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      const user = JSON.parse(userStr);

      const response = await axios.get(
        `${env.apiUrl}/teacher/courses/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setCourses(response.data.data.courses);
      } else {
        throw new Error('Failed to fetch courses');
      }
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * coursesPerPage;
    return filteredCourses.slice(startIndex, startIndex + coursesPerPage);
  }, [filteredCourses, currentPage, coursesPerPage]);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <button
            onClick={() => navigate('/create-course')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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
              className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <svg
              className="absolute w-5 h-5 text-gray-400 left-3 top-2.5"
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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="space-y-6 max-w-8xl mx-auto">
            {paginatedCourses.map((course) => (
  <div
    key={course._id}
    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row h-40" // Added h-40 for fixed height
  >
    <div className="md:w-56 h-40 relative flex-shrink-0"> {/* Fixed height to match parent */}
      <img
        src={course.thumbnails[0] || '/placeholder-course.jpg'}
        alt={course.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 right-0 m-2">
        <span className="px-2 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-medium">
          {course.category}
        </span>
      </div>
    </div>
    <div className="p-4 flex-grow flex flex-col justify-between"> {/* Reduced padding */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1"> {/* Reduced text size and margin */}
          {course.name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2"> {/* Added line-clamp-2 */}
          {course.description}
        </p>
      </div>
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => navigate(`/course/${course._id}`)}
          className="px-4 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          View Details →
        </button>
        <span className="text-xs text-gray-500">
          Created: {new Date(course.createdAt).toLocaleDateString()}
        </span>
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
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm 
                ? "Try adjusting your search" 
                : "Start by creating a new course"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}