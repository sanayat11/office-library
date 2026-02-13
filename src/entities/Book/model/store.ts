import { create } from 'zustand';
import { api } from '@/shared/api/client';
import { Book, BookState, Category, Review } from './types';

export const useBookStore = create<BookState>((set, get) => ({
    books: [],
    categories: [],
    isLoading: false,
    error: null,
    filters: {
        search: '',
        category: null,
    },
    page: 0,
    hasMore: true,
    itemsPerPage: 12,

    fetchBooks: async (append = false) => {
        if (!append) set({ page: 0, hasMore: true });

        set({ isLoading: true });
        try {
            const { filters, page, itemsPerPage, books: currentBooks } = get();
            const currentPage = append ? page : 0;

            const params: Record<string, any> = {
                skip: currentPage * itemsPerPage,
                limit: itemsPerPage
            };

            if (filters.search) params.search = filters.search;
            if (filters.category) params.category_id = filters.category;

            const data = await api.get<Book[]>('/books/', params);

            set({
                books: append ? [...currentBooks, ...data] : data,
                isLoading: false,
                hasMore: data.length === itemsPerPage,
                page: currentPage
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    loadMore: async () => {
        const { isLoading, hasMore, page } = get();
        if (isLoading || !hasMore) return;

        set({ page: page + 1 });
        await get().fetchBooks(true);
    },

    fetchCategories: async () => {
        try {
            const data = await api.get<Category[]>('/categories/');
            set({ categories: data });
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    },

    setFilter: (key, value) => {
        set((state) => ({
            filters: { ...state.filters, [key]: value },
            page: 0,
            hasMore: true
        }));
        get().fetchBooks(false);
    },

    reserveBook: async (bookId: number) => {
        try {
            await api.post('/bookings/reserve', { book_id: bookId });
            await get().fetchBooks();
            return true;
        } catch (error) {
            throw error;
        }
    },

    reviews: [],

    fetchReviews: async (bookId: number) => {
        try {
            const data = await api.get<Review[]>(`/reviews/book/${bookId}`);
            set({ reviews: data });
        } catch (error) {
            console.error("Failed to fetch reviews", error);
            set({ reviews: [] });
        }
    },

    addReview: async (bookId: number, rating: number, comment: string) => {
        try {
            await api.post('/reviews/', { book_id: bookId, rating, comment });
            await get().fetchReviews(bookId);
            await get().fetchBooks(); // Refresh book rating
        } catch (error) {
            console.error("Failed to add review", error);
            throw error;
        }
    },

    addBook: async (data, coverImage) => {
        try {
            const formData = new FormData();

            // Append metadata fields to FormData
            Object.entries(data).forEach(([key, value]) => {
                // IMPORTANT: skip empty strings for unique fields like ISBN
                if (value !== undefined && value !== null && value !== '') {
                    formData.append(key, String(value));
                }
            });

            if (coverImage) {
                formData.append('cover_image', coverImage);
            }

            await api.post('/books/', formData);
            await get().fetchBooks();
            return true;
        } catch (error: any) {
            console.error("Failed to add book", error);
            throw error; // Rethrow so UI can catch and display it
        }
    },

    updateBook: async (bookId, data, coverImage) => {
        try {
            const formData = new FormData();

            // Append metadata fields to FormData
            Object.entries(data).forEach(([key, value]) => {
                // Skip empty strings to avoid unique constraint violations on ISBN
                if (value !== undefined && value !== null && key !== 'id' && value !== '') {
                    formData.append(key, String(value));
                }
            });

            if (coverImage) {
                formData.append('cover_image', coverImage);
            }

            await api.put(`/books/${bookId}`, formData);
            await get().fetchBooks();
            return true;
        } catch (error: any) {
            console.error("Failed to update book", error);
            throw error;
        }
    },

    deleteBook: async (bookId) => {
        try {
            await api.delete(`/books/${bookId}`);
            await get().fetchBooks();
            return true;
        } catch (error) {
            console.error("Failed to delete book", error);
            return false;
        }
    }
}));
