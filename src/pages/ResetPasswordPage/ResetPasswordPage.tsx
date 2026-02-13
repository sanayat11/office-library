import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/entities/User/model/store';
import { Button } from '@/shared/ui/Button/Button';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import s from './ResetPasswordPage.module.scss';

import { validatePassword } from '@/shared/lib/validation';

export const ResetPasswordPage: React.FC = () => {
    const { resetPassword, isLoading } = useUserStore();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError('Неверная ссылка для сброса пароля.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) return;

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.message || "Неверный формат пароля");
            return;
        }

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        const result = await resetPassword(token, password);
        if (result) {
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setError('Не удалось сбросить пароль. Возможно, ссылка устарела.');
        }
    };

    if (!token) {
        return (
            <div className={s.page}>
                <div className={s.container}>
                    <div className={s.error}>Ошибка: Отсутствует токен сброса пароля.</div>
                    <Link to="/login" className={s.link}>Вернуться к входу</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={s.page}>
            <div className={s.container}>
                <h1 className={s.title}>Сброс пароля</h1>

                {success ? (
                    <div className={s.successContent}>
                        <div className={s.success}>Пароль успешно изменен!</div>
                        <p>Сейчас вы будете перенаправлены на страницу входа...</p>
                        <Button onClick={() => navigate('/login')}>Войти сейчас</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={s.form}>
                        <p className={s.subtitle}>Придумайте новый пароль</p>

                        <input
                            type="password"
                            placeholder="Новый пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={s.input}
                        />
                        <input
                            type="password"
                            placeholder="Подтвердите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={s.input}
                        />

                        {error && <div className={s.error}>{error}</div>}

                        <Button type="submit" isLoading={isLoading} disabled={isLoading || !token} style={{ width: '100%' }}>
                            Сохранить пароль
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};
