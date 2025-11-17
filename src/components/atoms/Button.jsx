import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default",
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]",
    secondary: "bg-secondary hover:bg-secondary/90 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]",
    outline: "border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100",
    ghost: "text-slate-400 hover:text-slate-100 hover:bg-slate-700/50",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm h-8",
    default: "px-4 py-2 text-sm h-10", 
    lg: "px-6 py-3 text-base h-12",
    icon: "w-10 h-10"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;