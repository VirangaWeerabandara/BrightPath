import React, { useEffect, useRef, useState } from "react";
import { Button, Navbar, Footer } from "flowbite-react";
import logo from "../assets/logo.png";
import picture from "../assets/picture.png";
import courseIcon from "../assets/course.png";
import instructorIcon from "../assets/instructor.png";
import flexibleIcon from "../assets/flexible.png";
import interactiveIcon from "../assets/interactive.png";
import certificateIcon from "../assets/certificate.png";
import techIcon from "../assets/tech.png";
import background from "../assets/background.png";
import { SignInForm } from "../components/signInForm";
import { useNavigate } from "react-router-dom";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import SettingsCard from "../components/SettingsCard";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="rounded-lg bg-white p-6 shadow">
    <div className="mb-4 flex items-center justify-center">
      <img src={icon} alt={title} className="size-12" />
    </div>
    <h3 className="mb-2 text-xl font-bold">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

function LandingPage() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSignInSuccess = (userData: any) => {
    setUser(userData);
  };

  const handleProfileUpdate = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({ name: "", email: "", message: "" });
  };

  const features = [
    {
      icon: courseIcon,
      title: "Wide Range of Courses",
      description:
        "We offer a diverse selection of courses across multiple disciplines, including technology, business, creative arts, and personal development. Whether you’re a beginner or an advanced learner, we have something for everyone.",
    },
    {
      icon: instructorIcon,
      title: "Expert Instructors",
      description:
        "Our courses are taught by industry experts and educators with real-world experience. They bring in-depth knowledge and practical insights to help you learn the skills you need to succeed.",
    },
    {
      icon: flexibleIcon,
      title: "Flexible Learning",
      description:
        "Learn at your own pace! With our on-demand video lessons, you can fit learning into your schedule, whether you're balancing a full-time job, school, or other commitments.",
    },
    {
      icon: interactiveIcon,
      title: "Interactive & Engaging",
      description:
        "We believe in active learning. Our platform provides interactive quizzes, assignments, and peer collaboration opportunities, ensuring that you stay engaged and apply your new skills effectively.",
    },
    {
      icon: certificateIcon,
      title: "Certificates of Completion",
      description:
        "Upon successfully completing a course, you’ll earn a certificate that you can share on your resume, LinkedIn profile, or with potential employers.",
    },
    {
      icon: techIcon,
      title: "Cutting-Edge Technology",
      description:
        "Stay ahead of the curve with our latest courses in emerging fields like artificial intelligence, data science, cybersecurity, and blockchain technology.",
    },
  ];
  return (
    <>
      <div
        className=" h-screen bg-cover"
        style={{ backgroundImage: `url(${background})` }}
      >
        <Navbar
          fluid
          rounded
          className="fixed left-0 top-0 z-50 w-full bg-white/20 backdrop-blur-lg"
        >
          <Navbar.Brand
            onClick={() => navigate("/")}
            className="cursor-pointer"
          >
            <img src={logo} className="mr-3 h-6 sm:h-9" alt="BrightPath Logo" />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              BrightPath
            </span>
          </Navbar.Brand>
          <div className="flex md:order-2">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex cursor-pointer items-center space-x-2"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <FaUserCircle className="size-8 text-gray-700 " />
                  <span className="font-medium text-gray-700">
                    {user.firstName}
                  </span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg bg-white py-1 shadow-lg">
                    {user.role === "teacher" ? (
                      // Teacher dropdown options
                      <>
                        <button
                          onClick={() => {
                            navigate("/dashboard");
                            setIsDropdownOpen(false);
                          }}
                          className="flex w-full items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100/80"
                        >
                          <span>Dashboard</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/create-course");
                            setIsDropdownOpen(false);
                          }}
                          className="flex w-full items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100/80"
                        >
                          <span>Create Course</span>
                        </button>
                        <hr className="my-1 border-gray-200" />
                      </>
                    ) : (
                      // Student dropdown options
                      <>
                        <button
                          onClick={() => {
                            navigate("/my-learning");
                            setIsDropdownOpen(false);
                          }}
                          className="flex w-full items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100/80"
                        >
                          <span>My Learning</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowSettings(true);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100/80"
                        >
                          Settings
                        </button>
                        <hr className="my-1 border-gray-200" />
                      </>
                    )}
                    <button
                      onClick={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        setUser(null);
                        navigate("/");
                        setIsDropdownOpen(false);
                      }}
                      className="flex w-full items-center space-x-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100/80"
                    >
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  onClick={() => setOpenModal(true)}
                  outline
                  gradientDuoTone="purpleToBlue"
                  className="w-24 text-lg font-bold"
                >
                  Login
                </Button>
                <SignInForm
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  emailInputRef={emailInputRef}
                  onSignInSuccess={handleSignInSuccess}
                />
              </>
            )}
            <Navbar.Toggle />
          </div>
          <Navbar.Collapse>
            <Navbar.Link
              href="#home"
              active
              className="text-lg font-bold text-neutral-900"
            >
              Home
            </Navbar.Link>
            <Navbar.Link
              onClick={() => navigate("/courses")}
              className="cursor-pointer text-lg font-bold text-neutral-900"
            >
              Courses
            </Navbar.Link>
            <Navbar.Link
              href="#about"
              className="text-lg font-bold text-neutral-900"
            >
              About
            </Navbar.Link>
            <Navbar.Link
              href="#contact"
              className="text-lg font-bold text-neutral-900"
            >
              Contact
            </Navbar.Link>
          </Navbar.Collapse>
        </Navbar>

        {/* Hero Section */}
        <section
          id="home"
          className="container mx-auto flex flex-col items-center px-10 py-12 lg:flex-row lg:justify-between lg:py-20"
        >
          <div className="w-full text-center lg:w-1/2 lg:text-left">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Empower your learning journey
            </h1>
            <p className="mb-6 text-base text-gray-600 sm:text-lg lg:text-xl">
              From foundational skills to advanced expertise, streamline your
              studies with personalized courses designed to help you achieve
              your goals and succeed at your own pace.
            </p>
            <div className="flex justify-center space-x-4 lg:justify-start">
              <button
                onClick={() => navigate("/signup")}
                className="rounded-md bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-700"
              >
                SignUp
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <img
                src={picture}
                alt="Woman with laptop"
                className="mx-auto w-full max-w-[300px] transition-transform duration-300 hover:scale-105 sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]"
                style={{
                  filter: "drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.15))",
                }}
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <div id="about" className="container mx-auto mt-10 px-4 py-16">
          <section className="container mx-auto px-6 py-12">
            <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 lg:text-4xl">
              About Us
            </h2>
            <p className="mb-8 text-center text-lg text-gray-700 lg:text-xl">
              Welcome to{" "}
              <span className="font-semibold text-primary-600">BrightPath</span>
              , your ultimate destination for personalized learning! We are
              dedicated to providing high-quality, accessible education that
              empowers learners around the globe. Whether you are looking to
              pick up a new skill, advance your career, or explore your
              passions, our platform is designed to help you achieve your goals.
            </p>
          </section>
          <section className="container mx-auto px-6 py-4">
            <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 lg:text-4xl">
              Our Mission
            </h2>
            <p className="mb-8 text-center text-lg text-gray-700 lg:text-xl">
              At{" "}
              <span className="font-semibold text-purple-600">BrightPath</span>,
              our mission is simple: to make learning accessible, engaging, and
              impactful. We believe that education has the power to transform
              lives, and we strive to create a platform where everyone has the
              opportunity to learn and grow, regardless of their background or
              location.
            </p>
          </section>
          <h2 className="mb-2 py-6 text-center text-4xl font-bold">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        <section id="contact" className="bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
            <h2 className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Contact Us
            </h2>
            <p className="mb-8 text-center font-light text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
              For any questions or feedback, our team at BrightPath is here to
              help you. Reach out to us through the form below, and we’ll
              respond promptly to ensure you have the best learning experience
              possible!
            </p>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Your name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:shadow-sm-light dark:placeholder:text-gray-400 dark:focus:border-primary-600 dark:focus:ring-primary-600"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:shadow-sm-light dark:placeholder:text-gray-400 dark:focus:border-primary-600 dark:focus:ring-primary-600"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400"
                >
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-600 dark:focus:ring-primary-600"
                  placeholder="Leave a comment..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              <button
                type="submit"
                className="rounded-md bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                Send message
              </button>
            </form>
          </div>
          {user && (
            <SettingsCard
              show={showSettings}
              onClose={() => setShowSettings(false)}
              user={user}
              onUpdateSuccess={handleProfileUpdate}
            />
          )}
        </section>

        <Footer container className="bg-primary-100">
          <div className="w-full">
            <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
              <div>
                <Footer.Brand
                  onClick={() => navigate("/")}
                  src={logo}
                  alt="BrightPath Logo"
                  name="BrightPath"
                  className="cursor-pointer"
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
  );
}

export default LandingPage;
