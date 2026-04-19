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
      <div className="bg-white border border-dashed border-zinc-300 rounded-[2rem] py-20 flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 mb-4">
          <Calendar size={32} />
        </div>
        <h3 className="text-lg font-bold text-zinc-900">No schedule available</h3>
        <p className="text-zinc-500 text-sm mt-1 max-w-xs">
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
                "absolute -left-[11px] top-1 h-5 w-5 rounded-full border-4 border-white flex items-center justify-center",
                isProshow ? "bg-indigo-600" : "bg-zinc-800"
              )}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>

            {/* Date Tag */}
            <div className="mb-2">
              <span className={cn(
                "inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full",
                isProshow ? "bg-indigo-50 text-indigo-700" : "bg-zinc-100 text-zinc-700"
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
              "p-5 rounded-2xl border transition-shadow hover:shadow-lg bg-white",
              isProshow ? "border-indigo-100/50 shadow-indigo-900/5" : "border-zinc-200/50 shadow-zinc-900/5"
            )}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {isProshow ? (
                      <Ticket size={16} className="text-indigo-600" />
                    ) : (
                      <Calendar size={16} className="text-zinc-500" />
                    )}
                    <span className={cn(
                      "text-xs font-bold uppercase tracking-wider",
                      isProshow ? "text-indigo-600" : "text-zinc-500"
                    )}>
                      {item.type === 'proshow' ? 'Pro-Show' : 'Event'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">{item.title}</h3>
                </div>
              </div>

              <p className="text-zinc-600 text-sm leading-relaxed mb-4 line-clamp-2">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm font-medium">
                <div className="flex items-center text-zinc-500">
                  <MapPin size={16} className="mr-1.5" />
                  {item.venue}
                </div>
                <div className={cn(
                  "flex items-center",
                  isProshow ? "text-indigo-600" : "text-zinc-500"
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
