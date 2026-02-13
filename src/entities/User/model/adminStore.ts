import { create } from 'zustand';
import { adminApi, AdminStats, ActivityItem, AdminSettings } from '@/shared/api/admin';

interface AdminState {
    stats: AdminStats | null;
    activities: ActivityItem[];
    settings: AdminSettings | null;
    users: any[];
    isLoading: boolean;
    error: string | null;

    fetchDashboard: () => Promise<void>;
    fetchSettings: () => Promise<void>;
    updateSettings: (settings: AdminSettings) => Promise<boolean>;
    fetchUsers: () => Promise<void>;
    fetchPendingUsers: () => Promise<void>;
    approveUser: (userId: number) => Promise<void>;
    rejectUser: (userId: number) => Promise<void>;

    // Pagination
    currentActivityPage: number;
    activityLimit: number;
    totalActivities: number;
    fetchActivities: (page: number, limit: number) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
    stats: null,
    activities: [],
    settings: null,
    users: [],
    isLoading: false,
    error: null,
    currentActivityPage: 1,
    activityLimit: 5,
    totalActivities: 0,

    fetchDashboard: async () => {
        set({ isLoading: true });
        try {
            const data = await adminApi.getDashboard();
            set({
                stats: data.stats,
            });
            // Initial fetch of activities with meta
            await get().fetchActivities(1, 5);
            set({ isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchActivities: async (page: number, limit: number) => {
        // Optional: set loading only if not already loading via dashboard
        // set({ isLoading: true }); 
        try {
            const skip = (page - 1) * limit;
            const data = await adminApi.getActivities(skip, limit);
            set({
                activities: data.items,
                totalActivities: data.total,
                currentActivityPage: page,
                activityLimit: limit
            });
        } catch (error: any) {
            console.error("Failed to fetch activities", error);
            set({ error: "Не удалось загрузить историю активности" });
        }
    },

    fetchSettings: async () => {
        try {
            const settings = await adminApi.getSettings();
            set({ settings });
        } catch (error: any) {
            console.error("Failed to fetch settings", error);
        }
    },

    updateSettings: async (settings: AdminSettings) => {
        try {
            const updated = await adminApi.updateSettings(settings);
            set({ settings: updated });
            return true;
        } catch (error: any) {
            console.error("Failed to update settings", error);
            return false;
        }
    },

    fetchUsers: async () => {
        try {
            const users = await adminApi.getUsers();
            set({ users });
        } catch (error: any) {
            console.error("Failed to fetch users", error);
        }
    },

    fetchPendingUsers: async () => {
        try {
            const users = await adminApi.getPendingUsers();
            set({ users }); // Reuse users array for the view
        } catch (error: any) {
            console.error("Failed to fetch pending users", error);
        }
    },

    approveUser: async (userId: number) => {
        try {
            await adminApi.approveUser(userId);
            await get().fetchUsers();
        } catch (error: any) {
            console.error("Failed to approve user", error);
        }
    },

    rejectUser: async (userId: number) => {
        try {
            await adminApi.rejectUser(userId);
            await get().fetchUsers();
        } catch (error: any) {
            console.error("Failed to reject user", error);
        }
    }
}));
