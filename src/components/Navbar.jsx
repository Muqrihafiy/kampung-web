import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(isDarkMode());

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

//   const handleToggleTheme = () => {
//     toggleDarkMode();
//     setDarkMode(isDarkMode());
//   };

  return (
    <nav className="shadow-primary-md sticky top-0 z-50" 
         style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                 style={{ backgroundColor: 'var(--color-primary-500)' }}>
              <span className="text-xl font-bold text-white">K</span>
            </div>
            <span className="text-xl font-bold text-gradient-primary">
              KampunG
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link 
                  to="/" 
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ color: 'var(--color-text)' }}
                >
                  Home
                </Link>
                <Link 
                  to="/profile" 
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ color: 'var(--color-text)' }}
                >
                  Profile
                </Link>
                {/* <button
                  // onClick={handleToggleTheme}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                  aria-label="Toggle theme"
                >
                 (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )
                </button> */}
                <button
                  onClick={handleLogout}
                  className="btn btn-outline"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;