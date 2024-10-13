import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { RefObject } from "react";

interface SignInModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  emailInputRef: RefObject<HTMLInputElement>;
}

export function SignInForm({ openModal, setOpenModal, emailInputRef }: SignInModalProps) {
  return (
    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} initialFocus={emailInputRef}>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to <span className="font-semibold text-primary-600">BrightPath</span></h3>
          <div>
            <div className="block mb-2">
              <Label htmlFor="email" value="Your Email" />
            </div>
            <TextInput id="email" ref={emailInputRef} placeholder="name@company.com" required />
          </div>
          <div>
            <div className="block mb-2">
              <Label htmlFor="password" value="Your Password" />
            </div>
            <TextInput id="password" type="password" required />
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <a href="#" className="text-sm dark:text-secondary-600 text-cyan-700 hover:underline">
              Lost Password?
            </a>
          </div>
          <div className="flex justify-center w-full">
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
