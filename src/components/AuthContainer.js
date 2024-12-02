import React from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePages from '../pages/HomePages';
import BlogDetails from './BlogDetails';

const AuthContainer = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePages />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/articles/:slug" element={<BlogDetails />} />
            </Routes>
        </Router>
    );
};

export default AuthContainer;