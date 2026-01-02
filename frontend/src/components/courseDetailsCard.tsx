import React from "react";
import { Modal, Button } from "flowbite-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { env } from "../config/env.config";
import defaultThumbnail from "../assets/default-course-thumbnail.png";

interface CourseDetailsModalProps {
  show: boolean;
  onClose: () => void;
  course: {
    _id: string;
    name: string;
    description: string;
    category: string;
    thumbnails: string[];
    teacherId: {
      firstName: string;
      lastName: string;
    };
  };
  isLoggedIn: boolean;
}

const CourseDetailsCard: React.FC<CourseDetailsModalProps> = ({
  show,
  onClose,
  course,
  isLoggedIn,
}) => {
  const navigate = useNavigate();

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      toast("Please login to enroll in this course", {
        icon: "👋",
        duration: 3000,
      });
      onClose();
      navigate("/signup");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${env.apiUrl}/student/courses/${course._id}/enroll`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to enroll in course");
      }

      toast.success("Successfully enrolled in course!");
      onClose();
      navigate("/my-learning");
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to enroll in course",
      );
    }
  };

  return (
    <Modal
      show={show}
      onClose={onClose}
      size="2xl"
      dismissible
      className="backdrop-blur-sm"
    >
      <Modal.Header className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="space-y-2">
          <h3 className="text-3xl font-bold text-gray-900">{course.name}</h3>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-sm font-semibold text-white">
              {course.teacherId.firstName[0]}
            </div>
            <p className="text-sm font-medium text-gray-700">
              {course.teacherId.firstName} {course.teacherId.lastName}
            </p>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="space-y-6 bg-white p-6">
        {/* Course Thumbnail */}
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 shadow-lg">
          <img
            src={course.thumbnails?.[0] || defaultThumbnail}
            alt={course.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = defaultThumbnail;
            }}
          />
        </div>

        {/* Course Details */}
        <div className="space-y-5">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-1.5 text-sm font-semibold text-white shadow-md">
              {course.category}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-3 rounded-lg bg-gray-50 p-5">
            <h4 className="text-xl font-bold text-gray-900">
              About this course
            </h4>
            <p className="text-base leading-relaxed text-gray-700">
              {course.description}
            </p>
          </div>

          {/* What you'll learn section */}
          <div className="rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 p-6 shadow-sm">
            <h4 className="mb-4 text-xl font-bold text-gray-900">
              What you'll learn
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-xs text-white">
                  ✓
                </span>
                <span className="text-gray-700">
                  Full course curriculum with structured lessons
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-xs text-white">
                  ✓
                </span>
                <span className="text-gray-700">
                  Lifetime access to all course materials
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-xs text-white">
                  ✓
                </span>
                <span className="text-gray-700">
                  Learn at your own pace, anytime
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-xs text-white">
                  ✓
                </span>
                <span className="text-gray-700">
                  Access on mobile and desktop devices
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-t border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm font-medium text-gray-700">
            {isLoggedIn
              ? "🎓 Ready to start your learning journey?"
              : "🔐 Login required to enroll in this course"}
          </div>
          <div className="flex gap-3">
            <Button
              color="gray"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              Close
            </Button>
            <Button
              gradientDuoTone="purpleToBlue"
              onClick={handleEnroll}
              className="font-semibold shadow-md transition-all hover:shadow-lg"
            >
              {isLoggedIn ? "🚀 Enroll Now" : "Login to Enroll"}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CourseDetailsCard;
