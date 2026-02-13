export interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    description: string;
    category_id: number;
    status: 'AVAILABLE' | 'BORROWED' | 'RESERVED';
    rating: number;
    cover_image_url?: string;
    is_deleted?: boolean;
    created_at: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface Review {
    id: number;
    book_id: number;
    user_id: number;
    rating: number;
    comment: string;
    created_at: string;
    user?: {
        full_name: string;
        avatar?: string;
    };
}

export interface BookFilters {
    search: string;
    category: number | null;
}

export interface BookState {
    books: Book[];
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    filters: BookFilters;
    page: number;
    hasMore: boolean;
    itemsPerPage: number;
    fetchBooks: (append?: boolean) => Promise<void>;
    loadMore: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    setFilter: (key: keyof BookFilters, value: any) => void;
    reserveBook: (bookId: number) => Promise<boolean>;
    reviews: Review[];
    fetchReviews: (bookId: number) => Promise<void>;
    addReview: (bookId: number, rating: number, comment: string) => Promise<void>;
    addBook: (data: Partial<Book>, coverImage?: File) => Promise<boolean>;
    updateBook: (bookId: number, data: Partial<Book>, coverImage?: File) => Promise<boolean>;
    deleteBook: (bookId: number) => Promise<boolean>;
}
