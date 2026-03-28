import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={cn(
      "fixed w-full z-[100] transition-all duration-300 border-b border-white/10",
      isOpen ? "bg-black" : "bg-black md:bg-black/80 md:backdrop-blur-md"
    )}>
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
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] md:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-black border-l border-white/10 p-6 flex flex-col gap-6 md:hidden shadow-2xl z-[100]"
            >
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Navigation</p>
                {navLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => {
                      setIsOpen(false);
                      navigate(link.path);
                    }}
                    className={cn(
                      "block w-full text-left py-3 px-4 rounded-xl text-lg font-bold transition-all",
                      location.pathname === link.path 
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {link.name}
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-6 border-t border-white/10">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Account</p>
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/dashboard');
                      }}
                      className={cn(
                        "flex items-center gap-3 w-full py-3 px-4 rounded-xl text-lg font-bold transition-all",
                        location.pathname === '/dashboard' ? "text-orange-500" : "text-gray-400 hover:text-white"
                      )}
                    >
                      <User className="w-5 h-5" /> Dashboard
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/admin');
                        }}
                        className={cn(
                          "flex items-center gap-3 w-full py-3 px-4 rounded-xl text-lg font-bold transition-all",
                          location.pathname === '/admin' ? "text-orange-500" : "text-gray-400 hover:text-white"
                        )}
                      >
                        <Settings className="w-5 h-5" /> Admin Panel
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full py-3 px-4 rounded-xl text-lg font-bold text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/login');
                    }}
                    className="block w-full py-4 bg-orange-500 text-white text-center font-bold rounded-xl shadow-lg shadow-orange-500/20"
                  >
                    LOGIN
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
