import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/login');
  };



  return (
    <nav className="shadow-primary-md sticky top-0 z-50" 
         style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
 
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                 style={{ backgroundColor: 'var(--color-primary-500)' }}>
              <span className="text-xl font-bold text-white">K</span>
            </div>
            <span className="text-xl font-bold text-gradient-primary">
              KampunG
            </span>
          </Link>


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
                  to="/search" 
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ color: 'var(--color-text)' }}
                >
                  Search
                </Link>
                <Link 
                  to="/profile" 
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ color: 'var(--color-text)' }}
                >
                  Profile
                </Link>
               
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