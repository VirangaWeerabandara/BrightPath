import { Button, Label, Modal, TextInput } from "flowbite-react";
import { RefObject, useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignInModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  emailInputRef: RefObject<HTMLInputElement>;
}

interface FormData {
  firstName: string;
  lastName: string;
  nic: string;
  email: string;
  password: string;
}

export function TeacherSignUpForm({ openModal, setOpenModal, emailInputRef }: SignInModalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    nic: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/signup/teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, role: 'teacher' })
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        return;
      }

      // Save user to local storage with role
      localStorage.setItem('user', JSON.stringify({ ...json, role: 'teacher' }));
      setOpenModal(false);
      navigate('/upload'); // Navigate to upload page after successful signup
    } catch (err) {
      setError('An error occurred during registration');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} initialFocus={emailInputRef}>
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Sign up as Teacher to <span className="text-primary-600 font-semibold">BrightPath</span>
          </h3>
          
          <div>
            <Label htmlFor="firstName" value="First Name" />
            <TextInput 
              id="firstName"
              name="firstName"
              placeholder="John"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="lastName" value="Last Name" />
            <TextInput 
              id="lastName"
              name="lastName"
              placeholder="Doe"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="nic" value="NIC" />
            <TextInput 
              id="nic"
              name="nic"
              placeholder="123456789V"
              required
              value={formData.nic}
              onChange={handleChange}
            />
          </div>

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

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex w-full justify-center">
            <Button type="submit">Create Account</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}