import React, { useState } from "react";
import { motion } from "framer-motion";
import { SignInForm } from "../components/signInForm";
import { Button } from "flowbite-react";
import { Player } from "@lottiefiles/react-lottie-player";
import { useNavigate } from "react-router-dom";
import { StudentSignUpForm } from "../components/studentSignupForm";
import { TeacherSignUpForm } from "../components/teacherSignupForm";
import { Toaster } from "react-hot-toast";
import logo from "../assets/logo.png";
import { PageTransition } from "../components/pageTransition";

function SignupPage() {
  const [openModalSignIn, setOpenModalSignIn] = useState(false);
  const [openModalStudentSignUp, setOpenModalStudentSignUp] = useState(false);
  const [openModalTeacherSignUp, setOpenModalTeacherSignUp] = useState(false);

  const emailInputRefSignIn = React.createRef<HTMLInputElement>();
  const emailInputRefStudentSignUp = React.createRef<HTMLInputElement>();
  const emailInputRefTeacherSignUp = React.createRef<HTMLInputElement>();

  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="flex h-screen bg-gray-100">
        {/* Logo at the top-left */}
        <motion.div
          onClick={() => navigate("/")}
          className="absolute left-4 top-4 z-50 cursor-pointer transition-opacity hover:opacity-80"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-auto"
            style={{ cursor: "pointer" }}
          />
        </motion.div>

        {/* Centered Animated Object */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Player
            autoplay
            loop
            src="https://lottie.host/d4d379ee-9b69-4236-bd72-323ca3bfcdff/IkYgCrPJSD.json"
            style={{
              height: "50vw",
              width: "50vw",
              maxWidth: "500px",
              maxHeight: "500px",
              minWidth: "100px",
              minHeight: "100px",
            }}
          />
        </div>

        {/* Teacher Signup */}
        <motion.div
          className="flex w-1/2 items-center justify-center bg-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-bold text-neutral-900">
              Sign up as a Teacher
            </h2>
            <p className="mb-8 text-neutral-900">
              Share your knowledge and inspire students
            </p>
            <div className="flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setOpenModalTeacherSignUp(true)}
                  outline
                  gradientDuoTone="purpleToBlue"
                  className="font-bold"
                >
                  Teacher Sign Up
                </Button>
              </motion.div>
              <TeacherSignUpForm
                openModal={openModalTeacherSignUp}
                setOpenModal={setOpenModalTeacherSignUp}
                emailInputRef={emailInputRefTeacherSignUp}
                setOpenLoginModal={setOpenModalSignIn}
              />
            </div>
          </div>
        </motion.div>

        {/* Student Signup */}
        <motion.div
          className="flex w-1/2 items-center justify-center bg-primary-100"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-bold text-neutral-900">
              Sign up as a Student
            </h2>
            <p className="mb-8 text-neutral-900">
              Start your learning journey today
            </p>
            <div className="flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  outline
                  gradientDuoTone="purpleToBlue"
                  className="font-bold"
                  onClick={() => setOpenModalStudentSignUp(true)}
                >
                  Student Sign Up
                </Button>
              </motion.div>
              <StudentSignUpForm
                openModal={openModalStudentSignUp}
                setOpenModal={setOpenModalStudentSignUp}
                emailInputRef={emailInputRefStudentSignUp}
                setOpenLoginModal={setOpenModalSignIn} // Add this prop
              />
            </div>
          </div>
        </motion.div>

        {/* Login Button */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            className="text-gray-600 transition-colors hover:text-gray-800"
            onClick={() => setOpenModalSignIn(true)}
          >
            Already have an account? Log in
          </button>
          <SignInForm
            openModal={openModalSignIn}
            setOpenModal={setOpenModalSignIn}
            emailInputRef={emailInputRefSignIn}
          />
        </motion.div>

        {/* Toast Container */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 2000,
            },
            error: {
              duration: 2000,
            },
          }}
        />
      </div>
    </PageTransition>
  );
}

export default SignupPage;
