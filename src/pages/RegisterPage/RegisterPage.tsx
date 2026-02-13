import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CiCircleCheck, CiClock1, CiCircleChevRight } from "react-icons/ci";
import { useUserStore } from '@/entities/User/model/store';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import { cn } from '@/shared/lib/classNames';
import s from './RegisterPage.module.scss';
import { Modal } from '@/shared/ui/Modal/Modal';

import { validatePassword } from '@/shared/lib/validation';

export const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { register, isLoading, error } = useUserStore();
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            setErrorMessage(passwordValidation.message || "Неверный формат пароля");
            setShowErrorModal(true);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Пароли не совпадают");
            setShowErrorModal(true);
            return;
        }

        const success = await register({
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name
        });

        if (success) setIsSuccess(true);
    };

    if (isSuccess) {
        return (
            <div className={s.page}>
                <AnimatePresence>
                    <motion.div
                        className={cn(s.card, s.successCard)}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <div className={s.successContent}>
                            <motion.div
                                className={s.iconWrapper}
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                            >
                                <div className={s.pulseCircle}></div>
                                <CiCircleCheck className={s.successIcon} size={64} />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className={s.textBlock}
                            >
                                <h1 className={s.title}>Почти готово!</h1>
                                <div className={s.statusBadge}>
                                    <CiClock1 size={16} />
                                    <span>Ожидание одобрения</span>
                                </div>
                            </motion.div>

                            <motion.p
                                className={s.successDescription}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                Ваша заявка успешно отправлена. Админ рассмотрит её в ближайшее время.
                                <br />
                                <strong>Мы сообщим вам, когда доступ будет открыт.</strong>
                            </motion.p>

                            <motion.div
                                className={s.successActions}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <Button onClick={() => navigate('/login')} className={s.loginBtn}>
                                    <span>Вернуться к входу</span>
                                    <CiCircleChevRight size={22} />
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className={s.page}>
            <div className={s.card}>
                <div>
                    <h1 className={s.title}>Создать аккаунт</h1>
                    <p className={s.subtitle}>Присоединяйтесь к нашей библиотеке</p>
                </div>

                <form onSubmit={handleSubmit} className={s.form}>
                    {error && <div className={s.error}>{error}</div>}

                    <Input
                        label="Полное имя"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Иван Иванов"
                        required
                    />

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                    />

                    <Input
                        label="Пароль"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />

                    <Input
                        label="Подтвердите пароль"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />

                    <Button type="submit" isLoading={isLoading} style={{ width: '100%', padding: '0.875rem' }}>
                        Зарегистрироваться
                    </Button>
                </form>

                <p className={s.footer}>
                    Уже есть аккаунт? <Link to="/login" className={s.link}>Войти</Link>
                </p>
            </div>

            <Modal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title="Ошибка регистрации"
            >
                <div style={{ textAlign: 'center' }}>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>{errorMessage}</p>
                    <Button onClick={() => setShowErrorModal(false)} style={{ width: '100%' }}>
                        Понятно
                    </Button>
                </div>
            </Modal>
        </div>
    );
};
