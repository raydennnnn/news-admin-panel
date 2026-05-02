import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { adminLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await adminLogin(email, password);

      if (data.success && data.data?.user) {
        login(data.data.user);
        navigate('/', { replace: true });
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-green/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-brand-green/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-green/10 border border-brand-green/20 mb-5 shadow-lg shadow-brand-green/5">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">NewsAdmin</h1>
          <p className="text-gray-500 text-sm">Sign in to access the control panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-dark-800 rounded-2xl border border-dark-600/50 p-8 shadow-2xl shadow-black/30">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-gray-500 text-sm">Enter your admin credentials to continue</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-brand-red/10 border border-brand-red/20 text-brand-red px-4 py-3 rounded-xl text-sm animate-fade-in">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 border border-dark-600 rounded-xl bg-dark-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green/50 text-sm transition-all duration-200"
                placeholder="admin@newsapp.com"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 pr-12 border border-dark-600 rounded-xl bg-dark-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green/50 text-sm transition-all duration-200"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 bg-brand-green hover:bg-brand-green/90 disabled:bg-brand-green/50 disabled:cursor-not-allowed text-dark-900 font-bold py-3.5 px-4 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-brand-green/20 hover:shadow-brand-green/30 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-dark-600/50 text-center">
            <p className="text-gray-600 text-xs">
              Authorized admin access only. All actions are logged.
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-gray-600 text-xs mt-6">
          © 2026 NewsAdmin · Samāchāra Platform
        </p>
      </div>
    </div>
  );
};

export default Login;
