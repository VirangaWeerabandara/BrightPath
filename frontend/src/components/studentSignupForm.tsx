import { Button, Label, Modal, TextInput } from "flowbite-react";
import { RefObject, useState } from "react";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { env } from "../config/env.config";

interface SignInModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  emailInputRef: RefObject<HTMLInputElement>;
  setOpenLoginModal: (open: boolean) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function StudentSignUpForm({
  openModal,
  setOpenModal,
  emailInputRef,
  setOpenLoginModal,
}: SignInModalProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${env.apiUrl}/student/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, role: "student" }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        toast.error(json.error);
        return;
      }

      // Show success notification
      toast.success("Registration successful! Please login.");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });

      // Close signup modal
      setOpenModal(false);

      // Open login modal after a short delay
      setTimeout(() => {
        setOpenLoginModal(true);
      }, 1000);
    } catch (err) {
      const errorMessage = "An error occurred during registration";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
            Sign up to{" "}
            <span className="font-semibold text-primary-600">BrightPath</span>
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

          {error && <div className="text-sm text-red-500">{error}</div>}

          <div className="flex w-full justify-center">
            <Button type="submit">Create Account</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
