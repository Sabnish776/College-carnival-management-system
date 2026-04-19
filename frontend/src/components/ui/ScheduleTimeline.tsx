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
      <div className="glass rounded-[2rem] py-20 flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-fuchsia-50 rounded-2xl flex items-center justify-center text-indigo-300 mb-4 shadow-inner border border-white">
          <Calendar size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">No schedule available</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-xs">
          There are currently no events or pro-shows scheduled.
        </p>
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-zinc-200 ml-4 md:ml-6 mt-8 space-y-12 pb-8">
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
                "absolute -left-[11px] top-1 h-5 w-5 rounded-full border-4 flex items-center justify-center shadow-lg",
                isProshow ? "border-fuchsia-200 bg-fuchsia-600 shadow-fuchsia-500/50" : "border-indigo-200 bg-indigo-600 shadow-indigo-500/50"
              )}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </div>

            {/* Date Tag */}
            <div className="mb-2">
              <span className={cn(
                "inline-flex items-center text-xs font-bold px-3 py-1 rounded-full shadow-sm border",
                isProshow ? "bg-gradient-to-r from-fuchsia-50 to-purple-50 text-fuchsia-700 border-fuchsia-100" : "bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border-indigo-100"
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
              "p-5 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group glass border border-white/60",
              isProshow ? "hover:shadow-fuchsia-500/20" : "hover:shadow-indigo-500/20"
            )}>
              <div className={cn(
                "absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity",
                isProshow ? "bg-gradient-to-b from-fuchsia-500 to-purple-500" : "bg-gradient-to-b from-indigo-500 to-blue-500"
              )} />
              
              <div className="flex items-start justify-between gap-4 mb-3 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {isProshow ? (
                      <Ticket size={16} className="text-fuchsia-600" />
                    ) : (
                      <Calendar size={16} className="text-indigo-500" />
                    )}
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      isProshow ? "text-fuchsia-600" : "text-indigo-500"
                    )}>
                      {item.type === 'proshow' ? 'Pro-Show' : 'Event'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-900 transition-colors">{item.title}</h3>
                </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2 relative z-10">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm font-medium relative z-10">
                <div className="flex items-center text-slate-500">
                  <MapPin size={16} className="mr-1.5 text-indigo-400" />
                  {item.venue}
                </div>
                <div className={cn(
                  "flex items-center",
                  isProshow ? "text-fuchsia-600" : "text-indigo-600"
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
