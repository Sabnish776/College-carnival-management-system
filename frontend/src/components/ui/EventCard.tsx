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
  onDelete?: (id: string) => void;
  onRegister?: (id: string) => Promise<void>;
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
        className="glass-card p-6 cursor-pointer group flex flex-col h-full transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:-translate-y-2 relative overflow-hidden ring-1 ring-white/5 hover:ring-primary/40"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="flex justify-between items-start mb-4 relative z-10">
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm border border-primary/20 backdrop-blur-md">
            {event.category}
          </span>
          <div className="text-text-secondary group-hover:text-primary transition-colors duration-300">
            <Calendar size={18} />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold font-serif text-text-primary mb-2 line-clamp-1 relative z-10 group-hover:text-primary transition-colors duration-300">{event.title}</h3>
        <p className="text-text-secondary text-sm line-clamp-2 mb-6 flex-grow relative z-10 font-light">{event.description}</p>
        
        <div className="space-y-3 pt-4 border-t border-border-soft relative z-10">
          <div className="flex items-center gap-3 text-text-secondary text-xs font-medium">
            <Clock size={16} className="text-primary group-hover:text-primary-light transition-colors" />
            <span className="tracking-wide">{formatDate(event.eventDateTime)}</span>
          </div>
          <div className="flex items-center gap-3 text-text-secondary text-xs font-medium">
            <MapPin size={16} className="text-secondary group-hover:text-primary-light transition-colors" />
            <span className="line-clamp-1 tracking-wide">{event.venue}</span>
          </div>
        </div>

        {isAdmin && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-border-soft" onClick={(e) => e.stopPropagation()}>
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
              className="relative w-full max-w-4xl glass-dark border border-white/10 shadow-2xl rounded-sm overflow-hidden flex flex-col md:flex-row bg-[#050505]"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 z-20 p-2 bg-text-primary/10 hover:bg-text-primary/20 rounded-full text-text-primary/70 transition-colors backdrop-blur-md"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-2/5 bg-gradient-to-br from-[#111111] to-[#050505] p-8 text-white flex flex-col justify-between relative overflow-hidden border-r border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 mix-blend-screen"></div>
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-primary/20 blur-[50px] rounded-full mix-blend-screen"></div>
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm border border-primary/30 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                    {event.category}
                  </span>
                  <h2 className="text-4xl font-bold font-serif mt-6 leading-none text-gradient-gold text-shadow-sm pb-2">{event.title}</h2>
                </div>
                
                <div className="space-y-6 mt-12 relative z-10">
                  <div className="flex items-center gap-4 text-text-primary">
                    <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-white/5 text-primary shadow-inner">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-bold mb-1">Date & Time</p>
                      <p className="text-sm font-medium tracking-wide text-white/90">{formatDate(event.eventDateTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-text-primary">
                    <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-white/5 text-secondary shadow-inner">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-secondary/70 font-bold mb-1">Venue</p>
                      <p className="text-sm font-medium tracking-wide text-white/90">{event.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-text-primary">
                    <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-white/5 text-accent shadow-inner">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-accent/70 font-bold mb-1">Capacity</p>
                      <p className="text-sm font-medium tracking-wide text-white/90">{event.maxParticipants} Participants</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-3/5 p-8 sm:p-12 flex flex-col bg-[#050505] relative">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none"></div>
                <div className="flex-grow z-10">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <span className="w-8 h-px bg-primary/50"></span>
                    About Event
                  </h4>
                  <p className="text-text-secondary/90 leading-relaxed whitespace-pre-wrap font-light text-sm text-justify">
                    {event.description}
                  </p>
                </div>

                <div className="mt-10 pt-8 border-t border-white/10 flex flex-col gap-4 z-10">
                  {!isAdmin && (
                    <>
                      <Button 
                        className={cn(
                          "flex-1 py-4 text-base shadow-lg transition-all",
                          isRegistered 
                            ? "bg-emerald-900 border-emerald-500/50 text-emerald-400 hover:brightness-100 cursor-default" 
                            : ""
                        )}
                        onClick={handleRegister}
                        disabled={isRegistered || isRegistering}
                      >
                        {isRegistering ? 'Registering...' : isRegistered ? 'Registered' : 'Register Now'}
                      </Button>
                      {!isRegistered && (
                        <p className="text-[10px] text-text-secondary text-center font-bold uppercase tracking-wider">
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
                      <Button variant="ghost" className="text-rose-600 border border-transparent" onClick={() => { setIsOpen(false); onDelete?.(event.id); }}>
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
