import { useState, useEffect } from "react";
import { env } from "../config/env.config";

interface EnrolledCourse {
  _id: string;
  name: string;
  category: string;
  description: string;
  thumbnails: string[];
}

export const useEnrolledCourses = () => {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `${env.apiUrl}/student/courses/enrolled-courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch enrolled courses");
        }

        setCourses(data.courses || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  return { courses, loading, error };
};
