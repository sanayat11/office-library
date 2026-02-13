import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/entities/User/model/store';
import { Button } from '@/shared/ui/Button/Button';
import { CiUser, CiMail, CiBookmark, CiCalendar } from "react-icons/ci";
import s from './ProfilePage.module.scss';
import { Modal } from '@/shared/ui/Modal/Modal';
import { api } from '@/shared/api/client';
import { cn } from '@/shared/lib/classNames';

interface Booking {
    id: number;
    book: {
        title: string;
        author: string;
        cover_image_url?: string;
    };
    status: 'RESERVED' | 'BORROWED' | 'RETURNED' | 'CANCELLED';
    reserved_at: string;
    due_date?: string;
}

import { validatePassword } from '@/shared/lib/validation';

export const ProfilePage: React.FC = () => {
    const { user, updateProfile } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.full_name || '');
    const [newPassword, setNewPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, title: string, message: string }>({
        isOpen: false,
        title: '',
        message: ''
    });

    useEffect(() => {
        const fetchBookings = async () => {
            setIsLoadingBookings(true);
            try {
                const data = await api.get<Booking[]>('/bookings/');
                // Relaxes filter to be case-insensitive just in case
                setBookings(data.filter(b =>
                    b.status?.toUpperCase() === 'RESERVED' ||
                    b.status?.toUpperCase() === 'BORROWED'
                ));
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            } finally {
                setIsLoadingBookings(false);
            }
        };
        fetchBookings();
    }, []);

    if (!user) return <div className="p-8">Please login</div>;

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setNewName(user?.full_name || '');
        setNewPassword('');
    };

    const handleSave = async () => {
        if (!newName.trim()) return;

        if (newPassword) {
            const passwordValidation = validatePassword(newPassword);
            if (!passwordValidation.isValid) {
                setModalConfig({
                    isOpen: true,
                    title: 'Ошибка валидации',
                    message: passwordValidation.message || "Неверный формат пароля"
                });
                return;
            }
        }

        setIsSaving(true);
        try {
            const success = await updateProfile({
                full_name: newName,
                password: newPassword ? newPassword : undefined
            });

            if (success) {
                setModalConfig({
                    isOpen: true,
                    title: 'Успех',
                    message: 'Профиль успешно обновлен!'
                });
                setIsEditing(false);
                setNewPassword('');
            } else {
                setModalConfig({
                    isOpen: true,
                    title: 'Ошибка',
                    message: 'Не удалось обновить профиль'
                });
            }
        } catch (error: any) {
            setModalConfig({
                isOpen: true,
                title: 'Ошибка',
                message: 'Ошибка при обновлении: ' + error.message
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={s.page}>
            <div className={s.header}>
                <div className={s.avatarWrapper}>
                    {user.avatar ? <img src={user.avatar} alt="Avatar" className={s.avatar} /> : <CiUser size={48} />}
                </div>
                <div className={s.userInfoContent}>
                    {isEditing ? (
                        <div className={s.editForm}>
                            <input
                                className={s.editInput}
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Имя"
                                autoFocus
                            />
                            <input
                                className={s.editInput}
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Новый пароль (необязательно)"
                                style={{ marginTop: '0.5rem' }}
                            />
                            <div className={s.editActions}>
                                <Button onClick={handleSave} isLoading={isSaving} style={{ fontSize: '0.875rem' }}>Сохранить</Button>
                                <Button variant="secondary" onClick={handleEditToggle} style={{ fontSize: '0.875rem' }}>Отмена</Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className={s.name}>{user.full_name}</h1>
                            <div className={s.meta}>
                                <CiMail size={20} />
                                <span>{user.email}</span>
                            </div>
                            <div className={s.meta}>
                                <CiUser size={20} />
                                <span style={{ textTransform: 'capitalize' }}>{user.role?.toLowerCase()}</span>
                            </div>
                            <Button variant="secondary" onClick={handleEditToggle} style={{ marginTop: '1rem', fontSize: '0.875rem' }}>Редактировать профиль</Button>
                        </>
                    )}
                </div>
            </div>

            <div className={s.section}>
                <h2 className={s.sectionTitle}>Мои книги</h2>
                {isLoadingBookings ? (
                    <div className={s.loading}>Загрузка книг...</div>
                ) : bookings.length > 0 ? (
                    <div className={s.bookingsGrid}>
                        {bookings.map(booking => (
                            <div key={booking.id} className={s.bookingCard}>
                                <div className={s.bookCover}>
                                    {booking.book?.cover_image_url ? (
                                        <img src={booking.book.cover_image_url} alt={booking.book?.title || 'Book Cover'} />
                                    ) : (
                                        <div className={s.placeholderCover} />
                                    )}
                                    <span className={cn(s.statusBadge, s[(booking.status || '').toLowerCase()])}>
                                        {(booking.status || '').toUpperCase() === 'RESERVED' ? 'Забронировано' : 'На руках'}
                                    </span>
                                </div>
                                <div className={s.bookInfo}>
                                    <h3 className={s.bookTitle}>{booking.book?.title || 'Книга удалена'}</h3>
                                    <p className={s.bookAuthor}>{booking.book?.author || '-'}</p>
                                    <div className={s.bookingMeta}>
                                        <CiCalendar />
                                        <span>
                                            {booking.status === 'RESERVED'
                                                ? `Бронь до: ${new Date(booking.due_date || '').toLocaleDateString()}`
                                                : `Вернуть до: ${new Date(booking.due_date || '').toLocaleDateString()}`
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={s.emptyState}>
                        <CiBookmark size={48} />
                        <p>У вас пока нет активных бронирований или книг на руках.</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
            >
                <div style={{ textAlign: 'center' }}>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>{modalConfig.message}</p>
                    <Button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} style={{ width: '100%' }}>
                        Понятно
                    </Button>
                </div>
            </Modal>
        </div>
    );
};
