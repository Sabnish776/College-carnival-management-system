import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Users, X, Clock } from 'lucide-react';
import { Event } from '../../types/event';
import { Button } from './index';
import { cn } from '../../lib/utils';

interface EventCardProps {
  event: Event;
  isAdmin?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (id: number) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isAdmin, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <motion.div
        layoutId={`card-${event.id}`}
        onClick={() => setIsOpen(true)}
        className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
        whileHover={{ y: -4 }}
      >
        <div className="flex justify-between items-start mb-3">
          <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
            {event.category}
          </span>
          <div className="text-zinc-400 group-hover:text-zinc-900 transition-colors">
            <Calendar size={18} />
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-zinc-900 mb-2 line-clamp-1">{event.title}</h3>
        <p className="text-zinc-500 text-sm line-clamp-2 mb-4 flex-grow">{event.description}</p>
        
        <div className="space-y-2 pt-4 border-t border-zinc-50">
          <div className="flex items-center gap-2 text-zinc-500 text-xs">
            <Clock size={14} />
            <span>{formatDate(event.eventDateTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 text-xs">
            <MapPin size={14} />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
        </div>

        {isAdmin && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-50" onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="secondary" 
              className="flex-1 py-2 text-xs" 
              onClick={() => onEdit?.(event)}
            >
              Edit
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 py-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50" 
              onClick={() => onDelete?.(event.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              layoutId={`card-${event.id}`}
              initial={{ rotateY: 180, scale: 0.8, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              exit={{ rotateY: 180, scale: 0.8, opacity: 0 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200,
                duration: 0.6
              }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
              style={{ transformStyle: "preserve-3d" }}
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 z-10 p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full text-zinc-500 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-2/5 bg-zinc-900 p-8 text-white flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">
                    {event.category}
                  </span>
                  <h2 className="text-3xl font-bold mt-4 leading-tight">{event.title}</h2>
                </div>
                
                <div className="space-y-4 mt-8">
                  <div className="flex items-center gap-3 text-white/70">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider opacity-50">Date & Time</p>
                      <p className="text-sm font-medium">{formatDate(event.eventDateTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white/70">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider opacity-50">Venue</p>
                      <p className="text-sm font-medium">{event.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white/70">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider opacity-50">Capacity</p>
                      <p className="text-sm font-medium">{event.maxParticipants} Participants</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-3/5 p-8 sm:p-10 flex flex-col">
                <div className="flex-grow">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">About Event</h4>
                  <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>

                <div className="mt-10 pt-6 border-t border-zinc-100 flex gap-3">
                  {!isAdmin && (
                    <Button className="flex-1 py-4 text-base shadow-lg shadow-zinc-900/20">
                      Register Now
                    </Button>
                  )}
                  {isAdmin && (
                    <>
                      <Button variant="secondary" className="flex-1" onClick={() => { setIsOpen(false); onEdit?.(event); }}>
                        Edit Details
                      </Button>
                      <Button variant="ghost" className="text-rose-600" onClick={() => { setIsOpen(false); onDelete?.(event.id); }}>
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
