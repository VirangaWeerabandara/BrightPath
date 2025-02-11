import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { env } from '../config/env.config';

interface SignInFormData {
  email: string;
  password: string;
}

export const useSignIn = (setOpenModal: (open: boolean) => void, onSignInSuccess?: (userData: any) => void) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (formData: SignInFormData) => {
    setError(null);
    setIsLoading(true);

    const tryLogin = async (role: 'teacher' | 'student') => {
      try {
        const response = await fetch(`${env.apiUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...formData, role })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }
        
        return { data, success: true };
      } catch (error: any) {
        return { 
          error: error.message, 
          success: false 
        };
      }
    };

    try {
      // Try teacher login first
      const teacherResult = await tryLogin('teacher');
      if (teacherResult.success) {
        handleSuccessfulLogin(teacherResult.data);
        return;
      }

      // If teacher login fails, try student login
      const studentResult = await tryLogin('student');
      if (studentResult.success) {
        handleSuccessfulLogin(studentResult.data);
        return;
      }

      // If both logins fail
      setError('Invalid credentials. Please check your email and password.');
      toast.error('Login failed. Please check your credentials.');

    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = (userData: {
    token: string;
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'teacher' | 'student';
    nic?: string;
  }) => {
    localStorage.setItem('token', userData.token);
    const userToStore = {
      _id: userData._id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      ...(userData.role === 'teacher' && { nic: userData.nic }),
      role: userData.role
    };
    
    localStorage.setItem('user', JSON.stringify(userToStore));
    
    setOpenModal(false);
    toast.success(`Welcome back, ${userData.firstName}!`);
    
    // Call the callback function if provided
    if (onSignInSuccess) {
      onSignInSuccess(userToStore);
    }
    
    navigate(userData.role === 'teacher' ? '/dashboard' : '/courses');
  };

  return {
    handleSignIn,
    error,
    isLoading
  };
};