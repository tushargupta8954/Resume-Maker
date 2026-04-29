import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaHome,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaRocket,
  FaUser,
} from 'react-icons/fa';
import { logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FaHome },
    { name: 'My Resumes', path: '/resumes', icon: FaFileAlt },
    { name: 'Settings', path: '/settings', icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen transition-transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-white border-r border-gray-200 w-64
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center gap-2">
              <FaRocket className="text-2xl text-primary-600" />
              <span className="text-xl font-bold text-gray-900">ResumeAI</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                {user?.profileImage?.url ? (
                  <img
                    src={user.profileImage.url}
                    alt={user.firstName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="text-primary-600 text-xl" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-600 capitalize">{user?.subscription} Plan</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${
                          isActive
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <item.icon className="text-xl" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? (
                <FaTimes className="text-xl text-gray-600" />
              ) : (
                <FaBars className="text-xl text-gray-600" />
              )}
            </button>

            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium">
                {user?.resumeCount || 0} Resumes
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;