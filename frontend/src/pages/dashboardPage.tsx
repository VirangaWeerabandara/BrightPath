import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/TeacherDashboardLayout';
import axios from 'axios';

export default function DashboardPage() {
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        const response = await axios.get(
          `http://localhost:4000/api/courses/teacher/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: any) => (
          <div key={course._id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
            <p className="text-gray-600">{course.description}</p>
            <p className="text-sm text-gray-500 mt-2">Category: {course.category}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}