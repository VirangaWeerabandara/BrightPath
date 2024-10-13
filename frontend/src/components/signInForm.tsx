import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { RefObject } from "react";
import { useNavigate } from 'react-router-dom';

interface SignInModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  emailInputRef: RefObject<HTMLInputElement>;
}

export function SignInForm({ openModal, setOpenModal, emailInputRef }: SignInModalProps) {
    const navigate = useNavigate();
  return (
    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} initialFocus={emailInputRef}>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to <span className="text-primary-600 font-semibold">BrightPath</span></h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Your Email" />
            </div>
            <TextInput id="email" ref={emailInputRef} placeholder="name@company.com" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Your Password" />
            </div>
            <TextInput id="password" type="password" required />
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <a href="#" className="text-sm text-cyan-700 hover:underline dark:text-secondary-600">
              Lost Password?
            </a>
          </div>
          <div className="w-full ">
            <Button>Log in to your account</Button>
          </div>
          <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
            Not registered?&nbsp;
            <a href="/signup" className="text-cyan-700 hover:underline dark:text-cyan-500">
              Create account
            </a>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
