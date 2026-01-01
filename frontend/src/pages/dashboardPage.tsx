import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  Area,
  AreaChart,
} from "recharts";
import {
  PageTransition,
  containerVariants,
  itemVariants,
} from "../components/pageTransition";
import {
  FaBookOpen,
  FaUserGraduate,
  FaChartLine,
  FaTrophy,
  FaFire,
  FaStar,
} from "react-icons/fa";

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

const COLORS = [
  "#9333ea", // purple-600 (primary)
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#a855f7", // purple-500
  "#c084fc", // purple-400
  "#d8b4fe", // purple-300
];

const GRADIENT_COLORS = {
  purple: ["#9333ea", "#c084fc"],
  blue: ["#3b82f6", "#60a5fa"],
  green: ["#10b981", "#34d399"],
  orange: ["#f97316", "#fb923c"],
};

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
    <PageTransition>
      <DashboardLayout>
        {/* Welcome Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 p-8 text-white shadow-xl">
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
              <FaStar className="absolute right-10 top-10 h-20 w-20 animate-pulse" />
              <FaTrophy className="absolute right-32 top-32 h-16 w-16 animate-pulse delay-75" />
              <FaFire className="absolute right-5 top-44 h-12 w-12 animate-pulse delay-150" />
            </div>
            <div className="relative z-10">
              <h1 className="mb-2 text-4xl font-bold">
                Welcome back, Teacher! 🎓
              </h1>
              <p className="text-lg text-purple-100">
                Here's what's happening with your courses today
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Total Courses Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-lg transition-shadow hover:shadow-2xl"
          >
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-purple-200 opacity-50 blur-2xl transition-all group-hover:scale-150"></div>
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg">
                  <FaBookOpen className="h-7 w-7 text-white" />
                </div>
                <span className="rounded-full bg-purple-200 px-3 py-1 text-sm font-semibold text-purple-700">
                  Active
                </span>
              </div>
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-purple-600">
                Total Courses
              </h3>
              <p className="text-4xl font-bold text-gray-800">
                {stats.totalCourses}
              </p>
              <div className="mt-2 flex items-center text-sm text-purple-600">
                <FaChartLine className="mr-1" />
                <span>Your content library</span>
              </div>
            </div>
          </motion.div>

          {/* Total Students Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 shadow-lg transition-shadow hover:shadow-2xl"
          >
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-200 opacity-50 blur-2xl transition-all group-hover:scale-150"></div>
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-lg">
                  <FaUserGraduate className="h-7 w-7 text-white" />
                </div>
                <span className="rounded-full bg-indigo-200 px-3 py-1 text-sm font-semibold text-indigo-700">
                  Enrolled
                </span>
              </div>
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-indigo-600">
                Total Students
              </h3>
              <p className="text-4xl font-bold text-gray-800">
                {stats.totalStudents}
              </p>
              <div className="mt-2 flex items-center text-sm text-indigo-600">
                <FaFire className="mr-1" />
                <span>Learning community</span>
              </div>
            </div>
          </motion.div>

          {/* Average Students Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 p-6 shadow-lg transition-shadow hover:shadow-2xl"
          >
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-violet-200 opacity-50 blur-2xl transition-all group-hover:scale-150"></div>
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 shadow-lg">
                  <FaTrophy className="h-7 w-7 text-white" />
                </div>
                <span className="rounded-full bg-violet-200 px-3 py-1 text-sm font-semibold text-violet-700">
                  Metric
                </span>
              </div>
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-violet-600">
                Avg. Per Course
              </h3>
              <p className="text-4xl font-bold text-gray-800">
                {stats.averageStudentsPerCourse.toFixed(1)}
              </p>
              <div className="mt-2 flex items-center text-sm text-violet-600">
                <FaStar className="mr-1" />
                <span>Engagement rate</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Course Categories Distribution - Enhanced Pie Chart */}
          <motion.div
            className="rounded-2xl bg-white p-6 shadow-lg"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Course Distribution
                </h2>
                <p className="text-sm text-gray-500">By category breakdown</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <FaChartLine className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {COLORS.map((color, index) => (
                      <linearGradient
                        key={`gradient-${index}`}
                        id={`colorGradient${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                        <stop
                          offset="95%"
                          stopColor={color}
                          stopOpacity={0.6}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={categoryData}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    label={({ category, percent }) =>
                      `${category} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={true}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#colorGradient${index % COLORS.length})`}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Course Overview - Enhanced Bar Chart */}
          <motion.div
            className="rounded-2xl bg-white p-6 shadow-lg"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Course Analytics
                </h2>
                <p className="text-sm text-gray-500">Courses per category</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <FaBookOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#c084fc"
                        stopOpacity={0.7}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="category"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#6b7280" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    cursor={{ fill: "rgba(147, 51, 234, 0.1)" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#colorBar)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="mb-4 text-xl font-bold text-gray-800">
            Quick Insights
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center rounded-xl bg-white p-4 shadow-sm">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <FaBookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Most Popular</p>
                <p className="font-semibold text-gray-800">
                  {categoryData.length > 0
                    ? categoryData.reduce((prev, current) =>
                        prev.count > current.count ? prev : current,
                      ).category
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center rounded-xl bg-white p-4 shadow-sm">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <FaUserGraduate className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Categories</p>
                <p className="font-semibold text-gray-800">
                  {categoryData.length}
                </p>
              </div>
            </div>
            <div className="flex items-center rounded-xl bg-white p-4 shadow-sm">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
                <FaStar className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="font-semibold text-gray-800">
                  {stats.totalCourses > 0 ? "Active" : "Start Creating"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </DashboardLayout>
    </PageTransition>
  );
}
