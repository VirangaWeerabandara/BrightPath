import React from 'react';
import { Modal, Button } from 'flowbite-react';
import { toast } from 'react-toastify';
import { env } from '../config/env.config';

interface CourseDetailsModalProps {
  show: boolean;
  onClose: () => void;
  course: {
    _id: string;
    name: string;
    description: string;
    category: string;
    thumbnails: string[];
  };
  isLoggedIn: boolean;
}

const CourseDetailsCard: React.FC<CourseDetailsModalProps> = ({ show, onClose, course, isLoggedIn }) => {
  const handleEnroll = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to enroll in courses');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${env.apiUrl}/courses/${course._id}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enroll in course');
      }

      toast.success('Successfully enrolled in course!');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to enroll in course');
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
              src={course.thumbnails[0]}
              alt={course.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <div>
              <span className="inline-block px-3 py-1 text-sm font-semibold text-primary-600 bg-primary-50 rounded-full">
                {course.category}
              </span>
            </div>
            <p className="text-base text-gray-700">{course.description}</p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-4 w-full">
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