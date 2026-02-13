import React from 'react';
import { NavLink } from 'react-router-dom';
import { CiBookmark, CiHeart, CiUser, CiBoxList } from "react-icons/ci";
import { cn } from '@/shared/lib/classNames';
import s from './MobileNav.module.scss';
import { useUserStore } from '@/entities/User/model/store';

export const MobileNav: React.FC = () => {
    const { user } = useUserStore();

    return (
        <nav className={s.mobileNav}>
            <NavLink to="/" className={({ isActive }) => cn(s.navItem, isActive && s.active)}>
                <CiBookmark size={24} />
                <span>Каталог</span>
            </NavLink>

            {user && (
                <>
                    <NavLink to="/wishlist" className={({ isActive }) => cn(s.navItem, isActive && s.active)}>
                        <CiHeart size={24} />
                        <span>Избранное</span>
                    </NavLink>

                    <NavLink to="/my-books" className={({ isActive }) => cn(s.navItem, isActive && s.active)}>
                        <CiBoxList size={24} />
                        <span>Мои книги</span>
                    </NavLink>
                </>
            )}

            <NavLink to={user ? "/profile" : "/login"} className={({ isActive }) => cn(s.navItem, isActive && s.active)}>
                <CiUser size={24} />
                <span>{user ? 'Профиль' : 'Войти'}</span>
            </NavLink>

            {user?.role === 'ADMIN' && (
                <NavLink to="/admin" className={({ isActive }) => cn(s.navItem, isActive && s.active)}>
                    <CiBoxList size={24} />
                    <span>Админ</span>
                </NavLink>
            )}
        </nav>
    );
};
