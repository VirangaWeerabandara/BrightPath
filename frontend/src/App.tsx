import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router and Route components
import LandingPage from './pages/landingPage';
import SignupPage from './pages/signupPage';
import CoursePage from './pages/coursePage';
import { StudentSignUpForm } from './components/studentSignupForm';
import UploadMedia from './pages/uploadMedia';
import { ProtectedRoute } from './components/ProtectedRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router> {/* Wrap your app with Router */}
      <Routes>
      <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <UploadMedia />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/course" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CoursePage />
            </ProtectedRoute>
          } 
        />

      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
