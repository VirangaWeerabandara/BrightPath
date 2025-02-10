import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "../assets/logo.png";

export default function UploadMediaPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    category: "",
    videos: [] as string[],
    thumbnails: [] as string[],
  });

  // Get auth token and user data
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      return { token: null, user: null };
    }
  
    try {
      const user = JSON.parse(userStr);
      // Verify it's a teacher
      if (user.role !== 'teacher') {
        return { token: null, user: null };
      }
      return { token, user };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return { token: null, user: null };
    }
  };
  

  useEffect(() => {
    const { token, user } = getAuthToken();
    if (!token || user.role !== 'teacher') {
      toast.error("Please login as a teacher to access this feature");
      navigate('/login');
    }
  }, [navigate]);

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value
    });
  };

  // Convert file to base64
  const convertBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.onerror = (error) => reject(error);
    });
  };

  // Handle file uploads
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'thumbnail') => {
    const files = event.target.files;
    if (!files?.length) return;

    setLoading(true);
    try {
      const { token } = getAuthToken();
      if (!token) {
        toast.error("Please login to upload files");
        navigate('/login');
        return;
      }

      const uploadPromises = Array.from(files).map(async (file) => {
        const base64 = await convertBase64(file);
        const endpoint = `http://localhost:4000/api/upload/${type === 'video' ? 'video' : 'image'}`;
        const response = await axios.post(
          endpoint,
          { [type === 'video' ? 'video' : 'image']: base64 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.url;
      });

      const urls = await Promise.all(uploadPromises);
      
      setCourseData(prev => ({
        ...prev,
        [type === 'video' ? 'videos' : 'thumbnails']: [...prev[type === 'video' ? 'videos' : 'thumbnails'], ...urls]
      }));

      toast.success(`${type === 'video' ? 'Videos' : 'Thumbnails'} uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    } finally {
      setLoading(false);
    }
  };

// Update the handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  // Validate required fields
  if (!courseData.name || !courseData.description || !courseData.category) {
    toast.error("Please fill in all required fields");
    setLoading(false);
    return;
  }

  if (courseData.videos.length === 0) {
    toast.error("Please upload at least one video");
    setLoading(false);
    return;
  }

  if (courseData.thumbnails.length === 0) {
    toast.error("Please upload at least one thumbnail");
    setLoading(false);
    return;
  }

  try {
    const { token, user } = getAuthToken();
    if (!user._id) {
      toast.error("User information not found");
      setLoading(false);
      return;
    }

    const response = await axios.post(
      'http://localhost:4000/api/courses/create',
      {
        ...courseData,
        teacherId: user._id,
      },
      {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      toast.success("Course created successfully!");
      navigate('/teacher/courses');
    } else {
      toast.error(response.data.message || "Failed to create course");
    }
  } catch (error: any) {
    console.error("Course creation error:", error);
    toast.error(error.response?.data?.message || "Failed to create course");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Create New Course</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        {/* Course Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Name</label>
          <input
            type="text"
            name="name"
            value={courseData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        {/* Course Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={courseData.category}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Videos</label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => handleFileUpload(e, 'video')}
            className="mt-1 block w-full"
          />
          {courseData.videos.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Uploaded Videos:</p>
              <ul className="list-disc pl-5">
                {courseData.videos.map((url, index) => (
                  <li key={index} className="text-blue-600 truncate">
                    <a href={url} target="_blank" rel="noopener noreferrer">Video {index + 1}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Thumbnails</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload(e, 'thumbnail')}
            className="mt-1 block w-full"
          />
          {courseData.thumbnails.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-4">
              {courseData.thumbnails.map((url, index) => (
                <img key={index} src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-32 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <img src={logo} alt="Loading" className="animate-spin h-5 w-5" />
                <span>Creating Course...</span>
              </div>
            ) : (
              'Create Course'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}