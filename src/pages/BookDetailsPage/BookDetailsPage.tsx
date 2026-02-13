import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookStore } from '@/entities/Book/model/store';
import { useUserStore } from '@/entities/User/model/store';
import { Button } from '@/shared/ui/Button/Button';
import { CiCircleChevLeft, CiBookmark, CiHashtag, CiStar, CiHeart, CiCalendar } from "react-icons/ci";
import s from './BookDetailsPage.module.scss';
import { cn } from '@/shared/lib/classNames';
import { ReviewList } from '@/entities/Book/ui/ReviewList/ReviewList';
import { ReviewForm } from '@/entities/Book/ui/ReviewForm/ReviewForm';
import { Modal } from '@/shared/ui/Modal/Modal';

export const BookDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { books, fetchBooks, categories, fetchCategories, reserveBook, isLoading: isBookLoading } = useBookStore();
    const { isAuthenticated, wishlist, toggleWishlist } = useUserStore();
    const isInWishlist = wishlist?.includes(Number(id));
    const [isReserving, setIsReserving] = useState(false);
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, title: string, message: string }>({
        isOpen: false,
        title: '',
        message: ''
    });

    useEffect(() => {
        if (books.length === 0) fetchBooks();
        if (categories.length === 0) fetchCategories();
    }, [books, fetchBooks, categories, fetchCategories]);

    const book = books.find(b => b.id === Number(id));
    const category = categories.find(c => c.id === book?.category_id);

    if (isBookLoading || !book) {
        return (
            <div className={s.loadingWrapper}>
                <div className={s.spinner}></div>
                <p>Loading book details...</p>
            </div>
        );
    }

    const handleReserve = async () => {
        if (!isAuthenticated) return navigate('/login');
        setIsReserving(true);
        try {
            await reserveBook(book.id);
            setModalConfig({
                isOpen: true,
                title: 'Успех!',
                message: 'Книга успешно забронирована!'
            });
        } catch (error: any) {
            setModalConfig({
                isOpen: true,
                title: 'Ошибка',
                message: 'Не удалось забронировать: ' + error.message
            });
        } finally {
            setIsReserving(false);
        }
    };

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
        <div className={s.page}>
            <button onClick={() => navigate(-1)} className={s.backButton}>
                <CiCircleChevLeft size={24} />
                Назад в каталог
            </button>

            <div className={s.contentWrapper}>
                <div className={s.coverColumn}>
                    <div className={s.coverWrapper}>
                        <img src={book.cover_image_url || 'https://placehold.co/600x900?text=No+Cover'} alt={book.title} className={s.cover} />
                    </div>
                </div>

                <div className={s.detailsColumn}>
                    <div className={s.header}>
                        <h1 className={s.title}>{book.title}</h1>
                        <p className={s.author}>Автор: {book.author}</p>

                        <div className={s.badges}>
                            <span className={cn(s.status, statusClass)}>{statusText}</span>
                            <div className={s.rating}>
                                <CiStar size={20} className={cn(book.rating > 0 ? "fill-yellow-400 text-yellow-400" : "text-gray-300 fill-gray-100")} />
                                <span>{book.rating ? book.rating.toFixed(1) : 'Нет оценок'}</span>
                            </div>
                            <button
                                onClick={() => toggleWishlist(book.id)}
                                className={cn(s.wishlistButton, isInWishlist && s.active)}
                            >
                                <CiHeart
                                    size={24}
                                    className={s.heartIcon}
                                />
                                <span>{isInWishlist ? 'В избранном' : 'В избранное'}</span>
                            </button>
                        </div>
                    </div>

                    <div className={s.infoGrid}>
                        <div className={s.infoItem}>
                            <CiHashtag size={24} className="text-gray-400" />
                            <div>
                                <span className={s.label}>ISBN</span>
                                <p>{book.isbn}</p>
                            </div>
                        </div>
                        <div className={s.infoItem}>
                            <CiBookmark size={24} className="text-gray-400" />
                            <div>
                                <span className={s.label}>Категория</span>
                                <p>{category?.name || 'Неизвестно'}</p>
                            </div>
                        </div>
                        <div className={s.infoItem}>
                            <CiCalendar size={24} className="text-gray-400" />
                            <div>
                                <span className={s.label}>Добавлено</span>
                                <p>{new Date(book.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className={s.description}>
                        <h3>Описание</h3>
                        <p>{book.description || "Описание отсутствует."}</p>
                    </div>

                    <div className={s.actions}>
                        {book.status === 'AVAILABLE' ? (
                            <Button onClick={handleReserve} className={s.reserveButton} disabled={isReserving}>
                                {isReserving ? 'Бронирование...' : 'Забронировать'}
                            </Button>
                        ) : (
                            <Button disabled className={s.unavailableButton}>
                                Временно недоступна
                            </Button>
                        )}
                    </div>
                </div>
                <div className={s.reviewsSection}>
                    <h2 className={s.sectionTitle}>Отзывы</h2>
                    <ReviewList bookId={book.id} />
                    {isAuthenticated && <ReviewForm bookId={book.id} />}
                </div>
            </div>

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
            >
                <div className={s.modalBody}>
                    <p>{modalConfig.message}</p>
                    <Button
                        onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
                        className={s.modalBtn}
                    >
                        Понятно
                    </Button>
                </div>
            </Modal>
        </div>
    );
};
