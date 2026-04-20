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
    primary: "bg-gradient-to-r from-primary to-primary-dark text-background hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-primary-light/50 font-bold tracking-wide",
    secondary: "glass text-text-primary hover:bg-surface-light hover:border-primary/50 shadow-sm transition-colors",
    ghost: "bg-transparent text-text-secondary hover:text-primary hover:bg-primary/10 border border-transparent transition-colors"
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
  <div className="space-y-1.5 ">
    <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1 opacity-80">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
        <Icon size={18} />
      </div>
      <input
        className={cn(
          "w-full bg-[#0a0a0a] border border-border-soft rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-text-secondary/50 focus:bg-surface text-text-primary",
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
