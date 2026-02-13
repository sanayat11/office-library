import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {  CiLogout, CiUser } from "react-icons/ci";
import { Button } from '@/shared/ui/Button/Button';
import { useUserStore } from '@/entities/User/model/store';
import { cn } from '@/shared/lib/classNames';
import s from './Header.module.scss';
import { ThemeSwitcher } from '@/shared/ui/ThemeSwitcher/ThemeSwitcher';
import { Modal } from '@/shared/ui/Modal/Modal';

export const Header: React.FC = () => {
    const { user, logout } = useUserStore();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        setIsLogoutModalOpen(false);
    };

    return (
        <header className={s.header}>
            <Link to="/" className={s.logo}>
                <span className={s.logoText}>
                    <span className={s.starlab}>Starlab</span> IT Library
                </span>
            </Link>

            <nav className={s.nav}>
                <NavLink to="/" className={({ isActive }) => cn(s.link, isActive && s.active)}>
                    Каталог
                </NavLink>
                {user && (
                    <>
                        <NavLink to="/my-books" className={({ isActive }) => cn(s.link, isActive && s.active)}>
                            Мои книги
                        </NavLink>
                        <NavLink to="/wishlist" className={({ isActive }) => cn(s.link, isActive && s.active)}>
                            Избранное
                        </NavLink>
                        {user.role === 'ADMIN' && (
                            <NavLink to="/admin" className={({ isActive }) => cn(s.link, isActive && s.active)}>
                                Админ
                            </NavLink>
                        )}
                    </>
                )}
            </nav>

            <div className={s.actions}>
                <ThemeSwitcher />
                {user ? (
                    <div className={s.authGroup}>
                        <Link to="/profile" className={s.userProfile}>
                            <div className={s.userInfo}>
                                <span className={s.userName}>{user.full_name}</span>
                                <span className={s.userRole}>{user.role}</span>
                            </div>
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.full_name} className={s.avatar} />
                            ) : (
                                <div className={s.avatar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CiUser size={24} />
                                </div>
                            )}
                        </Link>
                        <Button
                            variant="ghost"
                            onClick={() => setIsLogoutModalOpen(true)}
                            title="Выйти"
                            style={{ padding: '0.625rem', borderRadius: '0.875rem' }}
                        >
                            <CiLogout size={24} />
                        </Button>
                    </div>
                ) : (
                    <Link to="/login">
                        <Button style={{ padding: '0.625rem 1.75rem' }}>Войти</Button>
                    </Link>
                )}
            </div>

            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                title="Выход из системы"
                className={s.logoutModal}
            >
                <div style={{ textAlign: 'center' }}>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                        Вы уверены, что хотите выйти из аккаунта?
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Button variant="secondary" onClick={() => setIsLogoutModalOpen(false)} style={{ width: '100%' }}>
                            Отмена
                        </Button>
                        <Button variant="danger" onClick={handleLogout} style={{ width: '100%' }}>
                            Выйти
                        </Button>
                    </div>
                </div>
            </Modal>
        </header >
    );
};
