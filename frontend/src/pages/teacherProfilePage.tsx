import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/TeacherDashboardLayout';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { env } from '../config/env.config';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  nic?: string;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    nic: ''
  });
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setProfile({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      nic: user.nic || ''
    });
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
  
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
  
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
  
      if (!token || !user._id) {
        toast.error('Please login again');
        return;
      }
  
      await axios.put(
        `${env.apiUrl}/users/${user._id}/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordChange(false);
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
  
      if (!token || !user._id) {
        toast.error('Please login again');
        return;
      }
  
      const response = await axios.put(
        `${env.apiUrl}/users/${user._id}`,
        profile,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Update local storage with new user data
      const updatedUser = {
        ...user,
        ...response.data
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          {profile.nic !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700">NIC</label>
              <input
                type="text"
                name="nic"
                value={profile.nic}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
        {/* Add this after the existing form */}
<div className="mt-8">
  <button
    type="button"
    onClick={() => setShowPasswordChange(!showPasswordChange)}
    className="text-primary-600 hover:text-primary-700"
  >
    {showPasswordChange ? 'Cancel Password Change' : 'Change Password'}
  </button>

  {showPasswordChange && (
    <form onSubmit={handlePasswordChange} className="mt-4 space-y-6">
<div>
  <label className="block text-sm font-medium text-gray-700">
    Current Password
  </label>
  <div className="relative">
    <input
      type={showPasswords.current ? "text" : "password"}
      value={passwordData.currentPassword}
      onChange={(e) => setPasswordData(prev => ({
        ...prev,
        currentPassword: e.target.value
      }))}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 pr-10"
      required
    />
    <button
      type="button"
      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
      className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1 text-gray-600 cursor-pointer"
    >
      {showPasswords.current ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
    </button>
  </div>
</div>

<div>
  <label className="block text-sm font-medium text-gray-700">
    New Password
  </label>
  <div className="relative">
    <input
      type={showPasswords.new ? "text" : "password"}
      value={passwordData.newPassword}
      onChange={(e) => setPasswordData(prev => ({
        ...prev,
        newPassword: e.target.value
      }))}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 pr-10"
      required
    />
    <button
      type="button"
      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
      className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1 text-gray-600 cursor-pointer"
    >
      {showPasswords.new ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
    </button>
  </div>
</div>

<div>
  <label className="block text-sm font-medium text-gray-700">
    Confirm New Password
  </label>
  <div className="relative">
    <input
      type={showPasswords.confirm ? "text" : "password"}
      value={passwordData.confirmPassword}
      onChange={(e) => setPasswordData(prev => ({
        ...prev,
        confirmPassword: e.target.value
      }))}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 pr-10"
      required
    />
    <button
      type="button"
      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
      className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1 text-gray-600 cursor-pointer"
    >
      {showPasswords.confirm ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
    </button>
  </div>
</div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Updating Password...' : 'Update Password'}
        </button>
      </div>
    </form>
  )}
</div>
      </div>
    </DashboardLayout>
  );
}