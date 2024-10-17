import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

export default function UploadImage() {
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

  function uploadSingleImage(base64: string | ArrayBuffer | null) {
    setLoading(true);
    axios
      .post("http://localhost:4000/upload", { image: base64 })
      .then((res) => {
        // Ensure we're setting the URL properly
        setUrls(res.data.url); // Expecting `res.data.url` to be a string
        alert("Image uploaded Successfully");
      })
      .finally(() => setLoading(false))
      .catch(console.log);
  }

  function uploadMultipleImages(images: string[]) {
    setLoading(true);
    axios
      .post("http://localhost:4000/uploadMultipleImages", { images })
      .then((res) => {
        // For multiple images, set the URLs as an array
        setUrls(res.data.urls); // Expecting `res.data.urls` to be an array of strings
        alert("Images uploaded Successfully");
      })
      .finally(() => setLoading(false))
      .catch(console.log);
  }

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      return;
    }

    if (files.length === 1) {
      const base64 = (await convertBase64(files[0])) as string | ArrayBuffer | null;
      uploadSingleImage(base64);
      return;
    }

    const base64s: string[] = [];
    for (var i = 0; i < files.length; i++) {
      var base = await convertBase64(files[i]);
      base64s.push(base as string);
    }
    uploadMultipleImages(base64s);
  };

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
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            onChange={uploadImage}
            id="dropzone-file"
            type="file"
            className="hidden"
            multiple
          />
        </label>
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-col m-8">
      <div>
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
          Upload Photo
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
