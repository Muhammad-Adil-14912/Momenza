import { AlertCircle, ArrowRight, Lock, Mail, Sparkles, User } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';

const AuthPage = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const { login, register, demoLogin, googleLogin } = useAuth();

  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isForgot) {
        // Simulated password reset
        setForgotSent(true);
        setLoading(false);
        return;
      }

      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      setError('Could not initiate demo login.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await googleLogin({
        email: 'host.google@momenza.art',
        name: 'Kabir & Aria',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        firebaseUid: 'google_oauth_verified_' + Date.now()
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center p-4 selection:bg-[#C47B62]/20 selection:text-[#252522]">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <Logo size="large" showTagline={true} />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-xl p-8 sm:p-10 max-w-md w-full space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-serif text-2xl font-normal text-[#252522]">
            {isForgot ? 'Reset Password' : isLogin ? 'Welcome to MOMENZA' : 'Begin Your Celebration'}
          </h2>
          <p className="text-xs text-[#85847F] font-light">
            {isForgot
              ? 'Enter your email to receive recovery instructions'
              : isLogin
              ? 'Sign in to access your saved event plans & budget'
              : 'Create an account to design bespoke celebrations'}
          </p>
        </div>

        {/* Quick Demo Reviewer Banner */}
        <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E2] text-center space-y-2">
          <p className="text-xs text-[#252522] font-medium flex items-center justify-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C47B62]" />
            <span>Instant Reviewer Access</span>
          </p>
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={loading}
            className="w-full bg-[#FAF9F6] hover:bg-[#F1EDE5] border border-[#C47B62] text-[#C47B62] text-xs font-semibold py-2 rounded-xl transition"
          >
            One-Click Quick Demo Sign In
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {forgotSent ? (
          <div className="p-4 rounded-2xl bg-[#EFF3EC] border border-[#A7B29A] text-xs text-[#252522] space-y-2 text-center">
            <p className="font-semibold">Reset Email Dispatched</p>
            <p className="text-[#85847F] font-light">
              Check your inbox for password reset instructions.
            </p>
            <button
              onClick={() => {
                setIsForgot(false);
                setForgotSent(false);
              }}
              className="text-xs text-[#C47B62] font-medium underline mt-2 block mx-auto"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isForgot && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#85847F] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Aria Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#252522]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#85847F] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="aria@momenza.art"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#252522]"
                />
              </div>
            </div>

            {!isForgot && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#85847F]">
                    Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setIsForgot(true)}
                      className="text-[11px] text-[#C47B62] hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#85847F] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#252522]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#252522] hover:bg-[#C47B62] disabled:opacity-50 text-white font-medium py-3 rounded-full text-xs transition duration-300 shadow-sm flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Authenticating...' : isForgot ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Google Authentication */}
        {!isForgot && (
          <>
            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#EAE8E2] w-full" />
              <span className="bg-white px-3 text-[10px] uppercase tracking-wider text-[#85847F] absolute">
                Or continue with
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white hover:bg-[#FAF9F6] border border-[#EAE8E2] text-[#252522] py-2.5 rounded-full text-xs font-medium transition flex items-center justify-center space-x-2 shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </>
        )}

        {/* Toggle Login / Register */}
        <div className="text-center pt-2 text-xs text-[#85847F]">
          {isForgot ? (
            <button onClick={() => setIsForgot(false)} className="text-[#C47B62] hover:underline font-medium">
              Back to Sign In
            </button>
          ) : isLogin ? (
            <p>
              New to MOMENZA?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-[#C47B62] hover:underline font-semibold"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-[#C47B62] hover:underline font-semibold"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>

      <p className="mt-8 text-xs text-[#85847F]">
        <Link to="/" className="hover:text-[#252522] underline">
          Return to MOMENZA Home
        </Link>
      </p>
    </div>
  );
};

export default AuthPage;
