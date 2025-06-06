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
  videoUrl: string;
  thumbnailUrl: string;
  videoUploadProgress: number;
  thumbnailUploadProgress: number;
  name: string;
  videoPublicId?: string;
  thumbnailPublicId?: string;
}

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    category: "",
  });

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

  useEffect(() => {
    const { token, user } = getAuthToken();
    if (!token || user?.role !== "teacher") {
      toast.error("Please login as a teacher to access this feature");
      navigate("/login");
    }
  }, [navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    videoId: string,
    type: "video" | "thumbnail",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const videoItem = videos.find((v) => v.id === videoId);
    if (!videoItem) return;

    try {
      const { token } = getAuthToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const endpoint = type === "video" ? "video" : "image";
      const url = `${env.apiUrl}/upload/${endpoint}`;

      const response = await axios.post(url, formData, {
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
                ? {
                    ...v,
                    [`${type}UploadProgress`]: progress,
                  }
                : v,
            ),
          );
        },
      });

      if (response.data && response.data.success && response.data.url) {
        setVideos((prevVideos) =>
          prevVideos.map((v) =>
            v.id === videoId
              ? {
                  ...v,
                  [`${type}Url`]: response.data.url,
                  [`${type}PublicId`]: response.data.public_id,
                  [`${type}UploadProgress`]: 100,
                }
              : v,
          ),
        );
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setVideos((prevVideos) =>
        prevVideos.map((v) =>
          v.id === videoId
            ? {
                ...v,
                [`${type}UploadProgress`]: 0,
              }
            : v,
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

      const deleteFileFromCloudinary = async (publicId: string) => {
        if (!publicId) return true; // Skip if no publicId

        try {
          const response = await axios.delete(
            `${env.apiUrl}/upload/file/${encodeURIComponent(publicId)}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (response.data.success) {
            return true;
          }
          throw new Error(response.data.message || "Delete failed");
        } catch (error) {
          console.error("Error deleting file:", error);
          return false;
        }
      };

      // Delete files in parallel
      const [videoDeleted, thumbnailDeleted] = await Promise.all([
        video.videoPublicId
          ? deleteFileFromCloudinary(video.videoPublicId)
          : Promise.resolve(true),
        video.thumbnailPublicId
          ? deleteFileFromCloudinary(video.thumbnailPublicId)
          : Promise.resolve(true),
      ]);

      // Show appropriate messages
      if (!videoDeleted) {
        toast.error("Failed to delete video file");
      }
      if (!thumbnailDeleted) {
        toast.error("Failed to delete thumbnail file");
      }

      // Remove from local state if at least one deletion was successful
      if (videoDeleted || thumbnailDeleted) {
        setVideos((prevVideos) => prevVideos.filter((v) => v.id !== id));
        toast.success("Video removed from list");
      }
    } catch (error) {
      console.error("Error deleting files:", error);
      toast.error("Failed to delete files");
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
        return;
      }

      if (videos.length === 0) {
        toast.error("Please upload at least one video");
        return;
      }

      // Check if all videos have both video and thumbnail URLs
      const invalidVideos = videos.filter(
        (video) => !video.videoUrl || !video.thumbnailUrl,
      );
      if (invalidVideos.length > 0) {
        toast.error("Please upload both video and thumbnail for all videos");
        return;
      }

      // Format the course payload according to the schema requirements
      const coursePayload = {
        name: courseData.name,
        description: courseData.description,
        category: courseData.category,
        teacherId: user._id,
        videos: videos.map((video) => video.videoUrl),
        thumbnails: videos.map((video) => video.thumbnailUrl),
        titles: videos.map((video) => video.name), // Add this line to include video titles
      };

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

      if (response.data.success) {
        toast.success("Course created successfully!");
        // Reset form
        setCourseData({
          name: "",
          description: "",
          category: "",
        });
        setVideos([]);
        // Optionally redirect to courses page
        navigate("/create-course");
      }
    } catch (error: any) {
      console.error("Course creation error:", error.response?.data || error);
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
        videoUrl: "",
        thumbnailUrl: "",
        videoUploadProgress: 0,
        thumbnailUploadProgress: 0,
        name: `Video ${prev.length + 1}`,
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

        <form className="max-w-8xl mx-auto space-y-6">
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Course Content</h2>
              <Button onClick={addNewVideoRow} color="purple">
                Add Video
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Video Name
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
                    // Replace the existing table row code (inside the videos.map) with this:
                    // Replace the existing table row code (inside the videos.map) with this:
                    <tr key={video.id}>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={video.name}
                          onChange={(e) => {
                            setVideos((prevVideos) =>
                              prevVideos.map((v) =>
                                v.id === video.id
                                  ? { ...v, name: e.target.value }
                                  : v,
                              ),
                            );
                          }}
                          className="w-full rounded border px-2 py-1"
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
                                    video.videoUrl
                                      ? "bg-green-500"
                                      : "bg-blue-500"
                                  }`}
                                  style={{
                                    width: `${video.videoUploadProgress}%`,
                                  }}
                                />
                              )}
                            </div>
                            <FaCheckCircle
                              className={`text-lg transition-colors duration-300 ${
                                video.videoUrl
                                  ? "text-green-500"
                                  : "text-gray-300"
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
