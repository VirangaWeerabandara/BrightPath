import React, { useEffect, useState } from "react";
import { DashboardLayout } from "../components/layout/TeacherDashboardLayout";
import axios from "axios";
import { env } from "../config/env.config";
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
} from "recharts";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<CourseStats>({
    totalCourses: 0,
    totalStudents: 0,
    averageStudentsPerCourse: 0,
  });
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const [coursesResponse, statsResponse] = await Promise.all([
          axios.get(`${env.apiUrl}/courses/teacher/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${env.apiUrl}/courses/teacher/${user._id}/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCourses(coursesResponse.data.data.courses);
        setStats(statsResponse.data.data);

        // Process category data
        const categories = coursesResponse.data.data.courses.reduce(
          (acc: { [key: string]: number }, course: Course) => {
            acc[course.category] = (acc[course.category] || 0) + 1;
            return acc;
          },
          {},
        );

        const categoryStats = Object.entries(categories).map(
          ([category, count]) => ({
            category,
            count: count as number,
          }),
        );

        setCategoryData(categoryStats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Stats Section */}
      <div className="mb-8">
        <h1 className="mb-6 text-3xl font-bold">Teacher Dashboard</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Stats cards - existing code */}
          <div className="rounded-lg border-l-4 border-primary-600 bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">
              Total Courses
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-800">
              {stats.totalCourses}
            </p>
          </div>

          <div className="rounded-lg border-l-4 border-green-500 bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">
              Total Students
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-800">
              {stats.totalStudents}
            </p>
          </div>

          <div className="rounded-lg border-l-4 border-blue-500 bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">
              Avg. Students per Course
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-800">
              {stats.averageStudentsPerCourse.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Course Categories Distribution */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">
            Course Categories Distribution
          </h2>
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
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Overview Bar Chart */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Course Overview</h2>
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
