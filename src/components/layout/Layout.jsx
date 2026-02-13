import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>
            <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
                © 2026 Office Library System. All rights reserved.
            </footer>
        </div>
    );
};
export default Layout;
