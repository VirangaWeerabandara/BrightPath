import React, { useState } from 'react'
import { SignInForm } from '../components/signInForm'
import { Button } from 'flowbite-react';
import {Player} from '@lottiefiles/react-lottie-player';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import { useNavigate } from 'react-router-dom';

function SignupPage() {

  const [openModal, setOpenModal] = useState(false);
  const emailInputRef = React.createRef<HTMLInputElement>();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Logo at the top-left */}
      <div onClick={() => navigate('/')} className="absolute top-4 left-4"> {/* Home page link */}
        <img
          src={logo} // Replace with the path to your logo
          alt="Logo"
          className="w-auto h-10" // Adjust height and width of the logo
        />
      </div>
      {/* Centered Animated Object */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Player
          autoplay
          loop
          src="https://lottie.host/d4d379ee-9b69-4236-bd72-323ca3bfcdff/IkYgCrPJSD.json"  // Replace with your Lottie JSON URL
          style={{ 
            height: '50vw', // Makes the height 50% of the viewport width
            width: '50vw',  // Makes the width 50% of the viewport width
            maxWidth: '500px', // Sets a maximum width
            maxHeight: '500px', // Sets a maximum height
            minWidth: '100px', // Sets a minimum width
            minHeight: '100px'  // Sets a minimum height 
          }}
        />
      </div>
      {/* Teacher Signup */}
      <div className="flex items-center justify-center w-1/2 bg-white">
        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold text-neutral-900">Sign up as a Teacher</h2>
          <p className="mb-8 text-neutral-900">Share your knowledge and inspire students</p>
          <div className='flex items-center justify-center'>
          <Button outline gradientDuoTone="purpleToBlue" className='font-bold'>
        Teacher Sign Up
      </Button>
          </div>

        </div>
      </div>

      {/* Student Signup */}
      <div className="flex items-center justify-center w-1/2 bg-primary-100">
        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold text-neutral-900">Sign up as a Student</h2>
          <p className="mb-8 text-neutral-900">Start your learning journey today</p>
          <div className='flex items-center justify-center'>
          <Button outline gradientDuoTone="purpleToBlue" className='font-bold'>
        Student Sign Up
      </Button>
          </div>
        </div>
      </div>

      {/* Back to Login Button */}
      <div className="absolute -translate-x-1/2 bottom-8 left-1/2">
        <button
          className="text-gray-600 hover:text-gray-800"
          onClick={() => setOpenModal(true)}
        >
          Already have an account? Log in
        </button>
        <SignInForm 
        openModal={openModal} 
        setOpenModal={setOpenModal} 
        emailInputRef={emailInputRef} 
      />
      </div>
    </div>
  )
}

export default SignupPage