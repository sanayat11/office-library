import React, { useState } from 'react';
import { useUserStore } from '@/entities/User/model/store';
import { Button } from '@/shared/ui/Button/Button';
import { Link } from 'react-router-dom';
import { ThemeSwitcher } from '@/shared/ui/ThemeSwitcher/ThemeSwitcher';
import s from './ForgotPasswordPage.module.scss';

export const ForgotPasswordPage: React.FC = () => {
    const { forgotPassword, isLoading } = useUserStore();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!email) {
            setError('Введите email');
            return;
        }

        const success = await forgotPassword(email);
        if (success) {
            setMessage('Если этот email зарегистрирован, мы отправим на него инструкции по сбросу пароля.');
        } else {
            setError('Произошла ошибка. Попробуйте позже.');
        }
    };

    return (
        <div className={s.page}>
            <ThemeSwitcher className={s.themeSwitcher} />
            <div className={s.container}>
                <h1 className={s.title}>Забыли пароль?</h1>
                <p className={s.subtitle}>Введите ваш email, чтобы сбросить пароль</p>

                <form onSubmit={handleSubmit} className={s.form}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={s.input}
                    />

                    {error && <div className={s.error}>{error}</div>}
                    {message && <div className={s.success}>{message}</div>}

                    <Button type="submit" isLoading={isLoading} disabled={isLoading} style={{ width: '100%' }}>
                        Отправить
                    </Button>
                </form>

                <div className={s.footer}>
                    <Link to="/login" className={s.link}>Вернуться к входу</Link>
                </div>
            </div>
        </div>
    );
};
