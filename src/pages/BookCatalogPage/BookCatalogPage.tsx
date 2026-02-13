import React, { useEffect, useState, useRef } from 'react';
import { useBookStore } from '@/entities/Book/model/store';
import { BookCard } from '@/entities/Book/ui/BookCard/BookCard';
import { Input } from '@/shared/ui/Input/Input';
import { CiSearch, CiGrid42 } from 'react-icons/ci';
import s from './BookCatalogPage.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/classNames';

export const BookCatalogPage: React.FC = () => {
    const {
        books,
        categories,
        isLoading,
        hasMore,
        fetchBooks,
        fetchCategories,
        setFilter,
        loadMore,
        filters
    } = useBookStore();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchBooks(false);
        fetchCategories();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, isLoading, loadMore]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter('search', e.target.value);
    };

    const handleCategoryClick = (id: number | null) => {
        setFilter('category', id);
        setIsDropdownOpen(false);
    };

    const selectedCategoryName = categories?.find(c => c.id === filters.category)?.name || 'Все категории';

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className={s.page}>
            <header className={s.header}>
                <div className={s.headerContent}>
                    <h1 className={s.title}>
                        Каталог книг
                    </h1>
                    <p className={s.subtitle}>
                        Офисная библиотека для удобного поиска и бронирования книг.
                    </p>
                </div>

                <div className={s.filtersContainer}>
                    <div className={s.categoryDropdown} ref={dropdownRef}>
                        <button
                            className={s.categoryTrigger}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <CiGrid42 size={24} color="var(--primary-color)" />
                            <span>{selectedCategoryName}</span>
                            <div className={cn(s.arrow, isDropdownOpen && s.open)} />
                        </button>

                        {isDropdownOpen && (
                            <div className={s.dropdown}>
                                <div
                                    className={cn(s.item, !filters.category && s.active)}
                                    onClick={() => handleCategoryClick(null)}
                                >
                                    Все категории
                                </div>
                                {categories?.map(cat => (
                                    <div
                                        key={cat.id}
                                        className={cn(s.item, filters.category === cat.id && s.active)}
                                        onClick={() => handleCategoryClick(cat.id)}
                                    >
                                        {cat.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={s.search}>
                        <CiSearch size={24} className={s.searchIcon} />
                        <Input
                            placeholder="Поиск по названию или автору..."
                            className={s.searchInput}
                            value={filters.search}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </header>

            {isLoading && books.length === 0 ? (
                <div className={s.loading}>
                    <div className={s.spinner} />
                    <p>Поиск лучших книг для вас...</p>
                </div>
            ) : books.length > 0 ? (
                <>
                    <motion.div
                        className={s.grid}
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        <AnimatePresence mode="popLayout">
                            {books.map(book => (
                                <motion.div
                                    key={book.id}
                                    variants={item}
                                    layout
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 30
                                    }}
                                >
                                    <BookCard book={book} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Intersection Observer Target */}
                    <div ref={observerTarget} className={s.sentinel}>
                        {isLoading && hasMore && (
                            <div className={s.loadMoreSpinner}>
                                <div className={s.miniSpinner} />
                                <span>Загрузка еще...</span>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className={s.empty}>
                    <h3>Книги не найдены</h3>
                    <p>Попробуйте изменить параметры поиска или категорию</p>
                </div>
            )}
        </div>
    );
};
