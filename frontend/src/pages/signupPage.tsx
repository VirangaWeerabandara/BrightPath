import React from 'react'

function SignupPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Teacher Signup */}
      <div className="flex w-1/2 items-center justify-center bg-blue-600">
        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold text-white">Sign up as a Teacher</h2>
          <p className="mb-8 text-white">Share your knowledge and inspire students</p>
          <button
            className="rounded-lg bg-white px-4 py-2 font-bold text-blue-600 transition duration-300 hover:bg-blue-100"
          >
            Teacher Sign Up
          </button>
        </div>
      </div>

      {/* Student Signup */}
      <div className="flex w-1/2 items-center justify-center bg-green-600">
        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold text-white">Sign up as a Student</h2>
          <p className="mb-8 text-white">Start your learning journey today</p>
          <button
            className="rounded-lg bg-white px-4 py-2 font-bold text-green-600 transition duration-300 hover:bg-green-100"
          >
            Student Sign Up
          </button>
        </div>
      </div>

      {/* Back to Login Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <button
          className="text-gray-600 hover:text-gray-800"
        >
          Already have an account? Log in
        </button>
      </div>
    </div>
  )
}

export default SignupPage