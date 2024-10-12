import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.png";
import picture from "../assets/picture.png";
import { navItems } from "../constants";

const LandingPage = () => {

  return (
    <>
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2 space-x-8" src={logo} alt="Logo" />
            <span className="text-xl tracking-tight font-semibold text-natural-900">BrightPath</span>
          </div>
          <div className="hidden lg:flex justify-center space-x-8 items-center">
            <a href="#" className="py-2 px-3 border-2 rounded-md border-primary-600 text-natural-900 font-semibold">
              Sign In
            </a>
            <a
              href="#"
              className="bg-primary-600 py-2 px-3 rounded-md border-2 border-primary-600 text-white font-semibold"
            >
              Create an account
            </a>
          </div>
        </div>
      </div>
    </nav>
    <section className="container mx-auto px-4 py-12 flex items-center">
    <div className="lg:w-1/2">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">The easiest way to manage projects</h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-6">
            From the small stuff to the big picture, organize your work so teams know what to do, why it matters, and how to get it done.
          </p>
          <div className="flex space-x-4">
            <button className="bg-purple-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-purple-700 transition">
              Get Started
            </button>
            <button className="flex items-center text-purple-600 hover:text-purple-700 transition">
            </button>
          </div>
        </div>
        <div className="hidden lg:block w-1/2 ">
          <div className="relative">
            <img 
              src={picture} 
              alt="Woman with laptop" 
              className="w-3/4 h-3/4 object-cover"
            />
          </div>
        </div>
      </section>
    </>

    
  );
};

export default LandingPage;