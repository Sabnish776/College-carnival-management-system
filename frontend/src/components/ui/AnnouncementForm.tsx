import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Bell, Send } from 'lucide-react';
import { Button, InputField } from './index';

interface AnnouncementFormProps {
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => Promise<void>;
}

export const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({ title, description });
      onClose();
    } catch (error) {
      console.error('Failed to submit announcement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-surface border border-border-soft rounded-[2rem] shadow-2xl overflow-hidden glass-panel"
      >
        <div className="bg-gradient-to-r from-primary-dark to-primary p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-sm border border-white/20">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif tracking-tight">New Announcement</h2>
              <p className="text-white/80 text-xs uppercase tracking-widest font-bold">Broadcast to all students</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <InputField
            label="Announcement Title"
            placeholder="e.g. Carnival Registration Open!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            icon={Bell}
          />

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">
              Description
            </label>
            <textarea
              className="w-full bg-surface border border-border-soft rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[120px] resize-none placeholder:text-text-secondary"
              placeholder="Provide more details about this announcement..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button 
              type="button" 
              variant="secondary" 
              className="flex-1 py-4" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={isLoading} 
              className="flex-1 py-4 shadow-lg shadow-zinc-900/20"
            >
              Post Announcement
              <Send size={18} />
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
