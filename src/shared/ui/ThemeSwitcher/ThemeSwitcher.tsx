import React from 'react';
import { useThemeStore } from '@/shared/model/themeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CiSun, CiCloudMoon } from 'react-icons/ci';
import { cn } from '@/shared/lib/classNames';
import s from './ThemeSwitcher.module.scss';

export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className }) => {
    const { theme, toggleTheme, initTheme } = useThemeStore();

    React.useEffect(() => {
        initTheme();
    }, []);

    const isLight = theme === 'light';

    return (
        <div className={cn(s.container, className)}>
            <motion.button
                layout
                onClick={toggleTheme}
                className={s.switcher}
                aria-label="Toggle theme"
            >
                <motion.div
                    className={s.indicator}
                    animate={{ x: isLight ? 0 : 38 }}
                    transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 30,
                    }}
                >
                    <AnimatePresence mode="wait">
                        {isLight ? (
                            <motion.span
                                key="sun"
                                className={s.icon}
                                initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.6, rotate: 90 }}
                                transition={{ duration: 0.25 }}
                            >
                                <CiSun size={18} />
                            </motion.span>
                        ) : (
                            <motion.span
                                key="moon"
                                className={s.icon}
                                initial={{ opacity: 0, scale: 0.6, rotate: 90 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.6, rotate: -90 }}
                                transition={{ duration: 0.25 }}
                            >
                                <CiCloudMoon size={18} />
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.button>
        </div>
    );
};
