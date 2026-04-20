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
    <div className="min-h-screen bg-[#050505] flex flex-col justify-end p-0 font-sans relative overflow-hidden">
      {/* Concert Crowd Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-[70vh] object-cover z-0 pointer-events-none opacity-80"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-crowd-in-front-of-a-stage-at-a-concert-4100-large.mp4" type="video/mp4" />
      </video>

      {/* Atmospheric Concert Lighting Overlays */}
      <div 
        className="absolute top-[-10%] left-[5%] w-[180px] h-[90vh] origin-top -rotate-[25deg] pointer-events-none mix-blend-plus-lighter blur-[12px] z-0 opacity-80"
        style={{ background: 'linear-gradient(to bottom, rgba(109,40,217,0.9) 0%, rgba(109,40,217,0.1) 60%, transparent 100%)' }}
      />
      
      <div 
        className="absolute top-[-5%] right-[5%] w-[250px] h-[90vh] origin-top rotate-[30deg] pointer-events-none mix-blend-plus-lighter blur-[15px] z-0 opacity-[0.85]"
        style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.8) 0%, rgba(212,175,55,0.1) 60%, transparent 100%)' }}
      />

      <div 
        className="absolute top-0 inset-x-0 h-[50vh] pointer-events-none mix-blend-screen z-0"
        style={{ background: 'radial-gradient(ellipse at top center, rgba(109,40,217,0.4) 0%, transparent 70%)' }}
      />

      {/* Deep Gradient Fade Overlay (Transparent top, Solid Black bottom) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/90 to-[#050505] pointer-events-none z-0" />
      <div className="absolute bottom-0 inset-x-0 h-[60vh] bg-[#050505] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-primary/5 mix-blend-screen pointer-events-none z-0" />

      <div className="w-full max-w-sm mx-auto relative z-10 px-6 pb-12 flex flex-col items-center">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-8 relative">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-gradient-to-br from-[#111111] to-[#050505] rounded-2xl flex items-center justify-center text-primary mb-4 shadow-[0_0_30px_rgba(212,175,55,0.2)] border border-primary/20 relative"
          >
            <div className="absolute inset-0 rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent"></div>
            <GraduationCap size={32} className="relative z-10" />
          </motion.div>
          <motion.h2 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-4xl font-bold font-serif text-white tracking-wide pb-1"
          >
            CCMS
          </motion.h2>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-text-secondary/90 font-serif tracking-widest text-xs mt-2 uppercase"
          >
            Sign in to join the festival
          </motion.p>
        </div>

        {/* Auth Form Seamless */}
        <motion.div 
          layout
          className="w-full relative"
        >
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className="space-y-4 w-full"
              >

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

                <div className="mt-6 flex flex-col gap-3">
                  <Button type="submit" isLoading={isLoading} className="w-full py-4 text-base rounded-2xl bg-secondary hover:bg-secondary-light text-white font-semibold transition-all">
                    Sign In
                  </Button>
                </div>

                <div className="pt-4 text-center">
                  <button 
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-sm text-text-secondary/70 hover:text-white transition-colors"
                  >
                    Don't have an account? <span className="font-semibold text-white">Create one</span>
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRegister}
                className="space-y-4 w-full"
              >

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

                <div className="mt-6 flex flex-col gap-3">
                  <Button type="submit" isLoading={isLoading} className="w-full py-4 text-base rounded-2xl bg-secondary hover:bg-secondary-light text-white font-semibold transition-all">
                    Sign Up
                  </Button>
                </div>

                <div className="pt-4 text-center">
                  <button 
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-sm text-text-secondary/70 hover:text-white transition-colors"
                  >
                    Already have an account? <span className="font-semibold text-white">Log in</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Info */}
        <p className="mt-8 text-center text-xs text-text-secondary leading-relaxed max-w-[280px] mx-auto z-10 relative">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
