import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TeacherSignUpForm } from '../../components/teacherSignupForm';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Mock dependencies
jest.mock('axios');
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('TeacherSignUpForm', () => {
  const mockProps = {
    openModal: true,
    setOpenModal: jest.fn(),
    emailInputRef: { current: null },
    setOpenLoginModal: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders teacher signup form correctly', () => {
    render(<TeacherSignUpForm {...mockProps} />);
    
    expect(screen.getByText('Sign Up as a Teacher')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/NIC/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Password/i)).toBeInTheDocument();
  });

  test('validates form inputs correctly', async () => {
    render(<TeacherSignUpForm {...mockProps} />);
    
    // Submit with empty form
    fireEvent.click(screen.getByRole('button', { name: /Create account/i }));
    
    // Validation error messages should appear
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('All fields are required');
    });
  });

  test('submits form with valid data', async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { firstName: 'John', lastName: 'Doe', token: 'mock-token' }
    });

    render(<TeacherSignUpForm {...mockProps} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/NIC/i), { target: { value: '123456789V' } });
    fireEvent.change(screen.getByLabelText(/Your Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Your Password/i), { target: { value: 'Password123!' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create account/i }));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/teacher/signup'),
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          nic: '123456789V',
          email: 'john@example.com',
          password: 'Password123!'
        })
      );
      expect(toast.success).toHaveBeenCalledWith('Teacher account created successfully!');
      expect(mockProps.setOpenModal).toHaveBeenCalledWith(false);
    });
  });

  test('handles signup error', async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: {
        data: { error: 'Email already in use' }
      }
    });

    render(<TeacherSignUpForm {...mockProps} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/NIC/i), { target: { value: '123456789V' } });
    fireEvent.change(screen.getByLabelText(/Your Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Your Password/i), { target: { value: 'Password123!' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create account/i }));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email already in use');
    });
  });
});