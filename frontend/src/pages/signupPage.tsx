import React, { useState } from 'react';
import { SignInForm } from '../components/signInForm';
import { Button } from 'flowbite-react';
import { Player } from '@lottiefiles/react-lottie-player';
import { useNavigate } from 'react-router-dom';
import { StudentSignUpForm } from '../components/studentSignupForm';
import { TeacherSignUpForm } from '../components/teacherSignupForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';

function SignupPage() {
  const [openModalSignIn, setOpenModalSignIn] = useState(false);
  const [openModalStudentSignUp, setOpenModalStudentSignUp] = useState(false);
  const [openModalTeacherSignUp, setOpenModalTeacherSignUp] = useState(false);
  
  const emailInputRefSignIn = React.createRef<HTMLInputElement>();
  const emailInputRefStudentSignUp = React.createRef<HTMLInputElement>();
  const emailInputRefTeacherSignUp = React.createRef<HTMLInputElement>();
  
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Logo at the top-left */}
      <div onClick={() => navigate('/')} className="absolute top-4 left-4">
        <img
          src={logo}
          alt="Logo"
          className="w-auto h-10"
        />
      </div>

      {/* Centered Animated Object */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Player
          autoplay
          loop
          src="https://lottie.host/d4d379ee-9b69-4236-bd72-323ca3bfcdff/IkYgCrPJSD.json"
          style={{ 
            height: '50vw',
            width: '50vw',
            maxWidth: '500px',
            maxHeight: '500px',
            minWidth: '100px',
            minHeight: '100px'
          }}
        />
      </div>

      {/* Teacher Signup */}
      <div className="flex items-center justify-center w-1/2 bg-white">
        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold text-neutral-900">Sign up as a Teacher</h2>
          <p className="mb-8 text-neutral-900">Share your knowledge and inspire students</p>
          <div className='flex items-center justify-center'>
            <Button 
              onClick={() => setOpenModalTeacherSignUp(true)} 
              outline 
              gradientDuoTone="purpleToBlue" 
              className='font-bold'
            >
              Teacher Sign Up
            </Button>
            <TeacherSignUpForm 
              openModal={openModalTeacherSignUp} 
              setOpenModal={setOpenModalTeacherSignUp} 
              emailInputRef={emailInputRefTeacherSignUp}
              setOpenLoginModal={setOpenModalSignIn}
            />
          </div>
        </div>
      </div>

      {/* Student Signup */}
      <div className="flex items-center justify-center w-1/2 bg-primary-100">
        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold text-neutral-900">Sign up as a Student</h2>
          <p className="mb-8 text-neutral-900">Start your learning journey today</p>
          <div className='flex items-center justify-center'>
            <Button 
              outline 
              gradientDuoTone="purpleToBlue" 
              className='font-bold' 
              onClick={() => setOpenModalStudentSignUp(true)}
            >
              Student Sign Up
            </Button>
            <StudentSignUpForm 
              openModal={openModalStudentSignUp} 
              setOpenModal={setOpenModalStudentSignUp} 
              emailInputRef={emailInputRefStudentSignUp}
              setOpenLoginModal={setOpenModalSignIn} // Add this prop
            />
          </div>
        </div>
      </div>

      {/* Login Button */}
      <div className="absolute -translate-x-1/2 bottom-8 left-1/2">
        <button
          className="text-gray-600 hover:text-gray-800"
          onClick={() => setOpenModalSignIn(true)}
        >
          Already have an account? Log in
        </button>
        <SignInForm 
          openModal={openModalSignIn} 
          setOpenModal={setOpenModalSignIn} 
          emailInputRef={emailInputRefSignIn} 
        />
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default SignupPage;