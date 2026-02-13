import { Link } from 'react-router-dom';
import { FaStar, FaArrowRight } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { motion } from 'framer-motion';
import { Book } from '../../model/types';
import s from './BookCard.module.scss';
import { cn } from '@/shared/lib/classNames';
import { useUserStore } from '@/entities/User/model/store';

interface BookCardProps {
    book: Book;
    onReserve?: (id: number) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const { wishlist, toggleWishlist } = useUserStore();
    const isInWishlist = wishlist?.includes(book.id);

    const statusClass = {
        'AVAILABLE': s.statusAvailable,
        'RESERVED': s.statusReserved,
        'BORROWED': s.statusBorrowed
    }[book.status] || s.statusAvailable;

    const statusText = {
        'AVAILABLE': 'Доступна',
        'RESERVED': 'Забронирована',
        'BORROWED': 'На руках'
    }[book.status] || book.status;

    return (
        <div className={s.card}>
            <div className={s.coverWrapper}>
                <img src={book.cover_image_url || 'https://placehold.co/400x600?text=No+Cover'} alt={book.title} className={s.cover} />
                <span className={cn(s.status, statusClass)}>{statusText}</span>
                <motion.button
                    whileTap={{ scale: 0.8 }}
                    className={s.wishlistButton}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(book.id);
                    }}
                >
                    <CiHeart
                        size={24}
                        className={cn(
                            s.heartIcon,
                            isInWishlist && s.active
                        )}
                    />
                </motion.button>
            </div>
            <div className={s.content}>
                <h3 className={s.title}>{book.title}</h3>
                <p className={s.author}>{book.author}</p>

                <div className={s.rating}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                            key={i}
                            size={14}
                            className={cn(
                                i < Math.round(book.rating || 0) ? s.starActive : s.starInactive
                            )}
                        />
                    ))}
                    <span className={s.ratingValue}>
                        {book.rating ? book.rating.toFixed(1) : '0.0'}
                    </span>
                </div>

                <div className={s.actions}>
                    <Link to={`/books/${book.id}`} style={{ textDecoration: 'none' }}>
                        <button className={s.detailsButton}>
                            Подробнее
                            <FaArrowRight size={16} />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
