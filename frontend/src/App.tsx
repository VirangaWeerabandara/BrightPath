import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router and Route components
import LandingPage from './pages/landingPage';
import SignupPage from './pages/signupPage';
import CoursePage from './pages/coursePage';
import { StudentSignUpForm } from './components/studentSignupForm';
import UploadMedia from './components/uploadMedia';

function App() {
  return (
    <Router> {/* Wrap your app with Router */}
      <Routes>
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/signup" element={<SignupPage />} /> 
        <Route path="/course" element={<CoursePage />} /> 
        <Route path="/upload" element={<UploadMedia />} /> 

      </Routes>
    </Router>
  );
}

export default App;
