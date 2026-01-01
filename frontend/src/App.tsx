import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import LandingPage from "./pages/landingPage";
import SignupPage from "./pages/signupPage";
import CoursePage from "./pages/coursePage";
import DashboardPage from "./pages/dashboardPage";
import CreateCourse from "./pages/createCoursePage";
import ProfilePage from "./pages/teacherProfilePage";
import TeacherCoursePage from "./pages/teacherCoursePage";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyLearningPage from "./pages/myLearningPage";
import { Toaster } from "react-hot-toast";
import EditCoursePage from "./pages/editCoursePage";
import { AnimatePresence } from "framer-motion";
import CourseViewPage from "./pages/courseViewPage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-course"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <CourseViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-courses"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherCoursePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/edit/:courseId"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <EditCoursePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-learning"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyLearningPage />
            </ProtectedRoute>
          }
        />
        <Route path="/courses" element={<CoursePage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <AnimatedRoutes />
        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
