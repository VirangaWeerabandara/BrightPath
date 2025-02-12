import React from "react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title }) => {
  // Transform Cloudinary URL for better streaming quality
  const transformedUrl = videoUrl.replace(
    "/upload/",
    "/upload/q_auto,f_auto,c_limit,w_1920/",
  );

  return (
    <div className="aspect-w-16 aspect-h-9 w-full">
      <video
        className="w-full rounded-lg shadow-lg"
        controls
        controlsList="nodownload"
        playsInline
        poster={videoUrl.replace(
          "/upload/",
          "/upload/q_auto,f_auto,w_1920,e_blur:1000/",
        )}
        title={title}
      >
        <source src={transformedUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
