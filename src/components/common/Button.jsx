import React from 'react';
import { cn } from '../../utils';

const Button = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyle = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-primary text-white hover:bg-primary-hover focus:ring-primary",
        secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400"
    };

    return (
        <button className={cn(baseStyle, variants[variant], className)} {...props}>
            {children}
        </button>
    );
};
export default Button;
