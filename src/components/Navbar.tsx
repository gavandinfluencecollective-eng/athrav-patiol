import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Camera, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <Camera className="w-8 h-8 text-orange-500 shrink-0" />
            <span className="text-lg sm:text-xl font-bold tracking-tighter text-white whitespace-nowrap">
              ATHARV PATIL <span className="text-orange-500">VIDEOGRAPHY</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-orange-500",
                  location.pathname === link.path ? "text-orange-500" : "text-gray-400"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  title="Dashboard"
                >
                  <User className="w-5 h-5 text-white" />
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    title="Admin Panel"
                  >
                    <Settings className="w-5 h-5 text-white" />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-white" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-orange-500 text-white text-sm font-bold rounded-full hover:bg-orange-600 transition-colors"
              >
                LOGIN
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black border-b border-white/10 px-4 py-6 space-y-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block text-lg font-medium",
                location.pathname === link.path ? "text-orange-500" : "text-gray-400"
              )}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block text-lg font-medium text-gray-400"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-gray-400"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block text-lg font-medium text-gray-400"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block w-full py-3 bg-orange-500 text-white text-center font-bold rounded-lg"
            >
              LOGIN
            </Link>
          )}
        </motion.div>
      )}
    </nav>
  );
}
