import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import BookCatalog from '../pages/BookCatalog';
import BookDetails from '../pages/BookDetails';
import MyBooks from '../pages/MyBooks';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<BookCatalog />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/my-books" element={<MyBooks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
