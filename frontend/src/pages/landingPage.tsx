import React, { useState } from 'react'
import { Button,Navbar, Footer, } from "flowbite-react";
import logo from '../assets/logo.png'; 
import picture from '../assets/picture.png';
import courseIcon from '../assets/course.png';
import instructorIcon from '../assets/instructor.png';
import flexibleIcon from '../assets/flexible.png';
import interactiveIcon from '../assets/interactive.png';
import certificateIcon from '../assets/certificate.png';
import techIcon from '../assets/tech.png';
import background from '../assets/background.png';
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


    const [formData, setFormData] = useState({
          name: '',
          email: '',
          message: ''
        });
      
        const handleChange = (e: { target: { name: any; value: any; }; }) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
        };
      
        const handleSubmit = (e: { preventDefault: () => void; }) => {
          e.preventDefault();
          // Handle form submission logic here
          console.log('Form submitted:', formData);
          // Reset form after submission
          setFormData({ name: '', email: '', message: '' });
        };

    const features = [
        { icon: courseIcon, title: "Wide Range of Courses", description: "We offer a diverse selection of courses across multiple disciplines, including technology, business, creative arts, and personal development. Whether you’re a beginner or an advanced learner, we have something for everyone." },
        { icon: instructorIcon, title: "Expert Instructors", description: "Our courses are taught by industry experts and educators with real-world experience. They bring in-depth knowledge and practical insights to help you learn the skills you need to succeed." },
        { icon: flexibleIcon, title: "Flexible Learning", description: "Learn at your own pace! With our on-demand video lessons, you can fit learning into your schedule, whether you're balancing a full-time job, school, or other commitments." },
        { icon: interactiveIcon, title: "Interactive & Engaging", description: "We believe in active learning. Our platform provides interactive quizzes, assignments, and peer collaboration opportunities, ensuring that you stay engaged and apply your new skills effectively." },
        { icon: certificateIcon, title: "Certificates of Completion", description: "Upon successfully completing a course, you’ll earn a certificate that you can share on your resume, LinkedIn profile, or with potential employers." },
        { icon: techIcon, title: "Cutting-Edge Technology", description: "Stay ahead of the curve with our latest courses in emerging fields like artificial intelligence, data science, cybersecurity, and blockchain technology." },
      ];
  return (
    <>
    <div className='h-screen bg-cover' style={{backgroundImage: `url(${background})`}}>
    <Navbar fluid rounded className='bg-transparent'>
      <Navbar.Brand href="https://flowbite-react.com">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="BrightPath Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">BrightPath</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button outline gradientDuoTone="purpleToBlue" className='w-24 text-lg font-bold'>Login</Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="#" active className='text-lg font-bold text-neutral-900'>
          Home
        </Navbar.Link>
        <Navbar.Link href="#" className='text-lg font-bold text-neutral-900'>About</Navbar.Link>
        <Navbar.Link href="#" className='text-lg font-bold text-neutral-900'>Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>

{/* Hero Section */}
    <section className="container mx-auto flex flex-col items-center px-10 py-12 lg:flex-row lg:justify-between lg:py-20">
    <div className="lg:w-1/2">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl">
        Empower your learning journey
        </h1>
        <p className="mb-6 text-lg text-gray-600 lg:text-xl">
        From foundational skills to advanced expertise, streamline your studies with personalized courses designed to help you achieve your goals and succeed at your own pace.
        </p>
        <div className="flex space-x-4">
        <button className="rounded-md bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700">
            SignUp
        </button>
        </div>
    </div>

    {/* Image */}
    <div className="relative mt-8 hidden lg:mt-0 lg:block lg:w-2/3">
        <div className="mx-auto w-full max-w-lg">
        <img
            src={picture}
            alt="Woman with laptop"
            className="w-[300px] h-auto sm:w-[400px] md:w-[500px] lg:w-[600px] translate-x-20 translate-y-10"
        />
        </div>
    </div>
    </section>

{/* Features Section */}
<div className="container mx-auto px-4 py-16">
    <section className="container mx-auto px-6 py-12">
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 lg:text-4xl">
        About Us
      </h2>
      <p className="mb-8 text-center text-lg text-gray-700 lg:text-xl">
        Welcome to <span className="font-semibold text-purple-600">BrightPath</span>, your ultimate destination for personalized learning! 
        We are dedicated to providing high-quality, accessible education that empowers learners around the globe. 
        Whether you are looking to pick up a new skill, advance your career, or explore your passions, our platform is designed to help you achieve your goals.
      </p>
    </section>
    <section className="container mx-auto px-6 py-4">
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 lg:text-4xl">
      Our Mission
      </h2>
      <p className="mb-8 text-center text-lg text-gray-700 lg:text-xl">
        At <span className="font-semibold text-purple-600">BrightPath</span>, our mission is simple: to make learning accessible, 
        engaging, and impactful. We believe that education has the power to transform lives, 
        and we strive to create a platform where everyone has the opportunity to learn and grow, regardless of their background or location.
      </p>
    </section>
      <h2 className="mb-2 py-6 text-center text-4xl font-bold">What We Offer</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>

    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
        <h2 className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Contact Us</h2>
        <p className="mb-8 text-center font-light text-gray-500 sm:text-xl lg:mb-16 dark:text-gray-400">For any questions or feedback, our team at BrightPath is here to help you. Reach out to us through the form below, and we’ll respond promptly to ensure you have the best learning experience possible!</p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">Your name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400">Your message</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
              placeholder="Leave a comment..."
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="rounded-lg bg-blue-700 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-fit dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Send message
          </button>
        </form>
      </div>
    </section>

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
    </div>
    </>
  )
}

export default LandingPage