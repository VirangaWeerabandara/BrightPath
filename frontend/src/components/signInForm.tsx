import { Button, Label, Modal, TextInput } from "flowbite-react";
import { RefObject, useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SignInModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  emailInputRef: RefObject<HTMLInputElement>;
}

interface FormData {
  email: string;
  password: string;
}

export function SignInForm({ openModal, setOpenModal, emailInputRef }: SignInModalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);

// Update the handleSubmit function with proper data handling
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError(null);

  try {
    // Try teacher login first
    const teacherResponse = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...formData, role: 'teacher' })
    });

    const teacherData = await teacherResponse.json();

    if (teacherResponse.ok) {
      // Store token and teacher data directly from response
      localStorage.setItem('token', teacherData.token);
      localStorage.setItem('user', JSON.stringify({
        _id: teacherData._id,
        email: teacherData.email,
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        nic: teacherData.nic,
        role: 'teacher'
      }));
      
      setOpenModal(false);
      toast.success('Welcome back, teacher!');
      navigate('/upload');
      return;
    }

    // If teacher login fails, try student login
    const studentResponse = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...formData, role: 'student' })
    });

    const studentData = await studentResponse.json();

    if (studentResponse.ok) {
      // Store token and student data directly from response
      localStorage.setItem('token', studentData.token);
      localStorage.setItem('user', JSON.stringify({
        _id: studentData._id,
        email: studentData.email,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        role: 'student'
      }));
      
      setOpenModal(false);
      toast.success('Welcome back, student!');
      navigate('/course');
      return;
    }

    // If both logins fail
    setError(studentData.message || 'Invalid email or password');
    toast.error('Login failed. Please check your credentials.');

  } catch (err) {
    console.error('Login error:', err);
    setError('An error occurred during login');
    toast.error('An error occurred during login');
  }
};

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Modal 
      show={openModal} 
      size="md" 
      popup 
      onClose={() => setOpenModal(false)} 
      initialFocus={emailInputRef}
    >
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Sign in to <span className="text-primary-600 font-semibold">BrightPath</span>
          </h3>
          
          <div>
            <Label htmlFor="email" value="Your Email" />
            <TextInput 
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              required
              value={formData.email}
              onChange={handleChange}
              ref={emailInputRef}
            />
          </div>

          <div>
            <Label htmlFor="password" value="Your Password" />
            <TextInput 
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm" role="alert">
              {error}
            </div>
          )}

          <div className="flex w-full justify-center">
            <Button type="submit">Sign In</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}