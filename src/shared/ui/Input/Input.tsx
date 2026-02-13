import React, { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/classNames';
import s from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ className, label, ...props }) => {
    return (
        <div className={s.inputWrapper}>
            {label && <label className={s.label}>{label}</label>}
            <input
                className={cn(s.input, className)}
                {...props}
            />
        </div>
    );
};
