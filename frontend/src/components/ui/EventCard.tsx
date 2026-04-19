import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Users, X, Clock } from 'lucide-react';
import { Event } from '../../types/event';
import { Button } from './index';
import { cn } from '../../lib/utils';

interface EventCardProps {
  event: Event;
  isAdmin?: boolean;
  isRegistered?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (id: number) => void;
  onRegister?: (id: number) => Promise<void>;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isAdmin, isRegistered, onEdit, onDelete, onRegister }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

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

  const handleRegister = async () => {
    if (isRegistered || isRegistering) return;
    
    if (!window.confirm('Are you sure you want to register for this event? Notice: You cannot cancel the registration after clicking register.')) {
      return;
    }

    setIsRegistering(true);
    try {
      await onRegister?.(event.id);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <>
      <motion.div
        layoutId={`card-${event.id}`}
        onClick={() => setIsOpen(true)}
        className="glass p-5 rounded-3xl cursor-pointer group flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex justify-between items-start mb-3 relative z-10">
          <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-fuchsia-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-200/50">
            {event.category}
          </span>
          <div className="text-indigo-300 group-hover:text-fuchsia-500 transition-colors duration-300">
            <Calendar size={18} />
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-zinc-900 mb-2 line-clamp-1 relative z-10 group-hover:text-indigo-900 transition-colors">{event.title}</h3>
        <p className="text-zinc-600 text-sm line-clamp-2 mb-4 flex-grow relative z-10">{event.description}</p>
        
        <div className="space-y-2 pt-4 border-t border-indigo-100/50 relative z-10">
          <div className="flex items-center gap-2 text-indigo-900/60 text-xs font-medium">
            <Clock size={14} className="text-indigo-400" />
            <span>{formatDate(event.eventDateTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-900/60 text-xs font-medium">
            <MapPin size={14} className="text-fuchsia-400" />
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
              className="relative w-full max-w-3xl glass-dark rounded-[2rem] overflow-hidden flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 transition-colors backdrop-blur-md"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-900 to-fuchsia-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20">
                    {event.category}
                  </span>
                  <h2 className="text-3xl font-bold mt-4 leading-tight">{event.title}</h2>
                </div>
                
                <div className="space-y-4 mt-8 relative z-10">
                  <div className="flex items-center gap-3 text-indigo-100">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider opacity-60">Date & Time</p>
                      <p className="text-sm font-medium">{formatDate(event.eventDateTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-indigo-100">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider opacity-60">Venue</p>
                      <p className="text-sm font-medium">{event.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-indigo-100">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider opacity-60">Capacity</p>
                      <p className="text-sm font-medium">{event.maxParticipants} Participants</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-3/5 p-8 sm:p-10 flex flex-col bg-white/90 backdrop-blur-xl">
                <div className="flex-grow">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">About Event</h4>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col gap-3">
                  {!isAdmin && (
                    <>
                      <Button 
                        className={cn(
                          "flex-1 py-4 text-base shadow-lg transition-all",
                          isRegistered 
                            ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" 
                            : "shadow-zinc-900/20"
                        )}
                        onClick={handleRegister}
                        disabled={isRegistered || isRegistering}
                      >
                        {isRegistering ? 'Registering...' : isRegistered ? 'Registered' : 'Register Now'}
                      </Button>
                      {!isRegistered && (
                        <p className="text-[10px] text-zinc-400 text-center font-medium uppercase tracking-wider">
                          Notice: Registration cannot be cancelled after confirmation
                        </p>
                      )}
                    </>
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
