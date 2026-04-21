import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, Calendar, ArrowLeft, Edit2, Save, Lock, GraduationCap, Ticket, MapPin, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, InputField } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Registration } from '../types/registration';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isRegLoading, setIsRegLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'STUDENT') {
      fetchRegistrations();
    }
  }, [user]);

  const fetchRegistrations = async () => {
    setIsRegLoading(true);
    try {
      const data = await api.get('/api/registrations/me');
      setRegistrations(data.registrations || []);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setIsRegLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // In a real app, you'd call an API here
      // await api.put('/api/users/me', { name });
      
      if (user) {
        const updatedUser = { ...user, name };
        updateUser(updatedUser);
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background fest-pattern font-sans p-6 sm:p-10 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-secondary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <div className="max-w-3xl mx-auto relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="glass-card overflow-hidden bg-[#050505] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {/* Profile Header */}
          {/* Profile Header */}
          <div className="bg-[#111111] border-b border-white/10 p-8 sm:p-16 text-white relative overflow-hidden flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full -mr-32 -mt-32 blur-[80px] opacity-70 pointer-events-none" />
            <div className="absolute top-8 right-8 hidden sm:flex space-x-1 opacity-20 transform scale-y-150">
              {/* Fake Barcode */}
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-1 h-16 bg-white" style={{ opacity: Math.random(), width: `${Math.max(1, Math.random() * 4)}px` }}></div>
              ))}
            </div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-8 z-10 w-full pt-4">
              <div className="w-32 h-32 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                <User size={64} className="text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                  <h1 className="text-5xl sm:text-6xl font-bold font-serif tracking-wide text-gradient-gold drop-shadow-md leading-none">{user?.name}</h1>
                  <span className="px-3 py-1 bg-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm border border-secondary/30 mt-2 md:mt-0 shadow-inner">
                    {user?.role} PASS
                  </span>
                </div>
                <p className="text-text-secondary/90 flex items-center justify-center md:justify-start gap-2 text-sm font-medium tracking-wide mt-4">
                  <Mail size={16} className="text-primary/70" />
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8 sm:p-12">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold font-serif text-text-primary tracking-wide">ACCOUNT DETAILS</h2>
              {!isEditing ? (
                <Button variant="secondary" onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit2 size={16} />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" className="text-text-secondary hover:text-text-primary" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleUpdateProfile} isLoading={isLoading} className="gap-2 bg-primary hover:bg-primary-dark">
                    <Save size={16} />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {isEditing ? (
                  <InputField
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={User}
                  />
                ) : (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Full Name</p>
                    <p className="text-text-primary font-medium text-lg">{user?.name}</p>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Email Address</p>
                  <p className="text-text-primary font-medium text-lg">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] flex items-center gap-2"><span className="w-4 h-px bg-primary/50"></span>Account Role</p>
                  <div className="flex items-center gap-3 text-text-primary font-medium text-xl">
                    <Shield size={20} className="text-secondary" />
                    {user?.role === 'ADMIN' ? 'System Administrator' : 'Student Member'}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] flex items-center gap-2"><span className="w-4 h-px bg-primary/50"></span>Member Since</p>
                  <div className="flex items-center gap-3 text-text-primary font-medium text-xl">
                    <Calendar size={20} className="text-primary" />
                    {formatDate(user?.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="mt-12 pt-12 border-t border-white/10">
              <h3 className="text-3xl font-bold font-serif text-text-primary mb-8 flex items-center gap-3 tracking-wide">
                <Lock size={24} className="text-primary" />
                SECURITY
              </h3>
              
              <div className="bg-[#0a0a0a] rounded-lg p-6 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
                <div>
                  <h4 className="font-bold text-text-primary tracking-wide">Change Password</h4>
                  <p className="text-sm text-text-secondary/70 font-light mt-1">Update your password to keep your account secure.</p>
                </div>
                <Button variant="secondary" className="w-full sm:w-auto" onClick={() => toast.info('Password change feature coming soon!')}>
                  Change Password
                </Button>
              </div>
            </div>

            {/* Registered Events Section */}
            {user?.role === 'STUDENT' && (
              <div className="mt-16 pt-12 border-t border-white/10 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold font-serif text-text-primary flex items-center gap-3 tracking-wide text-gradient-gold">
                    <Ticket size={28} className="text-secondary" />
                    REGISTERED EVENTS
                  </h3>
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm border border-secondary/30">
                    {registrations.length} Passes
                  </span>
                </div>

                {isRegLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-text-secondary bg-surface/50 border border-border-soft rounded-2xl">
                    <Loader2 className="animate-spin mb-4" size={32} />
                    <p className="text-sm font-medium">Loading your registrations...</p>
                  </div>
                ) : registrations.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {registrations.map((reg) => (
                      <motion.div
                        key={reg.eventId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#0a0a0a] p-6 rounded-sm border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-primary/50 transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors"></div>
                        <div className="flex items-center gap-5 relative z-10">
                          <div className="w-14 h-14 bg-surface rounded-lg flex items-center justify-center text-primary group-hover:text-background group-hover:bg-primary group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all shadow-inner border border-white/5">
                            <Calendar size={28} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-bold font-serif text-text-primary text-xl tracking-wide group-hover:text-primary transition-colors">{reg.eventTitle}</h4>
                              <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[8px] font-bold uppercase tracking-[0.2em] rounded-sm border border-secondary/20">
                                {reg.category}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-text-secondary/80 text-xs font-medium">
                              <div className="flex items-center gap-2">
                                <Clock size={14} className="text-primary/70" />
                                {new Date(reg.eventDateTime).toLocaleString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-secondary/70" />
                                {reg.venue}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right shrink-0 relative z-10 sm:border-l border-white/10 sm:pl-6">
                          <p className="text-[10px] font-bold text-text-secondary/70 uppercase tracking-[0.2em] mb-1">Pass Issued On</p>
                          <p className="text-primary font-bold text-sm tracking-widest">
                            {new Date(reg.registeredAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#0a0a0a] border border-dashed border-white/10 rounded-lg py-20 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-16 h-16 bg-surface border border-white/5 rounded-2xl flex items-center justify-center text-text-secondary/50 mb-6 shadow-inner">
                      <Ticket size={32} />
                    </div>
                    <h3 className="text-xl font-bold font-serif text-text-primary tracking-wide">No Passes Yet</h3>
                    <p className="text-text-secondary/70 text-sm mt-2 max-w-xs font-light">
                      Your digital wallet is empty. Explore the dashboard to discover exclusive events!
                    </p>
                    <Button variant="secondary" className="mt-6 border-secondary text-secondary hover:bg-secondary hover:text-white" onClick={() => navigate('/dashboard')}>
                      Browse Events
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
