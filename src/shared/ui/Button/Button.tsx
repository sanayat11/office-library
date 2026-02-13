import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/classNames';
import s from './Button.module.scss';
import { motion } from 'framer-motion';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref'> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    className,
    isLoading,
    disabled,
    ...props
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(s.button, s[variant], className)}
            disabled={disabled || isLoading}
            {...(props as any)}
        >
            {isLoading ? (
                <div className={s.spinner} />
            ) : children}
        </motion.button>
    );
};
