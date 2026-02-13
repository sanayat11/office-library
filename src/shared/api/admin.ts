import { api } from './client';

export interface AdminStats {
    total_users: number;
    total_books: number;
    total_active_bookings: number;
    overdue_books: number;
}

export interface ActivityItem {
    type: string;
    user_name: string;
    action: string;
    target: string;
    created_at: string;
}

export interface AdminDashboardData {
    stats: AdminStats;
    recent_activity: ActivityItem[];
}

export interface AdminSettings {
    allow_registration: boolean;
    auto_approve_users: boolean;
    max_books_per_user: number;
    reservation_expiry_hours: number;
    borrowing_limit_days: number;
    reminder_1_days: number;
    reminder_2_days: number;
}

export interface ActivityLogResponse {
    items: ActivityItem[];
    total: number;
    page: number;
    size: number;
}

export const adminApi = {
    getDashboard: () => api.get<AdminDashboardData>('/admin/dashboard'),
    getActivities: (skip: number, limit: number) => api.get<ActivityLogResponse>(`/admin/activities?skip=${skip}&limit=${limit}`),
    getSettings: () => api.get<AdminSettings>('/admin/settings'),
    updateSettings: (settings: AdminSettings) => api.post<AdminSettings>('/admin/settings', settings),
    getUsers: () => api.get<any[]>('/users/'),
    getPendingUsers: () => api.get<any[]>('/admin/users/pending'),
    approveUser: (userId: number) => api.post(`/admin/users/${userId}/approve`, {}),
    rejectUser: (userId: number, reason: string = 'Registration rejected by admin') =>
        api.post(`/admin/users/${userId}/reject?reason=${encodeURIComponent(reason)}`, {}),
};
