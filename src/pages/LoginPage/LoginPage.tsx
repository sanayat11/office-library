import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/entities/User/model/store';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import s from './LoginPage.module.scss';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('user@example.com');
    const [password, setPassword] = useState('password');
    const { login, isLoading, error } = useUserStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) navigate('/');
    };

    return (
        <div className={s.page}>
            <div className={s.card}>
                <div>
                    <h1 className={s.title}>С возвращением</h1>
                    <p className={s.subtitle}>Войдите в свою учетную запись</p>
                </div>

                <form onSubmit={handleSubmit} className={s.form}>
                    {error && <div className={s.error}>{error}</div>}

                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                    />

                    <Input
                        label="Пароль"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                        <Link to="/forgot-password" className={s.link} style={{ fontSize: '0.875rem' }}>Забыли пароль?</Link>
                    </div>

                    <Button type="submit" isLoading={isLoading} style={{ width: '100%', padding: '0.875rem' }}>
                        Войти
                    </Button>
                </form>

                <p className={s.footer}>
                    Нет аккаунта? <Link to="/register" className={s.link}>Зарегистрироваться</Link>
                </p>
            </div>
        </div>
    );
};
