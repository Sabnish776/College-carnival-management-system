import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Ticket, MapPin, Tag, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TimelineItem {
  id: string;
  type: 'event' | 'proshow';
  title: string;
  description: string;
  date: Date;
  venue: string;
  categoryOrArtist: string;
}

interface ScheduleTimelineProps {
  items: TimelineItem[];
}

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="glass-card rounded-3xl py-20 flex flex-col items-center justify-center text-center px-6 bg-[#0a0a0a] border border-white/5">
        <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center text-primary mb-6 shadow-[0_0_20px_rgba(212,175,55,0.2)] border border-white/10">
          <Calendar size={32} />
        </div>
        <h3 className="text-xl font-bold font-serif text-text-primary tracking-wide">No schedule available</h3>
        <p className="text-text-secondary/70 text-sm mt-2 max-w-xs font-light">
          There are currently no events or pro-shows scheduled.
        </p>
      </div>
    );
  }

  return (
    <div className="relative border-l-[3px] border-primary/20 ml-4 md:ml-6 mt-8 space-y-12 pb-8 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
      {items.map((item, index) => {
        const isProshow = item.type === 'proshow';
        
        return (
          <motion.div
            key={`${item.type}-${item.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-8 md:pl-10"
          >
            {/* Timeline dot */}
            <div 
              className={cn(
                "absolute -left-[11px] top-1 h-5 w-5 rounded-full border-4 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.8)] z-10",
                isProshow ? "border-[#050505] bg-secondary shadow-[0_0_15px_rgba(109,40,217,0.8)]" : "border-[#050505] bg-primary shadow-[0_0_15px_rgba(212,175,55,0.8)]"
              )}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </div>

            {/* Date Tag */}
            <div className="mb-2">
              <span className={cn(
                "inline-flex items-center text-xs font-bold px-3 py-1 rounded-sm shadow-xl border tracking-[0.15em] uppercase",
                isProshow ? "bg-surface text-secondary border-secondary/30" : "bg-surface text-primary border-primary/30"
              )}>
                <Clock className="w-3.5 h-3.5 mr-1" />
                {new Intl.DateTimeFormat('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                }).format(item.date)}
              </span>
            </div>

            {/* Content Card */}
            <div className={cn(
              "p-6 md:p-8 rounded-sm transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:-translate-y-1 relative overflow-hidden group glass-card bg-[#0A0A0A] border border-white/5",
              isProshow ? "hover:border-secondary/50" : "hover:border-primary/50"
            )}>
              <div className={cn(
                "absolute top-0 left-0 w-1.5 h-full opacity-0 group-hover:opacity-100 transition-all duration-500",
                isProshow ? "bg-gradient-to-b from-secondary to-secondary/20 shadow-[0_0_15px_rgba(109,40,217,0.8)]" : "bg-gradient-to-b from-primary to-primary-dark shadow-[0_0_15px_rgba(212,175,55,0.8)]"
              )} />
              
              <div className="flex items-start justify-between gap-4 mb-3 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {isProshow ? (
                      <Ticket size={16} className="text-secondary" />
                    ) : (
                      <Calendar size={16} className="text-primary" />
                    )}
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.2em]",
                      isProshow ? "text-secondary" : "text-primary"
                    )}>
                      {item.type === 'proshow' ? 'Pro-Show' : 'Event'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-text-primary group-hover:text-primary transition-colors leading-none tracking-wide">{item.title}</h3>
                </div>
              </div>

              <p className="text-text-secondary/80 text-sm leading-relaxed mb-6 line-clamp-2 relative z-10 font-light">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm font-medium relative z-10">
                <div className="flex items-center text-text-secondary">
                  <MapPin size={16} className="mr-1.5 text-accent" />
                  {item.venue}
                </div>
                <div className={cn(
                  "flex items-center",
                  isProshow ? "text-secondary" : "text-primary"
                )}>
                  {isProshow ? <Ticket size={16} className="mr-1.5" /> : <Tag size={16} className="mr-1.5" />}
                  {item.categoryOrArtist}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
