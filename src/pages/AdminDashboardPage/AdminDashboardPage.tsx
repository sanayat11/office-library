import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/entities/User/model/store';
import { useAdminStore } from '@/entities/User/model/adminStore';
import { useBookStore } from '@/entities/Book/model/store';
import { CiBookmark, CiUser, CiCalendar, CiWarning, CiSettings, CiCirclePlus } from "react-icons/ci";
import { cn } from '@/shared/lib/classNames';
import s from './AdminDashboardPage.module.scss';
import { Button } from '@/shared/ui/Button/Button';
import { Modal } from '@/shared/ui/Modal/Modal';
import { SettingsForm } from './SettingsForm';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, colorClass }) => (
    <div className={s.statCard}>
        <div className={cn(s.iconWrapper, colorClass)}>
            <Icon size={32} className={s.icon} />
        </div>
        <div className={s.statInfo}>
            <p className={s.statTitle}>{title}</p>
            <p className={s.statValue}>{value}</p>
        </div>
    </div>
);

const ActivityListSkeleton = () => (
    <div className={s.skeletonList}>
        {[1, 2, 3, 4].map(i => (
            <div key={i} className={s.skeletonItem}>
                <div className={s.skeletonIcon} />
                <div className={s.skeletonText}>
                    <div className={s.skeletonLine} style={{ width: '60%' }} />
                    <div className={s.skeletonLine} style={{ width: '30%' }} />
                </div>
            </div>
        ))}
    </div>
);

const ActivityList: React.FC<{
    activities: any[],
    isLoading: boolean,
    onPageChange: (page: number) => void,
    currentPage: number,
    totalPages: number
}> = ({ activities, isLoading, onPageChange, currentPage, totalPages }) => {
    if (isLoading && activities.length === 0) return <ActivityListSkeleton />;

    if (!activities.length) return <div className={s.emptyActivity}>Нет активности за последнее время</div>;

    return (
        <div className={s.activityList}>
            {activities.map((activity, idx) => {
                const date = new Date(activity.created_at);
                const isValidDate = !isNaN(date.getTime());
                let icon = <CiCirclePlus className={s.iconAdded} />;
                let actionColor = 'var(--text-primary)';

                if (activity.type === 'BOOK_DELETED') {
                    icon = <CiWarning className={s.iconDeleted} />;
                    actionColor = 'var(--error-color)';
                } else if (activity.type === 'REVIEW') {
                    icon = <CiBookmark className={s.iconReview} />;
                } else if (activity.type === 'BOOKING') {
                    icon = <CiCalendar className={s.iconBooking} />;
                }

                return (
                    <div key={idx} className={s.activityItem}>
                        <div className={s.activityIconWrapper}>{icon}</div>
                        <div className={s.activityInfo}>
                            <span className={s.activityText}>
                                <strong>{activity.user_name}</strong>
                                <span style={{ color: actionColor, margin: '0 4px' }}>{activity.action}</span>
                                <span className={s.targetName}>{activity.target}</span>
                            </span>
                            <span className={s.activityTime}>
                                {isValidDate ? date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                        </div>
                    </div>
                );
            })}
            <div className={s.pagination}>
                <Button
                    variant="secondary"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                >
                    Назад
                </Button>
                <span className={s.pageInfo}>
                    {currentPage} / {totalPages || 1}
                </span>
                <Button
                    variant="secondary"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                >
                    Вперед
                </Button>
            </div>
        </div>
    );
};

export const AdminDashboardPage: React.FC = () => {
    const { user } = useUserStore();
    const {
        stats, activities, settings, users, isLoading,
        fetchDashboard, fetchSettings, updateSettings, fetchPendingUsers,
        approveUser, rejectUser,
        currentActivityPage, totalActivities, fetchActivities, activityLimit
    } = useAdminStore();
    const { categories, fetchCategories, addBook } = useBookStore();
    const [currentView, setCurrentView] = useState<'DASHBOARD' | 'USERS' | 'SETTINGS'>('DASHBOARD');
    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
    const [newBookForm, setNewBookForm] = useState({
        title: '',
        author: '',
        isbn: '',
        description: '',
        category_id: '',
        cover_image_url: ''
    });
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchDashboard();
            fetchPendingUsers();
            fetchSettings();
            fetchCategories();
        }
    }, [user, fetchDashboard, fetchPendingUsers, fetchSettings, fetchCategories]);

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            const success = await addBook(
                {
                    ...newBookForm,
                    category_id: parseInt(newBookForm.category_id)
                }
            );
            if (success) {
                setIsAddBookModalOpen(false);
                setNewBookForm({
                    title: '',
                    author: '',
                    isbn: '',
                    description: '',
                    category_id: '',
                    cover_image_url: ''
                });
            }
        } catch (error: any) {
            setFormError(error.message || 'Произошла ошибка при добавлении книги');
        }
    };

    if (!user || user.role !== 'ADMIN') return <Navigate to="/" />;

    if (currentView === 'USERS') {
        return (
            <div className={s.page}>
                <div className={s.header}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div>
                            <h1 className={s.title}>Управление пользователями</h1>
                            <p className={s.subtitle}>Все зарегистрированные сотрудники</p>
                        </div>
                        <Button variant="secondary" onClick={() => setCurrentView('DASHBOARD')}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Назад к панели
                            </div>
                        </Button>
                    </div>
                </div>

                <div className={s.card}>
                    <div className={s.usersTable}>
                        <div className={s.tableHeader}>
                            <span>Имя</span>
                            <span>Email</span>
                            <span>Роль</span>
                            <span>Статус</span>
                            <span>Действия</span>
                        </div>
                        <div className={s.tableBody}>
                            {users.map(u => (
                                <div key={u.id} className={s.tableRow}>
                                    <div className={s.userInfo}>
                                        <div className={s.userAvatar}>
                                            {u.avatar ? <img src={u.avatar} alt="" /> : <CiUser />}
                                        </div>
                                        <strong>{u.full_name}</strong>
                                    </div>
                                    <span data-label="Email">{u.email}</span>
                                    <span data-label="Роль" style={{ textTransform: 'capitalize' }}>{u.role?.toLowerCase()}</span>
                                    <span data-label="Статус" className={cn(s.badge, u.is_active ? s.active : s.pending)}>
                                        {u.is_active ? 'Активен' : 'Ожидает'}
                                    </span>
                                    <div className={s.tableActions}>
                                        {!u.is_active && (
                                            <>
                                                <Button onClick={() => approveUser(u.id)}>Одобрить</Button>
                                                <Button variant="secondary" onClick={() => rejectUser(u.id)}>Отклонить</Button>
                                            </>
                                        )}
                                        {u.is_active && u.id !== user.id && (
                                            <Button variant="secondary">Заблокировать</Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (currentView === 'SETTINGS') {
        return (
            <div className={s.page}>
                <div className={s.header}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div>
                            <h1 className={s.title}>Настройки системы</h1>
                            <p className={s.subtitle}>Глобальные параметры библиотеки</p>
                        </div>
                        <Button variant="secondary" onClick={() => setCurrentView('DASHBOARD')}>Назад</Button>
                    </div>
                </div>

                <div className={s.card}>
                    {settings ? (
                        <SettingsForm settings={settings} onSave={updateSettings} />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>Загрузка настроек...</div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={s.page}>
            <div className={cn(s.header, s.centered)}>
                <h1 className={s.title}>Панель администратора</h1>
                <p className={s.subtitle}>Добро пожаловать, {user.full_name}</p>
            </div>

            <div className={s.statsGrid}>
                <StatCard
                    title="Всего книг"
                    value={isLoading ? '...' : (stats?.total_books ?? 0)}
                    icon={CiBookmark}
                    colorClass={s.blue}
                />
                <StatCard
                    title="Пользователи"
                    value={isLoading ? '...' : (stats?.total_users ?? 0)}
                    icon={CiUser}
                    colorClass={s.green}
                />
                <StatCard
                    title="Активные брони"
                    value={isLoading ? '...' : (stats?.total_active_bookings ?? 0)}
                    icon={CiCalendar}
                    colorClass={s.yellow}
                />
                <StatCard
                    title="Просрочено"
                    value={isLoading ? '...' : (stats?.overdue_books ?? 0)}
                    icon={CiWarning}
                    colorClass={s.red}
                />
            </div>

            <div className={s.contentGrid}>
                <div className={s.card}>
                    <div className={s.cardHeader}>
                        <h2 className={s.cardTitle}>Последняя активность</h2>
                        <div className={s.liveIndicator} />
                    </div>
                    <ActivityList
                        activities={activities}
                        isLoading={isLoading}
                        currentPage={currentActivityPage}
                        totalPages={Math.ceil((totalActivities || 0) / activityLimit)}
                        onPageChange={(page) => fetchActivities(page, activityLimit)}
                    />
                </div>
                <div className={s.card}>
                    <h2 className={s.cardTitle}>Быстрые действия</h2>
                    <div className={s.actionsGrid}>
                        <Button variant="secondary" className={s.actionButton} onClick={() => setCurrentView('USERS')}>
                            Управление пользователями
                            <CiUser size={24} />
                        </Button>
                        <Button variant="secondary" className={s.actionButton} onClick={() => setCurrentView('SETTINGS')}>
                            Настройки системы
                            <CiSettings size={24} />
                        </Button>
                        <Button variant="secondary" className={s.actionButton} onClick={() => setIsAddBookModalOpen(true)}>
                            Добавить книгу
                            <CiCirclePlus size={24} />
                        </Button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isAddBookModalOpen}
                onClose={() => setIsAddBookModalOpen(false)}
                title="Добавить новую книгу"
                className={s.premiumModal}
            >
                <form className={s.bookForm} onSubmit={handleAddBook}>
                    {formError && <div className={s.error}>{formError}</div>}
                    <div className={s.formGroup}>
                        <label>Название *</label>
                        <input
                            required
                            value={newBookForm.title}
                            onChange={e => setNewBookForm({ ...newBookForm, title: e.target.value })}
                        />
                    </div>
                    <div className={s.formGrid}>
                        <div className={s.formGroup}>
                            <label>Автор</label>
                            <input
                                value={newBookForm.author}
                                onChange={e => setNewBookForm({ ...newBookForm, author: e.target.value })}
                            />
                        </div>
                        <div className={s.formGroup}>
                            <label>ISBN</label>
                            <input
                                value={newBookForm.isbn}
                                onChange={e => setNewBookForm({ ...newBookForm, isbn: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className={s.formGroup}>
                        <label>Категория *</label>
                        <select
                            required
                            value={newBookForm.category_id}
                            onChange={e => setNewBookForm({ ...newBookForm, category_id: e.target.value })}
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className={s.formGroup}>
                        <label>Описание</label>
                        <textarea
                            value={newBookForm.description}
                            onChange={e => setNewBookForm({ ...newBookForm, description: e.target.value })}
                        />
                    </div>
                    <div className={s.formGridWithPreview}>
                        <div className={s.coverPreview}>
                            {newBookForm.cover_image_url && (
                                <img
                                    src={newBookForm.cover_image_url}
                                    alt="Preview"
                                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x600?text=Invalid+URL')}
                                />
                            )}
                        </div>
                        <div className={s.formGroup} style={{ flex: 1, height: '100%', justifyContent: 'center' }}>
                            <label>Обложка (URL)</label>
                            <input
                                placeholder="https://example.com/image.jpg"
                                value={newBookForm.cover_image_url}
                                onChange={e => setNewBookForm({ ...newBookForm, cover_image_url: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className={s.formActions}>
                        <Button variant="secondary" type="button" onClick={() => setIsAddBookModalOpen(false)}>Отмена</Button>
                        <Button type="submit">Добавить книгу</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
