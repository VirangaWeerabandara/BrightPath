import React from 'react'

function SignupPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Teacher Signup */}
      <div className="w-1/2 flex items-center justify-center bg-blue-600">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Sign up as a Teacher</h2>
          <p className="text-white mb-8">Share your knowledge and inspire students</p>
          <button
            className="bg-white text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-100 transition duration-300"
          >
            Teacher Sign Up
          </button>
        </div>
      </div>

      {/* Student Signup */}
      <div className="w-1/2 flex items-center justify-center bg-green-600">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Sign up as a Student</h2>
          <p className="text-white mb-8">Start your learning journey today</p>
          <button
            className="bg-white text-green-600 font-bold py-2 px-4 rounded-lg hover:bg-green-100 transition duration-300"
          >
            Student Sign Up
          </button>
        </div>
      </div>

      {/* Back to Login Button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
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