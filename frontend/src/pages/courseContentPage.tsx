import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { env } from "../config/env.config";
import VideoPlayer from "../components/videoPlayer";

interface CourseContent {
  _id: string;
  name: string;
  description: string;
  category: string;
  thumbnails: Array<{
    url: string;
    public_id: string;
  }>;
  videos: Array<{
    url: string;
    title: string;
    public_id: string;
  }>;
  teacherId: {
    firstName: string;
    lastName: string;
  };
}

const CourseContentPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<CourseContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${env.apiUrl}/courses/${courseId}/content`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch course content");
        }

        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading course content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {course && (
          <div className="space-y-8">
            {/* Course Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {course.name}
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Instructor: {course.teacherId.firstName}{" "}
                {course.teacherId.lastName}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Video Player Section */}
              <div className="lg:col-span-2">
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  {course.videos.length > 0 && (
                    <>
                      <VideoPlayer
                        videoUrl={course.videos[currentVideoIndex].url}
                        title={course.videos[currentVideoIndex].title}
                      />
                      <div className="p-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {course.videos[currentVideoIndex].title}
                        </h2>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Video List Section */}
              <div className="lg:col-span-1">
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="p-4">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      Course Videos
                    </h3>
                    <div className="space-y-2">
                      {course.videos.map((video, index) => (
                        <button
                          key={video.public_id}
                          onClick={() => setCurrentVideoIndex(index)}
                          className={`flex w-full items-center rounded-lg p-3 transition-colors ${
                            currentVideoIndex === index
                              ? "bg-primary-50 text-primary-600"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="mr-3 h-20 w-32 flex-shrink-0 overflow-hidden rounded-md">
                            <img
                              src={course.thumbnails[0]?.url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{video.title}</span>
                            <span className="text-sm text-gray-500">
                              Video {index + 1}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseContentPage;
