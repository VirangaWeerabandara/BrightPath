import { Button, Label, Modal, TextInput } from "flowbite-react";
import { RefObject } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignInModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  emailInputRef: RefObject<HTMLInputElement>;
}


export function StudentSignUpForm({ openModal, setOpenModal, emailInputRef }: SignInModalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/signup/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      }
      if (response.ok) {
        // Save user to local storage
        localStorage.setItem('user', JSON.stringify(json));
        setOpenModal(false);
        navigate('/course'); // Navigate to course page after successful signup
      }
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
            Sign up to <span className="text-primary-600 font-semibold">BrightPath</span>
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

// export function StudentSignUpForm({ openModal, setOpenModal, emailInputRef }: SignInModalProps) {
//   return (
//     <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} initialFocus={emailInputRef}>
//       <Modal.Header />
//       <Modal.Body>
//         <div className="space-y-6">
//           <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to <span className="text-primary-600 font-semibold">BrightPath</span></h3>
//           <div>
//             <div className="mb-2 block">
//               <Label htmlFor="email" value="First Name" />
//             </div>
//             <TextInput id="email" ref={emailInputRef} placeholder="John" required />
//           </div>
//           <div>
//             <div className="mb-2 block">
//               <Label htmlFor="email" value="Last Name" />
//             </div>
//             <TextInput id="email" ref={emailInputRef} placeholder="Doe" required />
//           </div>
//           <div>
//             <div className="mb-2 block">
//               <Label htmlFor="email" value="Your Email" />
//             </div>
//             <TextInput id="email" ref={emailInputRef} placeholder="name@company.com" required />
//           </div>
//           <div>
//             <div className="mb-2 block">
//               <Label htmlFor="password" value="Your Password" />
//             </div>
//             <TextInput id="password" type="password" required />
//           </div>
//           <div className="flex w-full justify-center">
//             <Button>Create Account</Button>
//           </div>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// }
