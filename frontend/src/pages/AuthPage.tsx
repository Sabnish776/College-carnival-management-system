import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { UserPlus, GraduationCap, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button, InputField } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

type AuthMode = 'login' | 'register';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await api.post('/api/auth/login', { email, password });
      
      // Store token first so subsequent requests are authenticated
      localStorage.setItem('auth_token', data.token);
      
      // Fetch current user details
      const userResponse = await api.get('/api/users/me');
      const userData = userResponse.user;
      
      login(data.token, userData);
      toast.success(data.message || 'Login successful');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      localStorage.removeItem('auth_token'); // Cleanup if fetching user details fails
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await api.post('/api/auth/register', { name, email, password });
      toast.success(data.message || 'User Registered Successfully');
      setMode('login');
      setPassword(''); 
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-zinc-900/20"
          >
            <GraduationCap size={28} />
          </motion.div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">CCMS Portal Login</h2>
          <p className="text-zinc-500 text-sm mt-1">College Cultural Carnival Management System</p>
        </div>

        {/* Auth Card */}
        <motion.div 
          layout
          className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-xl shadow-zinc-200/50 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900">Sign In</h3>
                  <p className="text-zinc-500 text-sm">Enter your credentials to access your account</p>
                </div>

                <div className="space-y-4">
                  <InputField
                    label="Email"
                    type="email"
                    placeholder="sabu@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={Mail}
                    required
                  />
                  <InputField
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={Lock}
                    required
                  />
                </div>

                <Button type="submit" isLoading={isLoading} className="w-full">
                  Sign In
                  <ArrowRight size={18} />
                </Button>

                <div className="pt-2 text-center">
                  <button 
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    Don't have an account? <span className="font-semibold text-zinc-900 underline underline-offset-4">Create one</span>
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRegister}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900">Create Account</h3>
                  <p className="text-zinc-500 text-sm">Join the student community today</p>
                </div>

                <div className="space-y-4">
                  <InputField
                    label="Full Name"
                    type="text"
                    placeholder="Sabu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={User}
                    required
                  />
                  <InputField
                    label="Email"
                    type="email"
                    placeholder="sabu@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={Mail}
                    required
                  />
                  <InputField
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={Lock}
                    required
                  />
                </div>

                <Button type="submit" isLoading={isLoading} className="w-full">
                  Register Now
                  <UserPlus size={18} />
                </Button>

                <div className="pt-2 text-center">
                  <button 
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    Already have an account? <span className="font-semibold text-zinc-900 underline underline-offset-4">Sign in</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Info */}
        <p className="mt-8 text-center text-xs text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
