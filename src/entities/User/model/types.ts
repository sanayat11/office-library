export interface User {
    id: number;
    email: string;
    full_name: string;
    role: 'USER' | 'ADMIN';
    avatar?: string;
    is_approved: boolean;
}


export interface WishlistItem {
    id: number;
    user_id: number;
    book_id: number;
    added_at: string;
}

export interface RegisterData {
    email: string;
    full_name: string;
    password: string;
}

export interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    wishlist: number[]; // Store book IDs locally
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (data: RegisterData) => Promise<boolean>;
    updateProfile: (data: { full_name?: string; password?: string }) => Promise<boolean>;
    forgotPassword: (email: string) => Promise<boolean>;
    resetPassword: (token: string, newPassword: string) => Promise<boolean>;
    checkAuth: () => Promise<void>;
    toggleWishlist: (bookId: number) => void;
}
