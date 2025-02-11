import { useState, useEffect } from 'react';
import { env } from '../config/env.config';

interface Course {
  _id: string;
  name: string;
  category: string;
  thumbnails: string[];
  description: string;
}

export const useCourses = (selectedCategory: string = 'All') => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${env.apiUrl}/courses`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch courses');
        
        const data = await response.json();
        
        // Filter courses based on selected category
        const filteredCourses = selectedCategory === 'All' 
          ? data.data
          : data.data.filter((course: Course) => course.category === selectedCategory);
        
        setCourses(filteredCourses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory]); // Add selectedCategory as dependency

  return { courses, loading, error };
};