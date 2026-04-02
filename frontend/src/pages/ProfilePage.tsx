import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, Calendar, ArrowLeft, Edit2, Save, Lock, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, InputField } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);

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
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-zinc-200 rounded-xl flex items-center justify-center text-zinc-400 mb-4">
            <GraduationCap size={20} />
          </div>
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">CCMS Portal v1.0</p>
        </div>
      </div>
    </div>
  );
};
