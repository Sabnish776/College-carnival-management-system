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
        className="glass-dark text-white p-6 rounded-3xl cursor-pointer group flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-500/20 hover:-translate-y-1"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/20 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-125" />
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <span className="px-3 py-1 bg-gradient-to-r from-fuchsia-600/80 to-purple-600/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1 border border-white/20">
            <Mic2 size={12} />
            PRO-SHOW
          </span>
          {proshow.ticketPrice > 0 ? (
            <span className="text-emerald-400 font-bold text-sm bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/20">₹{proshow.ticketPrice}</span>
          ) : (
            <span className="text-fuchsia-300 font-bold text-sm bg-fuchsia-900/40 px-2 py-1 rounded-lg border border-fuchsia-500/20">FREE</span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 relative z-10 group-hover:text-fuchsia-300 transition-colors">{proshow.title}</h3>
        <p className="text-fuchsia-200 font-medium text-sm mb-4 relative z-10">feat. {proshow.artist}</p>
        
        <div className="space-y-3 pt-4 border-t border-zinc-800/50 flex-grow">
          <div className="flex items-center gap-3 text-zinc-400 text-xs">
            <Clock size={16} className="text-zinc-500" />
            <span>{formatDate(proshow.dateTime)}</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-400 text-xs">
            <MapPin size={16} className="text-zinc-500" />
            <span className="line-clamp-1">{proshow.venue}</span>
          </div>
        </div>

        {isAdmin && (
          <div className="flex gap-2 mt-6 pt-4 border-t border-zinc-800" onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="secondary" 
              className="flex-1 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-white border-none" 
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

              <div className="w-full md:w-2/5 bg-gradient-to-br from-fuchsia-900 to-indigo-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20 shadow-xl">
                    Main Event
                  </span>
                  <h2 className="text-3xl font-bold mt-6 leading-tight drop-shadow-md">{proshow.title}</h2>
                  <p className="text-indigo-200 mt-2 font-medium flex items-center gap-2">
                    <Mic2 size={16} /> {proshow.artist}
                  </p>
                </div>
                
                <div className="space-y-4 mt-8 relative z-10">
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-indigo-200">Date & Time</p>
                      <p className="text-sm font-medium drop-shadow-sm">{formatDate(proshow.dateTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-indigo-200">Venue</p>
                      <p className="text-sm font-medium drop-shadow-sm">{proshow.venue}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-3/5 p-8 sm:p-10 flex flex-col bg-zinc-900/90 text-zinc-300 backdrop-blur-xl">
                <div className="flex-grow">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">About the Show</h4>
                  <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">
                    {proshow.description}
                  </p>
                </div>

                <div className="mt-8">
                  <div className="bg-zinc-800/50 rounded-2xl p-4 flex justify-between items-center mb-6 border border-zinc-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
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
                            : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/50"
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
                          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700" 
                          onClick={() => { setIsOpen(false); onEdit?.(proshow); }}
                        >
                          Edit Details
                        </Button>
                        <Button 
                          className="bg-rose-950/50 text-rose-400 hover:bg-rose-900/50 hover:text-rose-300 border-rose-900/50" 
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
