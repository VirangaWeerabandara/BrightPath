import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

export default function UploadMedia() {
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<string[] | string>("");

  const convertBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // Function to upload single image or video
  function uploadSingleMedia(base64: string | ArrayBuffer | null, isVideo: boolean) {
    setLoading(true);
    const endpoint = isVideo
      ? "http://localhost:4000/uploadVideo"
      : "http://localhost:4000/upload";
    
    // Change 'media' to 'video' for video uploads and 'image' for image uploads
    const formData = isVideo ? { video: base64 } : { image: base64 };
  
    axios
      .post(endpoint, formData) 
      .then((res) => {
        setUrls(res.data.url);
        alert(`${isVideo ? "Video" : "Image"} uploaded Successfully`);
      })
      .finally(() => setLoading(false))
      .catch(console.log);
  }
  

  // Function to upload multiple images or videos
  function uploadMultipleMedia(files: string[], isVideo: boolean) {
    setLoading(true);
    const endpoint = isVideo
      ? "http://localhost:4000/uploadMultipleVideos"
      : "http://localhost:4000/uploadMultipleImages";
    axios
      .post(endpoint, { files }) // Sending the file array
      .then((res) => {
        setUrls(res.data.urls); // Expecting `res.data.urls` to be an array of strings
        alert(`${isVideo ? "Videos" : "Images"} uploaded Successfully`);
      })
      .finally(() => setLoading(false))
      .catch(console.log);
  }

  // Handle file upload
  const uploadMedia = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      return;
    }

    // Determine if the file is a video
    const isVideo = files[0].type.startsWith("video");

    if (files.length === 1) {
      const base64 = (await convertBase64(files[0])) as string | ArrayBuffer | null;
      uploadSingleMedia(base64, isVideo); // Check if it's a video
      return;
    }

    const base64s: string[] = [];
    for (var i = 0; i < files.length; i++) {
      const base = await convertBase64(files[i]);
      base64s.push(base as string);
    }

    uploadMultipleMedia(base64s, isVideo); // Upload multiple media
  };

  // Input for upload
  function UploadInput() {
    return (
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              aria-hidden="true"
              className="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG, GIF or MP4 (MAX. 800x400px for images)
            </p>
          </div>
          <input
            onChange={uploadMedia}
            id="dropzone-file"
            type="file"
            className="hidden"
            multiple
            accept="image/*,video/*" // Accept images and videos
          />
        </label>
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-col m-8">
      <div>
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
          Upload Photo or Video
        </h2>
      </div>

      <div>
        {/* Handle single and multiple URLs */}
        {urls && (Array.isArray(urls) ? (
          urls.map((url, index) => (
            <div key={index}>
              Access your file at{" "}
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
            </div>
          ))
        ) : (
          <div>
            Access your file at{" "}
            <a href={urls} target="_blank" rel="noopener noreferrer">
              {urls}
            </a>
          </div>
        ))}
      </div>

      <div>
        {loading ? (
          <div className="flex items-center justify-center">
            <img src={logo} alt="Loading" />
          </div>
        ) : (
          <UploadInput />
        )}
      </div>
    </div>
  );
}
