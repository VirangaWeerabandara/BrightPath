import { Button, Label, Modal, TextInput } from "flowbite-react";
import { RefObject } from "react";

interface SignInModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  emailInputRef: RefObject<HTMLInputElement>;
}

export function StudentSignUpForm({ openModal, setOpenModal, emailInputRef }: SignInModalProps) {
  return (
    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} initialFocus={emailInputRef}>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to <span className="text-primary-600 font-semibold">BrightPath</span></h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="First Name" />
            </div>
            <TextInput id="email" ref={emailInputRef} placeholder="John" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Last Name" />
            </div>
            <TextInput id="email" ref={emailInputRef} placeholder="Doe" required />
          </div>
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
          <div className="flex w-full justify-center">
            <Button>Create Account</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
