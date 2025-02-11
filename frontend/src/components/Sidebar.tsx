import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'; 

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col h-screen w-64 fixed left-0 top-0 bg-white border-r">
      {/* Logo and App Name */}
      <div className="flex items-center p-4 border-b">
        <img src={logo} alt="BrightPath Logo" className="w-8 h-8 mr-2" />
        <span className="text-xl font-bold text-black">BrightPath</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        <button 
          onClick={() => navigate('/dashboard')}
          className={`flex items-center w-full p-3 rounded-lg transition-colors ${
            isActive('/dashboard') 
              ? 'bg-primary-600 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </button>

        <button 
          onClick={() => navigate('/create-course')}
          className={`flex items-center w-full p-3 rounded-lg transition-colors ${
            isActive('/create-course') 
              ? 'bg-primary-600 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Course
        </button>

        <button 
          onClick={() => navigate('/my-courses')}
          className={`flex items-center w-full p-3 rounded-lg transition-colors ${
            isActive('/my-courses') 
              ? 'bg-primary-600 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          My Courses
        </button>
      </nav>

      {/* Profile and Logout Section */}
      <div className="border-t p-4">
      <button 
    onClick={() => navigate('/profile')}
    className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
  >
    <img 
      className="w-8 h-8 rounded-full mr-3"
      src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
      alt="Profile"
    />
    <div className="flex-1 text-left">
      <p className="text-sm font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</p>
      <p className="text-xs text-gray-500">{user.email}</p>
    </div>
  </button>

        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};