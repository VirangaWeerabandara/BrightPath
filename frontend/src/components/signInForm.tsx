import { Button, Label, Modal, TextInput } from "flowbite-react";
import { RefObject, useState, FormEvent, ChangeEvent } from "react";
import { useSignIn } from '../hooks/useSignIn';

interface SignInModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  emailInputRef: RefObject<HTMLInputElement>;
  onSignInSuccess?: (userData: any) => void;
}

interface FormData {
  email: string;
  password: string;
}

export function SignInForm({ openModal, setOpenModal, emailInputRef, onSignInSuccess }: SignInModalProps) {  
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: ""
  });
  const { handleSignIn, error, isLoading } = useSignIn(setOpenModal, onSignInSuccess);
  
// Update the handleSubmit function with proper data handling
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  await handleSignIn(formData);
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}