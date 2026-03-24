import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase, Menu, X, ChevronDown, User, LogOut,
  LayoutDashboard, Bell
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isCompany, isApplicant } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = isCompany ? '/dashboard/company' : '/dashboard/applicant';

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
        : 'bg-white border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
              <Briefcase size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold font-display text-gray-900">
              Talent<span className="text-primary-600">Bridge</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/jobs" active={isActive('/jobs')}>Browse Jobs</NavLink>
            <NavLink to="/#features" active={false}>For Companies</NavLink>
            <NavLink to="/#features" active={false}>About</NavLink>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-primary-50 rounded-xl px-3 py-2 transition-all duration-200 border border-gray-200 hover:border-primary-200"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{user.name?.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-24 truncate">{user.name}</span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fade-in">
                      <Link to={dashboardPath} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                        <LayoutDashboard size={14} />
                        My Dashboard
                      </Link>
                      <Link to={dashboardPath} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                        <User size={14} />
                        Profile
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-5">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <MobileLink to="/jobs">Browse Jobs</MobileLink>
            <MobileLink to="/#features">For Companies</MobileLink>
            {user ? (
              <>
                <MobileLink to={dashboardPath}>Dashboard</MobileLink>
                <hr className="border-gray-100 my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1 btn-secondary text-sm text-center">Sign In</Link>
                <Link to="/register" className="flex-1 btn-primary text-sm text-center">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

const NavLink = ({ to, children, active }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-primary-50 text-primary-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    {children}
  </Link>
);

const MobileLink = ({ to, children }) => (
  <Link
    to={to}
    className="block px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
  >
    {children}
  </Link>
);
