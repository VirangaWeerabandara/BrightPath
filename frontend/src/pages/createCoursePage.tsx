import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "flowbite-react";
import { DashboardLayout } from "../components/layout/TeacherDashboardLayout";
import { env } from "../config/env.config";
import { FaTrash, FaCheckCircle } from "react-icons/fa";

const COURSE_CATEGORIES = [
  "Programming",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Design",
  "Business",
  "Marketing",
  "Music",
  "Photography",
  "Other",
];

interface VideoItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  videoUploadProgress: number;
  thumbnailUploadProgress: number;
  title: string;
  videoPublicId?: string;
  thumbnailPublicId?: string;
}

interface CourseData {
  name: string;
  description: string;
  category: string;
}

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [courseData, setCourseData] = useState<CourseData>({
    name: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    const { token, user } = getAuthToken();
    if (!token || user?.role !== "teacher") {
      toast.error("Please login as a teacher to access this feature");
      navigate("/login");
    }
  }, [navigate]);

  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      return { token: null, user: null };
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "teacher") {
        return { token: null, user: null };
      }
      return { token, user };
    } catch (error) {
      console.error("Error parsing user data:", error);
      return { token: null, user: null };
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setCourseData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    videoId: string,
    type: "video" | "thumbnail",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { token } = getAuthToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const endpoint = type === "video" ? "video" : "image";
      const response = await axios.post(
        `${env.apiUrl}/upload/${endpoint}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1),
            );
            setVideos((prevVideos) =>
              prevVideos.map((v) =>
                v.id === videoId
                  ? { ...v, [`${type}UploadProgress`]: progress }
                  : v,
              ),
            );
          },
        },
      );

      if (response.data?.success && response.data?.url) {
        setVideos((prevVideos) =>
          prevVideos.map((v) =>
            v.id === videoId
              ? {
                  ...v,
                  [type === "video" ? "url" : "thumbnailUrl"]:
                    response.data.url,
                  [`${type}PublicId`]: response.data.public_id,
                  [`${type}UploadProgress`]: 100,
                }
              : v,
          ),
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
      setVideos((prevVideos) =>
        prevVideos.map((v) =>
          v.id === videoId ? { ...v, [`${type}UploadProgress`]: 0 } : v,
        ),
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const video = videos.find((v) => v.id === id);
      if (!video) return;

      const { token } = getAuthToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const deletePromises = [];
      if (video.videoPublicId) {
        deletePromises.push(
          axios.delete(
            `${env.apiUrl}/upload/file/${encodeURIComponent(video.videoPublicId)}`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
        );
      }
      if (video.thumbnailPublicId) {
        deletePromises.push(
          axios.delete(
            `${env.apiUrl}/upload/file/${encodeURIComponent(
              video.thumbnailPublicId,
            )}`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
        );
      }

      await Promise.all(deletePromises);
      setVideos((prevVideos) => prevVideos.filter((v) => v.id !== id));
      toast.success("Video removed successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete video");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { token, user } = getAuthToken();
      if (!token || !user) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      if (!courseData.name || !courseData.description || !courseData.category) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (videos.length === 0) {
        toast.error("Please add at least one video");
        setLoading(false);
        return;
      }

      const invalidVideos = videos.filter(
        (video) => !video.url || !video.thumbnailUrl,
      );
      if (invalidVideos.length > 0) {
        toast.error("Please complete all video uploads");
        setLoading(false);
        return;
      }

      const coursePayload = {
        name: courseData.name,
        description: courseData.description,
        category: courseData.category,
        teacherId: user._id,
        videos: videos.map((video) => ({
          url: video.url,
          title: video.title,
          public_id: video.videoPublicId,
        })),
        thumbnails: videos.map((video) => ({
          url: video.thumbnailUrl,
          public_id: video.thumbnailPublicId,
        })),
      };

      console.log("Sending course payload:", coursePayload); // Debug log

      const response = await axios.post(
        `${env.apiUrl}/courses/create`,
        coursePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Server response:", response.data); // Debug log

      if (response.data.success) {
        toast.success("Course created successfully!");
        navigate("/my-courses");
      } else {
        throw new Error(response.data.message || "Failed to create course");
      }
    } catch (error: any) {
      console.error("Course creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const addNewVideoRow = () => {
    setVideos((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        url: "",
        thumbnailUrl: "",
        videoUploadProgress: 0,
        thumbnailUploadProgress: 0,
        title: `Video ${prev.length + 1}`,
        videoPublicId: "",
        thumbnailPublicId: "",
      },
    ]);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <Button onClick={handleSubmit} disabled={loading} color="purple">
            {loading ? "Creating..." : "Create Course"}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="max-w-8xl mx-auto space-y-6">
          {/* Course Details Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Course Name
              </label>
              <input
                type="text"
                name="name"
                value={courseData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Enter course name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Enter course description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={courseData.category}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select a category</option>
                {COURSE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Videos Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Course Content</h2>
              <Button type="button" onClick={addNewVideoRow} color="purple">
                Add Video
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Video Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Video
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Thumbnail
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {videos.map((video) => (
                    <tr key={video.id}>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={video.title}
                          onChange={(e) => {
                            setVideos((prevVideos) =>
                              prevVideos.map((v) =>
                                v.id === video.id
                                  ? { ...v, title: e.target.value }
                                  : v,
                              ),
                            );
                          }}
                          className="w-full rounded border px-2 py-1"
                          placeholder="Enter video title"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) =>
                              handleFileUpload(e, video.id, "video")
                            }
                            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <div className="flex items-center space-x-2">
                            <div className="h-1 flex-grow rounded bg-gray-200">
                              {video.videoUploadProgress > 0 && (
                                <div
                                  className={`h-full rounded transition-all duration-300 ${
                                    video.url ? "bg-green-500" : "bg-blue-500"
                                  }`}
                                  style={{
                                    width: `${video.videoUploadProgress}%`,
                                  }}
                                />
                              )}
                            </div>
                            <FaCheckCircle
                              className={`text-lg transition-colors duration-300 ${
                                video.url ? "text-green-500" : "text-gray-300"
                              }`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(e, video.id, "thumbnail")
                            }
                            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <div className="flex items-center space-x-2">
                            <div className="h-1 flex-grow rounded bg-gray-200">
                              {video.thumbnailUploadProgress > 0 && (
                                <div
                                  className={`h-full rounded transition-all duration-300 ${
                                    video.thumbnailUrl
                                      ? "bg-green-500"
                                      : "bg-blue-500"
                                  }`}
                                  style={{
                                    width: `${video.thumbnailUploadProgress}%`,
                                  }}
                                />
                              )}
                            </div>
                            <FaCheckCircle
                              className={`text-lg transition-colors duration-300 ${
                                video.thumbnailUrl
                                  ? "text-green-500"
                                  : "text-gray-300"
                              }`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleDelete(video.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
