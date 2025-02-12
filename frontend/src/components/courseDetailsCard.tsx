import React from "react";
import { Modal, Button } from "flowbite-react";
import { toast } from "react-hot-toast";
import { env } from "../config/env.config";
import { Thumbnail } from "../hooks/useCourses";

interface CourseDetailsModalProps {
  show: boolean;
  onClose: () => void;
  course: {
    _id: string;
    name: string;
    description: string;
    category: string;
    thumbnails: Thumbnail[];
  };
  isLoggedIn: boolean;
}

const CourseDetailsCard: React.FC<CourseDetailsModalProps> = ({
  show,
  onClose,
  course,
  isLoggedIn,
}) => {
  const handleEnroll = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to enroll in courses");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${env.apiUrl}/courses/${course._id}/enroll`,
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
        throw new Error(data.error || "Failed to enroll in course");
      }

      toast.success("Successfully enrolled in course!");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to enroll in course",
      );
    }
  };

  return (
    <Modal show={show} onClose={onClose} size="xl">
      <Modal.Header>
        <h3 className="text-xl font-semibold text-gray-900">{course.name}</h3>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={course.thumbnails[0].url}
              alt={course.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <div>
              <span className="bg-primary-50 inline-block rounded-full px-3 py-1 text-sm font-semibold text-primary-600">
                {course.category}
              </span>
            </div>
            <p className="text-base text-gray-700">{course.description}</p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex w-full justify-end gap-4">
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
          <Button gradientDuoTone="purpleToBlue" onClick={handleEnroll}>
            Enroll Now
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CourseDetailsCard;
