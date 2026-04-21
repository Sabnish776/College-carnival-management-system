import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, X, Clock, Mic2, Ticket as TicketIcon } from 'lucide-react';
import { Proshow } from '../../types/proshow';
import { Button } from './index';
import { cn } from '../../lib/utils';

interface ProshowCardProps {
  proshow: Proshow;
  isAdmin?: boolean;
  isRegistered?: boolean;
  onEdit?: (proshow: Proshow) => void;
  onDelete?: (id: string) => void;
  onRegister?: (id: string) => Promise<void>;
}

export const ProshowCard: React.FC<ProshowCardProps> = ({ proshow, isAdmin, isRegistered, onEdit, onDelete, onRegister }) => {
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
    
    if (!window.confirm('Are you sure you want to register for this proshow?')) {
      return;
    }

    setIsRegistering(true);
    try {
      await onRegister?.(proshow.id);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <>
      <motion.div
        layoutId={`proshow-card-${proshow.id}`}
        onClick={() => setIsOpen(true)}
        className="glass-card text-white p-7 rounded-sm cursor-pointer group flex flex-col h-full relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(109,40,217,0.3)] hover:-translate-y-2 ring-1 ring-white/5 hover:ring-secondary/50"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-secondary/20 via-background to-background opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-xl rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-150 group-hover:bg-secondary/20" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <span className="px-3 py-1 bg-secondary/20 backdrop-blur-md text-secondary text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm flex items-center gap-2 border border-secondary/30 shadow-[0_0_15px_rgba(109,40,217,0.3)]">
            <Mic2 size={12} />
            PRO-SHOW
          </span>
          {proshow.ticketPrice > 0 ? (
            <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-sm border border-primary/20">₹{proshow.ticketPrice}</span>
          ) : (
            <span className="text-secondary font-bold text-sm bg-secondary/10 px-3 py-1 rounded-sm border border-secondary/20">FREE</span>
          )}
        </div>
        
        <h3 className="text-3xl font-bold font-serif text-white mb-1 line-clamp-1 relative z-10 group-hover:text-secondary transition-colors duration-300 leading-none">{proshow.title}</h3>
        <p className="text-primary/90 font-medium text-sm mb-6 relative z-10 tracking-wider uppercase">feat. {proshow.artist}</p>
        
        <div className="space-y-3 pt-4 border-t border-zinc-700/50 flex-grow">
          <div className="flex items-center gap-3 text-zinc-400 text-xs">
            <Clock size={16} className="text-primary-light" />
            <span>{formatDate(proshow.dateTime)}</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-400 text-xs">
            <MapPin size={16} className="text-secondary" />
            <span className="line-clamp-1">{proshow.venue}</span>
          </div>
        </div>

        {isAdmin && (
          <div className="flex gap-2 mt-6 pt-4 border-t border-zinc-800" onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="secondary" 
              className="flex-1 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700 hover:text-white" 
              onClick={() => onEdit?.(proshow)}
            >
              Edit
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-400/10" 
              onClick={() => onDelete?.(proshow.id)}
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
              layoutId={`proshow-card-${proshow.id}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                duration: 0.3
              }}
              className="relative w-full max-w-3xl glass-dark rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-700/50"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-2/5 bg-[#080808] p-8 text-white flex flex-col justify-between relative overflow-hidden border-r border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/30 via-transparent to-transparent opacity-60 mix-blend-screen"></div>
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-secondary/20 blur-[60px] rounded-full mix-blend-screen"></div>
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-secondary/20 backdrop-blur-md text-secondary text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm border border-secondary/30 shadow-xl">
                    Main Event
                  </span>
                  <h2 className="text-5xl font-bold font-serif mt-6 leading-none drop-shadow-lg text-white">{proshow.title}</h2>
                  <p className="text-primary mt-3 font-bold tracking-widest uppercase flex items-center gap-2">
                    <Mic2 size={16} /> {proshow.artist}
                  </p>
                </div>
                
                <div className="space-y-4 mt-8 relative z-10">
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-primary-light">Date & Time</p>
                      <p className="text-sm font-medium drop-shadow-sm">{formatDate(proshow.dateTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-primary-light">Venue</p>
                      <p className="text-sm font-medium drop-shadow-sm">{proshow.venue}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-3/5 p-8 sm:p-12 flex flex-col bg-[#050505] text-white backdrop-blur-xl relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none"></div>
                <div className="flex-grow z-10">
                  <h4 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <span className="w-8 h-px bg-secondary/50"></span>
                    About the Show
                  </h4>
                  <p className="text-text-secondary/90 leading-relaxed font-light whitespace-pre-wrap">
                    {proshow.description}
                  </p>
                </div>

                <div className="mt-8">
                  <div className="bg-zinc-800/50 rounded-2xl p-4 flex justify-between items-center mb-6 border border-zinc-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                        <TicketIcon size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 font-medium">Ticket Price</p>
                        <p className="text-white font-bold">{proshow.ticketPrice > 0 ? `₹${proshow.ticketPrice}` : 'Free Entry'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {!isAdmin && (
                      <Button 
                        className={cn(
                          "w-full py-4 text-base shadow-xl transition-all border-none text-white",
                          isRegistered 
                            ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/50 cursor-default" 
                            : "bg-primary hover:bg-primary-dark shadow-primary/50"
                        )}
                        onClick={handleRegister}
                        disabled={isRegistered || isRegistering}
                      >
                        {isRegistering ? 'Processing...' : isRegistered ? 'Pass Confirmed' : 'Get Pass'}
                      </Button>
                    )}
                    {isAdmin && (
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700 hover:text-white" 
                          onClick={() => { setIsOpen(false); onEdit?.(proshow); }}
                        >
                          Edit Details
                        </Button>
                        <Button 
                          className="bg-rose-950/50 text-rose-400 hover:bg-rose-900/50 hover:text-rose-300 border-transparent hover:border-transparent" 
                          onClick={() => { setIsOpen(false); onDelete?.(proshow.id); }}
                        >
                          Delete Show
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
