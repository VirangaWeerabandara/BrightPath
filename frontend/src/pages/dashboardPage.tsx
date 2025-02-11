import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/TeacherDashboardLayout';
import axios from 'axios';
import { env } from '../config/env.config';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface CourseStats {
  totalCourses: number;
  totalStudents: number;
  averageStudentsPerCourse: number;
}

interface Course {
  _id: string;
  name: string;
  description: string;
  category: string;
}

interface CategoryData {
  category: string;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<CourseStats>({
    totalCourses: 0,
    totalStudents: 0,
    averageStudentsPerCourse: 0
  });
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        const [coursesResponse, statsResponse] = await Promise.all([
          axios.get(`${env.apiUrl}/teacher/courses/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${env.apiUrl}/teacher/${user._id}/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setCourses(coursesResponse.data.data.courses);
        setStats(statsResponse.data.data);

        // Process category data
        const categories = coursesResponse.data.data.courses.reduce((acc: { [key: string]: number }, course: Course) => {
          acc[course.category] = (acc[course.category] || 0) + 1;
          return acc;
        }, {});

        const categoryStats = Object.entries(categories).map(([category, count]) => ({
          category,
          count: count as number,
        }));

        setCategoryData(categoryStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Stats Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats cards - existing code */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-600">
            <h3 className="text-lg font-semibold text-gray-600">Total Courses</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalCourses}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-600">Total Students</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalStudents}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-600">Avg. Students per Course</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {stats.averageStudentsPerCourse.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Course Categories Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Course Categories Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Overview Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Course Overview</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}