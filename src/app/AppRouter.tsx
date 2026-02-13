import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/app/layouts/MainLayout';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage/AdminDashboardPage';
import { RegisterPage } from '@/pages/RegisterPage/RegisterPage';
import { BookCatalogPage } from '@/pages/BookCatalogPage/BookCatalogPage';
import { MyBooksPage } from '@/pages/MyBooksPage/MyBooksPage';
import { ProfilePage } from '@/pages/ProfilePage/ProfilePage';
import { WishlistPage } from '@/pages/WishlistPage/WishlistPage';
import { BookDetailsPage } from '@/pages/BookDetailsPage/BookDetailsPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage/ResetPasswordPage';
import { useUserStore } from '@/entities/User/model/store';

import { ScrollToTop } from '@/shared/lib/ScrollToTop';

export const AppRouter: React.FC = () => {
    const { checkAuth } = useUserStore();

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route element={<MainLayout />}>
                    <Route path="/" element={<BookCatalogPage />} />
                    <Route path="/my-books" element={<MyBooksPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/books/:id" element={<BookDetailsPage />} />
                    <Route path="/admin" element={<AdminDashboardPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
