import React from 'react';
import { motion } from 'motion/react';
import { Bell, Trash2, Clock } from 'lucide-react';
import { Announcement } from '../../types/announcement';
import { Button } from './index';

interface AnnouncementCardProps {
  announcement: Announcement;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, isAdmin, onDelete }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden bg-[#0A0A0A] border border-white/5"
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-primary-dark opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-primary shrink-0 border border-white/5 shadow-inner group-hover:bg-primary group-hover:text-background group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300">
          <Bell size={24} className="group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex-grow pr-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
            <h3 className="text-xl font-bold font-serif text-text-primary group-hover:text-primary transition-colors">{announcement.title}</h3>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] bg-secondary/10 px-2.5 py-1 rounded-sm border border-secondary/20 w-fit">
              <Clock size={12} />
              {formatDate(announcement.createdAt)}
            </div>
          </div>
          <p className="text-text-secondary/90 text-sm leading-relaxed whitespace-pre-wrap font-light">{announcement.description}</p>
        </div>
      </div>

      {isAdmin && (
        <div className="absolute top-6 right-6">
          <Button
            variant="ghost"
            className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full"
            onClick={() => onDelete?.(announcement.id)}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      )}
    </motion.div>
  );
};
