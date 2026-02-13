import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CiFilter } from 'react-icons/ci';
import { cn } from '@/shared/lib/classNames';
import s from './CategorySelect.module.scss';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    value: number | null;
    onChange: (value: number | null) => void;
}

export const CategorySelect = ({ categories, value, onChange }: Props) => {
    const [open, setOpen] = useState(false);

    const activeCategory = categories.find(c => c.id === value);

    return (
        <div className={s.wrapper}>
            <button
                className={s.trigger}
                onClick={() => setOpen(prev => !prev)}
            >
                <CiFilter size={20} />
                <span>{activeCategory?.name || 'Все категории'}</span>
                <span className={s.arrow} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className={s.dropdown}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div
                            className={s.item}
                            onClick={() => {
                                onChange(null);
                                setOpen(false);
                            }}
                        >
                            Все категории
                        </div>

                        {categories.map(c => (
                            <div
                                key={c.id}
                                className={cn(
                                    s.item,
                                    value === c.id && s.active
                                )}
                                onClick={() => {
                                    onChange(c.id);
                                    setOpen(false);
                                }}
                            >
                                {c.name}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
