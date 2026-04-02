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
    <div className="min-h-screen bg-zinc-50 font-sans p-6 sm:p-10">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-zinc-200/50">
          {/* Profile Header */}
          <div className="bg-zinc-900 p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-2xl" />
            
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-white/10 rounded-[2.5rem] flex items-center justify-center border border-white/10 backdrop-blur-sm shadow-2xl">
                <User size={64} className="text-white/80" />
              </div>
              
              <div className="text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold tracking-tight">{user?.name}</h1>
                  <span className="px-3 py-1 bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10 self-center md:self-auto">
                    {user?.role}
                  </span>
                </div>
                <p className="text-white/60 flex items-center justify-center md:justify-start gap-2">
                  <Mail size={16} />
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8 sm:p-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-zinc-900">Account Details</h2>
              {!isEditing ? (
                <Button variant="secondary" onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit2 size={16} />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleUpdateProfile} isLoading={isLoading} className="gap-2">
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
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Name</p>
                    <p className="text-zinc-900 font-medium">{user?.name}</p>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-zinc-900 font-medium">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Account Role</p>
                  <div className="flex items-center gap-2 text-zinc-900 font-medium">
                    <Shield size={16} className="text-indigo-600" />
                    {user?.role === 'ADMIN' ? 'System Administrator' : 'Student Member'}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Member Since</p>
                  <div className="flex items-center gap-2 text-zinc-900 font-medium">
                    <Calendar size={16} className="text-zinc-400" />
                    {formatDate(user?.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="mt-12 pt-12 border-t border-zinc-100">
              <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <Lock size={20} className="text-zinc-400" />
                Security
              </h3>
              
              <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-zinc-900">Password</h4>
                  <p className="text-sm text-zinc-500">Update your password to keep your account secure.</p>
                </div>
                <Button variant="secondary" className="w-full sm:w-auto" onClick={() => toast.info('Password change feature coming soon!')}>
                  Change Password
                </Button>
              </div>
            </div>

            {/* Registered Events Section */}
            {user?.role === 'STUDENT' && (
              <div className="mt-12 pt-12 border-t border-zinc-100 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-3">
                    <Ticket size={24} className="text-indigo-600" />
                    Registered Events
                  </h3>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-100">
                    {registrations.length} Total
                  </span>
                </div>

                {isRegLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-400 bg-zinc-50 border border-zinc-200 rounded-[2.5rem]">
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
                        className="bg-white p-6 rounded-[2rem] border border-zinc-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-indigo-200 transition-all"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                            <Calendar size={28} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-zinc-900 text-lg">{reg.eventTitle}</h4>
                              <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[8px] font-bold uppercase tracking-widest rounded-full">
                                {reg.category}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-500 text-xs">
                              <div className="flex items-center gap-1.5">
                                <Clock size={14} />
                                {new Date(reg.eventDateTime).toLocaleString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin size={14} />
                                {reg.venue}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Registered On</p>
                          <p className="text-zinc-900 font-medium text-sm">
                            {new Date(reg.registeredAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-zinc-50 border border-dashed border-zinc-300 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-zinc-300 mb-4 shadow-sm">
                      <Ticket size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">No registrations yet</h3>
                    <p className="text-zinc-500 text-sm mt-1 max-w-xs">
                      You haven't registered for any events yet. Explore the dashboard to find exciting activities!
                    </p>
                    <Button variant="secondary" className="mt-6" onClick={() => navigate('/dashboard')}>
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
