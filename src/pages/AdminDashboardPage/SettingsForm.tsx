import React, { useState, useEffect } from 'react';
import { AdminSettings } from '@/shared/api/admin';
import { Button } from '@/shared/ui/Button/Button';
import s from './AdminDashboardPage.module.scss';

interface SettingsFormProps {
    settings: AdminSettings;
    onSave: (settings: AdminSettings) => Promise<boolean>;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ settings, onSave }) => {
    const [localSettings, setLocalSettings] = useState<AdminSettings>(settings);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        const success = await onSave(localSettings);
        setIsSaving(false);
        if (success) {
            setMessage({ text: 'Настройки успешно сохранены', type: 'success' });
            setTimeout(() => setMessage(null), 3000);
        } else {
            setMessage({ text: 'Ошибка при сохранении', type: 'error' });
        }
    };

    return (
        <div className={s.settingsForm}>
            <div className={s.settingSection}>
                <h3>Основные настройки</h3>
                <div className={s.settingItem}>
                    <div>
                        <label>Разрешить регистрацию</label>
                        <p>Пользователи могут создавать аккаунты самостоятельно</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={localSettings.allow_registration}
                        onChange={(e) => setLocalSettings({ ...localSettings, allow_registration: e.target.checked })}
                    />
                </div>
                <div className={s.settingItem}>
                    <div>
                        <label>Авто-одобрение</label>
                        <p>Новые аккаунты не требуют подтверждения админом</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={localSettings.auto_approve_users}
                        onChange={(e) => setLocalSettings({ ...localSettings, auto_approve_users: e.target.checked })}
                    />
                </div>
                <div className={s.settingItem}>
                    <div>
                        <label>Лимит книг</label>
                        <p>Максимальное кол-во книг на руках у пользователя</p>
                    </div>
                    <input
                        type="number"
                        value={localSettings.max_books_per_user}
                        onChange={(e) => setLocalSettings({ ...localSettings, max_books_per_user: parseInt(e.target.value) || 0 })}
                    />
                </div>
                <div className={s.settingItem}>
                    <div>
                        <label>Часы бронирования</label>
                        <p>Через сколько часов бронь сгорает автоматически</p>
                    </div>
                    <input
                        type="number"
                        value={localSettings.reservation_expiry_hours}
                        onChange={(e) => setLocalSettings({ ...localSettings, reservation_expiry_hours: parseInt(e.target.value) || 0 })}
                    />
                </div>
            </div>

            <div className={s.settingSection}>
                <h3>Правила выдачи и уведомления</h3>
                <div className={s.settingItem}>
                    <div>
                        <label>Срок возврата (дней)</label>
                        <p>Максимальный срок хранения книги (стандартно 30 дней)</p>
                    </div>
                    <input
                        type="number"
                        value={localSettings.borrowing_limit_days}
                        onChange={(e) => setLocalSettings({ ...localSettings, borrowing_limit_days: parseInt(e.target.value) || 0 })}
                    />
                </div>
                <div className={s.settingItem}>
                    <div>
                        <label>Первое напоминание (дней)</label>
                        <p>Напоминие пользователю о возврате (стандартно 14 дней)</p>
                    </div>
                    <input
                        type="number"
                        value={localSettings.reminder_1_days}
                        onChange={(e) => setLocalSettings({ ...localSettings, reminder_1_days: parseInt(e.target.value) || 0 })}
                    />
                </div>
                <div className={s.settingItem}>
                    <div>
                        <label>Второе напоминание (дней)</label>
                        <p>Предупреждение о просрочке (стандартно 28 дней)</p>
                    </div>
                    <input
                        type="number"
                        value={localSettings.reminder_2_days}
                        onChange={(e) => setLocalSettings({ ...localSettings, reminder_2_days: parseInt(e.target.value) || 0 })}
                    />
                </div>
            </div>

            <div className={s.formActions}>
                {message && <span className={message.type === 'success' ? s.successMsg : s.errorMsg}>{message.text}</span>}
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
            </div>
        </div>
    );
};
