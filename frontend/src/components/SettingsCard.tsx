import React, { useState } from 'react';
import { Modal, Button, Label, TextInput } from 'flowbite-react';
import { toast } from 'react-hot-toast';
import { env } from '../config/env.config';

interface SettingsModalProps {
  show: boolean;
  onClose: () => void;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onUpdateSuccess: (userData: any) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ show, onClose, user, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${env.apiUrl}/student/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      toast.success('Profile updated successfully');
      onUpdateSuccess(data);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Profile Settings</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <TextInput
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <TextInput
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              name="email"
              value={formData.email}
              disabled
              className="bg-gray-100"
            />
          </div>
          <hr className="my-4" />
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <TextInput
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              required={!!formData.newPassword}
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password (optional)</Label>
            <TextInput
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required={!!formData.newPassword}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" gradientDuoTone="purpleToBlue">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default SettingsModal;