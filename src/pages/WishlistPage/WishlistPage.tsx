import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/entities/User/model/store';
import { BookCard } from '@/entities/Book/ui/BookCard/BookCard';
import { Link } from 'react-router-dom';
import s from './WishlistPage.module.scss';
import { Book } from '@/entities/Book/model/types';
import { api } from '@/shared/api/client';

export const WishlistPage: React.FC = () => {
    const { wishlist } = useUserStore();
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchWishlistBooks = async () => {
            if (!wishlist || wishlist.length === 0) {
                setBooks([]);
                return;
            }

            setIsLoading(true);
            try {
                const allBooks = await api.get<Book[]>('/books/');
                const wishlistBooks = allBooks.filter(book => wishlist.includes(book.id));
                setBooks(wishlistBooks);
            } catch (error) {
                console.error("Failed to fetch wishlist books", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlistBooks();
    }, [wishlist]);

    return (
        <div className={s.page}>
            <h1 className={s.title}>Мой список желаемого</h1>

            {isLoading ? (
                <div className={s.loading}>Загрузка...</div>
            ) : books.length > 0 ? (
                <div className={s.grid}>
                    {books.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            ) : (
                <div className={s.empty}>
                    <p>Ваш список пуст</p>
                    <Link to="/" className={s.link}>Перейти в каталог</Link>
                </div>
            )}
        </div>
    );
};
