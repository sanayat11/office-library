import React, { useEffect } from 'react';
import { useBookStore } from '@/entities/Book/model/store';
import { CiUser } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import s from './ReviewList.module.scss';
import { cn } from '@/shared/lib/classNames';

interface ReviewListProps {
    bookId: number;
}

export const ReviewList: React.FC<ReviewListProps> = ({ bookId }) => {
    const { reviews, fetchReviews } = useBookStore();

    useEffect(() => {
        fetchReviews(bookId);
    }, [bookId, fetchReviews]);

    if (!reviews || reviews.length === 0) {
        return <div className={s.empty}>Нет отзывов. Будьте первыми!</div>;
    }

    return (
        <div className={s.list}>
            {reviews.map((review) => (
                <div key={review.id} className={s.review}>
                    <div className={s.header}>
                        <div className={s.user}>
                            <div className={s.avatar}>
                                {review.user?.avatar ? (
                                    <img src={review.user.avatar} alt="Avatar" />
                                ) : (
                                    <CiUser size={20} className="text-gray-500" />
                                )}
                            </div>
                            <span className={s.name}>{review.user?.full_name || 'Аноним'}</span>
                        </div>
                        <div className={s.rating}>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <FaStar
                                    key={i}
                                    size={24}
                                    className={cn(
                                        s.star,
                                        i < review.rating ? s.starActive : s.starInactive
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                    <p className={s.comment}>{review.comment}</p>
                    <span className={s.date}>{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
            ))}
        </div>
    );
};
