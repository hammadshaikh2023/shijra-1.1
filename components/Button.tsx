import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '', 
  ...props 
}) => {
  
  const baseStyles = "relative px-8 py-3.5 rounded-full font-medium transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 group text-sm tracking-wide";
  
  const variants = {
    primary: "bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-lg shadow-emerald-900/40 hover:shadow-emerald-500/20 border border-emerald-500/30 hover:translate-y-[-2px]",
    secondary: "bg-gold-400 text-navy-950 font-semibold hover:bg-gold-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:translate-y-[-2px]",
    outline: "bg-transparent border border-slate-600 text-slate-300 hover:border-white hover:text-white",
    ghost: "bg-transparent text-slate-400 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
      )}
    </button>
  );
};