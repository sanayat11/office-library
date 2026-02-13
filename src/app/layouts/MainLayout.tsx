import { Header } from '@/widgets/Header/Header';
import { MobileNav } from '@/widgets/MobileNav/MobileNav';
import { ScrollToTopButton } from '@/shared/ui/ScrollToTopButton/ScrollToTopButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import s from './MainLayout.module.scss';

export const MainLayout: React.FC = () => {
    const location = useLocation();

    return (
        <div className={s.layout}>
            <div className="noise-overlay" />
            <div className={s.mainWrapper}>
                <Header />
                <main className={s.main}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // smooth ease-out
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
                <ScrollToTopButton />
                <MobileNav />
            </div>
        </div>
    );
};
