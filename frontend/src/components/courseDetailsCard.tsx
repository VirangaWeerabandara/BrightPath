import React from "react";
import { Modal, Button } from "flowbite-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { env } from "../config/env.config";

interface CourseDetailsModalProps {
  show: boolean;
  onClose: () => void;
  course: {
    _id: string;
    name: string;
    description: string;
    category: string;
    thumbnails: Array<{ url: string }>;
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
    <Modal show={show} onClose={onClose} size="xl" dismissible>
      <Modal.Header className="border-b border-gray-200">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold text-gray-900">
            {course.name}
          </h3>
          <p className="text-sm text-gray-600">
            Instructor: {course.teacherId.firstName} {course.teacherId.lastName}
          </p>
        </div>
      </Modal.Header>

      <Modal.Body className="space-y-6">
        {/* Course Thumbnail */}
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={course.thumbnails?.[0]?.url || "/default-thumbnail.png"}
            alt={course.name}
            className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>

        {/* Course Details */}
        <div className="space-y-4">
          {/* Category Badge */}
          <div>
            <span className="bg-primary-50 text-primary-700 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
              {course.category}
            </span>
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <h4 className="text-lg font-semibold text-gray-900">
              About this course
            </h4>
            <p className="text-base text-gray-700">{course.description}</p>
          </div>

          {/* What you'll learn section */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-3 text-lg font-semibold text-gray-900">
              What you'll learn
            </h4>
            <ul className="list-inside list-disc space-y-2 text-gray-700">
              <li>Full course curriculum</li>
              <li>Lifetime access</li>
              <li>Learn at your own pace</li>
              <li>Access on mobile and desktop</li>
            </ul>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-t border-gray-200">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-gray-600">
            {isLoggedIn
              ? "Click enroll to start learning"
              : "Login required to enroll in this course"}
          </div>
          <div className="flex gap-3">
            <Button color="gray" onClick={onClose}>
              Close
            </Button>
            <Button gradientDuoTone="purpleToBlue" onClick={handleEnroll}>
              {isLoggedIn ? "Enroll Now" : "Login to Enroll"}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CourseDetailsCard;
