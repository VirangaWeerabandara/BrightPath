import React from 'react'
import { Button,Navbar } from "flowbite-react";

function LandingPage() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        <img src="/assets/logo.png" className="mr-3 h-6 sm:h-9" alt="BrightPath Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">BrightPath</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button>Get started</Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#">About</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default LandingPage