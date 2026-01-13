import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    console.log("result:", result.success);
    if (result.success) {
        console.log("Login successful, navigating to home.");
     setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" 
         style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="card max-w-72 w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            KampunG
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Welcome back to the village
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="alert alert-error">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div>
            <label  className="block text-sm font-medium mb-2"
                   style={{ color: 'var(--color-text)' }}>
              Username
            </label>
            <input
            //   type="email"
              id="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2"
                   style={{ color: 'var(--color-text)' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p style={{ color: 'var(--color-text-muted)' }}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium"
              style={{ color: 'var(--color-primary-500)' }}
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;