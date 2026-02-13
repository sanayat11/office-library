import { create } from 'zustand';
import { api } from '@/shared/api/client';
import { User, UserState, RegisterData } from './types';

export const useUserStore = create<UserState>((set, get) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const data = await api.post<{ access_token: string }>('/auth/login', formData);
            localStorage.setItem('token', data.access_token);

            const userProfile = await api.get<User>('/users/me');
            localStorage.setItem('user', JSON.stringify(userProfile));

            set({ user: userProfile, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
    },

    register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
            // Updated endpoint for user creation
            await api.post('/users/', {
                email: userData.email,
                full_name: userData.full_name,
                password: userData.password
            });

            // Auto login after successful registration
            const loginSuccess = await get().login(userData.email, userData.password);
            set({ isLoading: false });
            return loginSuccess;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    updateProfile: async (data: { full_name?: string; password?: string }) => {
        set({ isLoading: true, error: null });
        try {
            const updatedUser = await api.patch<User>('/users/me', data);
            set({ user: updatedUser, isLoading: false });
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return true;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
            await api.post('/auth/forgot-password', { email });
            set({ isLoading: false });
            return true;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    resetPassword: async (token: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
            await api.post('/auth/reset-password', { token, new_password: newPassword });
            set({ isLoading: false });
            return true;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const user = await api.get<User>('/users/me');
                set({ user, isAuthenticated: true });
                localStorage.setItem('user', JSON.stringify(user));
            } catch (error) {
                set({ user: null, isAuthenticated: false });
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        // Load wishlist from local storage regardless of auth (or maybe only if auth? Plan said client-side, let's do global for now or user-specific if we have ID. actually just simple local storage array 'wishlist')
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            set({ wishlist: JSON.parse(savedWishlist) });
        }
    },

    wishlist: [],

    toggleWishlist: (bookId: number) => {
        const { wishlist } = get();
        const isAdded = wishlist.includes(bookId);
        const newWishlist = isAdded
            ? wishlist.filter(id => id !== bookId)
            : [...wishlist, bookId];

        set({ wishlist: newWishlist });
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    }
}));
