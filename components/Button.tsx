import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  icon,
  className = '',
  ...props 
}) => {
  // Added hover:scale-105 for micro-interaction
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-tight transform hover:scale-105 active:scale-95";
  
  const variants = {
    // Vibrant Blue (Action) - White text for contrast + Glow effect
    primary: "bg-accent-500 text-white hover:bg-accent-400 border border-transparent shadow-lg shadow-accent-500/30 hover:shadow-accent-500/50 hover:-translate-y-1",
    // Light Blue secondary
    secondary: "bg-brand-50 text-brand-600 hover:bg-brand-100 border border-transparent",
    // Outline - Bold border
    outline: "bg-transparent text-slate-700 border-2 border-slate-200 hover:border-accent-500 hover:text-accent-600",
    // Ghost
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-none hover:scale-100",
    // White (for dark backgrounds)
    white: "bg-white text-brand-600 hover:bg-slate-50 shadow-md",
    // Dark Blue (Primary Brand)
    dark: "bg-brand-500 text-white hover:bg-brand-600 shadow-lg"
  };

  const sizes = {
    sm: "text-xs px-5 py-2",
    md: "text-sm px-7 py-3",
    lg: "text-base px-10 py-4",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
};