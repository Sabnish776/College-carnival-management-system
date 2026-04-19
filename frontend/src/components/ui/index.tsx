import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false,
  className,
  ...props 
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:from-indigo-700 hover:to-fuchsia-700 shadow-lg shadow-indigo-500/25 border border-white/10",
    secondary: "glass text-slate-800 hover:bg-white/80",
    ghost: "bg-transparent text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
  };

  return (
    <button
      disabled={isLoading || props.disabled}
      className={cn(
        "relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100",
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" size={18} /> : children}
    </button>
  );
};

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: any;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  icon: Icon,
  className,
  ...props 
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
        <Icon size={18} />
      </div>
      <input
        className={cn(
          "w-full bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400 focus:bg-white/80",
          className
        )}
        {...props}
      />
    </div>
  </div>
);

export * from './EventCard';
export * from './EventForm';
export * from './AnnouncementCard';
export * from './AnnouncementForm';
export * from './ProshowCard';
export * from './ProshowForm';
export * from './ScheduleTimeline';
