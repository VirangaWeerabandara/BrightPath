import React from 'react'
import { Button,Navbar, Footer, } from "flowbite-react";
import logo from '../assets/logo.png'; 
import picture from '../assets/picture.png';
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";


interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-center">
        <img src={icon} alt={title} className="size-12" />
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
  
    


function LandingPage() {

    const features = [
        { icon: "/path/to/robust-workflow-icon.svg", title: "Robust workflow", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum." },
        { icon: "/path/to/flexibility-icon.svg", title: "Flexibility", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum." },
        { icon: "/path/to/user-friendly-icon.svg", title: "User friendly", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum." },
        { icon: "/path/to/multiple-layouts-icon.svg", title: "Multiple layouts", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum." },
        { icon: "/path/to/better-components-icon.svg", title: "Better components", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum." },
        { icon: "/path/to/well-organised-icon.svg", title: "Well organised", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum." },
      ];
  return (
    <>
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="BrightPath Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">BrightPath</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button outline gradientDuoTone="purpleToBlue">Get started</Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#" >About</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>

{/* Hero Section */}
    <section className="container mx-auto flex flex-col items-center px-10 py-12 lg:flex-row lg:justify-between lg:py-20">
    {/* Text content */}
    <div className="lg:w-1/2">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl">
        Empower your learning journey
        </h1>
        <p className="mb-6 text-lg text-gray-600 lg:text-xl">
        From foundational skills to advanced expertise, streamline your studies with personalized courses designed to help you achieve your goals and succeed at your own pace.
        </p>
        <div className="flex space-x-4">
        <button className="rounded-md bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700">
            Get Started
        </button>
        <button className="flex items-center text-purple-600 transition hover:text-purple-700">
            Watch Video
        </button>
        </div>
    </div>

    {/* Image */}
    <div className="relative mt-8 hidden lg:mt-0 lg:block lg:w-1/2">
        <div className="mx-auto w-full max-w-lg">
        <img
            src={picture}
            alt="Woman with laptop"
            className="h-auto w-full"
        />
        </div>
    </div>
    </section>

{/* Features Section */}
<div className="container mx-auto px-4 py-16">
      <h2 className="mb-2 text-center text-4xl font-bold">Tailor-made features</h2>
      <p className="mb-12 text-center text-xl text-gray-600">
        Lorem ipsum is common placeholder text used to demonstrate the graphic elements of a document or visual presentation.
      </p>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>

<Footer container className="bg-primary-100">
      <div className="w-full" >
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <Footer.Brand
              href="https://flowbite.com"
              src={logo}
              alt="BrightPath Logo"
              name="BrightPath"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Flowbite</Footer.Link>
                <Footer.Link href="#">Tailwind CSS</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Github</Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="BrightPath™" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
    </>
  )
}

export default LandingPage