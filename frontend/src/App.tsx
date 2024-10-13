import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router and Route components
import LandingPage from './pages/landingPage';
import SignupPage from './pages/signupPage';
import CoursePage from './pages/coursePage';

function App() {
  return (
    <Router> {/* Wrap your app with Router */}
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Route for the landing page */}
        <Route path="/signup" element={<SignupPage />} /> {/* Route for the signup page */}
      </Routes>
    </Router>
  );
}

export default App;
