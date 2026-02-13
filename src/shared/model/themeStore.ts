import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    initTheme: () => void;
}

const getSystemTheme = (): Theme => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'light', // Default, will be overridden by persist or init

            setTheme: (theme) => {
                set({ theme });
                document.documentElement.setAttribute('data-theme', theme);
                document.documentElement.className = theme; // Optional: double binding
            },

            toggleTheme: () => {
                const newTheme = get().theme === 'light' ? 'dark' : 'light';
                get().setTheme(newTheme);
            },

            initTheme: () => {
                // This function should be called on app mount
                // Persist middleware handles localStorage, but we need to handle "first visit" system pref logic
                // If localStorage is empty, persist won't have set anything yet (or will use default).
                // Actually, persist handles hydration.
                // We'll trust persist for storage, but if storage is empty, we might want system.
                // However, zustand persist usually hydrates immediately.

                const storedTheme = localStorage.getItem('theme-storage');
                if (!storedTheme) {
                    const systemTheme = getSystemTheme();
                    get().setTheme(systemTheme);
                } else {
                    // Re-apply the stored theme to the DOM
                    document.documentElement.setAttribute('data-theme', get().theme);
                }
            }
        }),
        {
            name: 'theme-storage', // name of the item in the storage (must be unique)
            onRehydrateStorage: () => (state) => {
                // When storage is rehydrated, apply the theme to DOM
                if (state) {
                    document.documentElement.setAttribute('data-theme', state.theme);
                }
            }
        }
    )
);
