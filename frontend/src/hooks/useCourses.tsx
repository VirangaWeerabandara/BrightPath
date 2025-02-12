import { useState, useEffect } from "react";
import { env } from "../config/env.config";

export interface Thumbnail {
  url: string;
  public_id: string;
}

export interface Course {
  _id: string;
  name: string;
  description: string;
  category: string;
  thumbnails: Thumbnail[];
  teacherId: {
    firstName: string;
    lastName: string;
  };
}

export interface CourseHookResult {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

export const useCourses = (category: string): CourseHookResult => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${env.apiUrl}/courses`);

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();

        if (data.success) {
          const filteredCourses =
            category === "All"
              ? data.data
              : data.data.filter((course: any) => course.category === category);
          setCourses(filteredCourses);
        } else {
          throw new Error(data.message || "Failed to fetch courses");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [category]);

  return { courses, loading, error };
};
