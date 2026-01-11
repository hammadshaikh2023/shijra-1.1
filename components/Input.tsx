import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          className={`
            w-full px-5 py-4 rounded-2xl
            bg-navy-900/50 backdrop-blur-sm
            border border-slate-700
            text-white placeholder-slate-500
            focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/20
            transition-all duration-300
            hover:border-slate-600
            ${className}
          `}
          {...props}
        />
        {/* Glow effect on bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent transition-all duration-500 group-hover:w-2/3 group-focus-within:w-full" />
      </div>
    </div>
  );
};