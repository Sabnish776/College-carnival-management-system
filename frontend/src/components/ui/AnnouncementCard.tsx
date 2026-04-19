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
      className="glass p-6 rounded-[2rem] hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-fuchsia-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100 shadow-inner">
          <Bell size={24} className="group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex-grow pr-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-900 transition-colors">{announcement.title}</h3>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 w-fit">
              <Clock size={12} />
              {formatDate(announcement.createdAt)}
            </div>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap">{announcement.description}</p>
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
