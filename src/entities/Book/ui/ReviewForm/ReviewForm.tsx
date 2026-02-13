import React, { useState } from 'react';
import { useBookStore } from '@/entities/Book/model/store';
import { Button } from '@/shared/ui/Button/Button';
import { FaStar } from "react-icons/fa";
import s from './ReviewForm.module.scss';
import { cn } from '@/shared/lib/classNames';
import { motion } from 'framer-motion';

import { Modal } from '@/shared/ui/Modal/Modal';

interface ReviewFormProps {
    bookId: number;
    onSuccess?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showError, setShowError] = useState(false);
    const { addReview } = useBookStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setIsSubmitting(true);
        try {
            await addReview(bookId, rating, comment);
            setComment('');
            setRating(5);
            if (onSuccess) onSuccess();
        } catch (error) {
            setShowError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={s.form}>
                <h3 className={s.title}>Оставить отзыв</h3>

                <div className={s.ratingSelect}>
                    <span className={s.label}>Оценка:</span>
                    <div className={s.stars} onMouseLeave={() => setHoverRating(0)}>
                        {Array.from({ length: 5 }).map((_, i) => {
                            const starValue = i + 1;
                            const isActive = starValue <= (hoverRating || rating);

                            return (
                                <motion.button
                                    key={i}
                                    type="button"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onMouseEnter={() => setHoverRating(starValue)}
                                    onClick={() => setRating(starValue)}
                                    className={s.starBtn}
                                >
                                    <FaStar
                                        size={24}
                                        className={cn(
                                            s.star,
                                            isActive ? s.starActive : s.starInactive
                                        )}
                                    />
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                <textarea
                    className={s.textarea}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Поделитесь своими впечатлениями..."
                    required
                />

                <Button type="submit" disabled={isSubmitting} className={s.submitBtn}>
                    {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                </Button>
            </form>

            <Modal
                isOpen={showError}
                onClose={() => setShowError(false)}
                title="Ошибка"
            >
                <div className={s.modalBody}>
                    <p>Не удалось отправить отзыв. Пожалуйста, попробуйте позже.</p>
                    <Button onClick={() => setShowError(false)} style={{ width: '100%' }}>
                        Понятно
                    </Button>
                </div>
            </Modal>
        </>
    );
};
