import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/entities/User/model/store';
import { api } from '@/shared/api/client';
import { Link, Navigate } from 'react-router-dom';
import { cn } from '@/shared/lib/classNames';
import { Button } from '@/shared/ui/Button/Button';
import { useBookStore } from '@/entities/Book/model/store';
import s from './MyBooksPage.module.scss';
import { Modal } from '@/shared/ui/Modal/Modal';

interface Booking {
    id: number;
    user_id: number;
    book_id: number;
    status: string;
    reserved_at: string;
    borrowed_at: string;
    returned_at: string;
    due_date: string;
}

export const MyBooksPage: React.FC = () => {
    const { isAuthenticated } = useUserStore();
    const [activeTab, setActiveTab] = useState('RESERVED');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { books, fetchBooks: fetchAllBooks } = useBookStore();
    const [errorModal, setErrorModal] = useState<{ isOpen: boolean, message: string }>({
        isOpen: false,
        message: ''
    });

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const data = await api.get<Booking[]>('/bookings/');
            setBookings(data);
            if (books.length === 0) {
                await fetchAllBooks();
            }
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchBookings();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) return <Navigate to="/login" />;

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'HISTORY') return b.status === 'RETURNED';
        return b.status === activeTab;
    });

    const handleReturn = async (bookingId: number) => {
        try {
            await api.post(`/bookings/${bookingId}/return`, {});
            fetchBookings();
        } catch (error: any) {
            setErrorModal({
                isOpen: true,
                message: 'Ошибка при возврате книги: ' + error.message
            });
        }
    };

    const handlePickup = async (bookingId: number) => {
        try {
            await api.post(`/bookings/${bookingId}/pickup`, {});
            fetchBookings();
        } catch (error: any) {
            setErrorModal({
                isOpen: true,
                message: 'Ошибка при получении книги: ' + error.message
            });
        }
    }

    const tabNames: Record<string, string> = {
        'RESERVED': 'Забронированные',
        'BORROWED': 'На руках',
        'HISTORY': 'История'
    };

    return (
        <div className={s.page}>
            <h1 className={s.title}>Мои книги</h1>
            <div className={s.tabs}>
                {['RESERVED', 'BORROWED', 'HISTORY'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(s.tab, activeTab === tab && s.activeTab)}
                    >
                        {tabNames[tab]}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div>Загрузка...</div>
            ) : (
                <div className={s.grid}>
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => {
                            const book = books.find(b => b.id === booking.book_id);
                            return (
                                <div key={booking.id} className={s.card}>
                                    <div className={s.coverWrapper}>
                                        <img
                                            src={book?.cover_image_url || 'https://placehold.co/400x600?text=No+Cover'}
                                            alt={book?.title || 'Book'}
                                            className={s.cover}
                                        />
                                        <div className={s.statusBadge}>
                                            {tabNames[booking.status]}
                                        </div>
                                    </div>
                                    <div className={s.content}>
                                        <h3 className={s.bookTitle}>{book?.title || `Книга #${booking.book_id}`}</h3>
                                        <p className={s.author}>{book?.author || 'Автор неизвестен'}</p>

                                        <div className={s.dateInfo}>
                                            {booking.status === 'BORROWED' && (
                                                <p className={s.dueDate}>Вернуть до: <span>{new Date(booking.due_date).toLocaleDateString()}</span></p>
                                            )}
                                            {booking.status === 'RESERVED' && (
                                                <p className={s.reserveDate}>Бронь от: <span>{new Date(booking.reserved_at).toLocaleDateString()}</span></p>
                                            )}
                                        </div>

                                        <div className={s.actions}>
                                            {booking.status === 'RESERVED' && (
                                                <Button
                                                    onClick={() => handlePickup(booking.id)}
                                                    style={{ width: '100%' }}
                                                >
                                                    Забрать
                                                </Button>
                                            )}
                                            {booking.status === 'BORROWED' && (
                                                <Button
                                                    onClick={() => handleReturn(booking.id)}
                                                    style={{ width: '100%' }}
                                                >
                                                    Вернуть
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className={s.emptyState}>
                            <div className={s.emptyIcon}>📚</div>
                            <p className={s.emptyTitle}>В этом разделе пока пусто</p>
                            <p className={s.emptySubtitle}>Найдите вдохновение в нашем каталоге и забронируйте свою первую книгу!</p>
                            <Link to="/" className={s.catalogBtn}>Перейти в каталог</Link>
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
                title="Ошибка"
            >
                <div style={{ textAlign: 'center' }}>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>{errorModal.message}</p>
                    <Button onClick={() => setErrorModal({ ...errorModal, isOpen: false })} style={{ width: '100%' }}>
                        Понятно
                    </Button>
                </div>
            </Modal>
        </div>
    );
};
