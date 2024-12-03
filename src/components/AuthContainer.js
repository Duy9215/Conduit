import React from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePages from '../pages/HomePages';
import Editor from '../pages/Editor';
import BlogDetails from './BlogDetails';
import Profile from './Profile';

const AuthContainer = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePages />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/edit" element={< Editor />} />
                <Route path="/profiles/:username" element={< Profile />} />
                <Route path="/articles/:slug" element={<BlogDetails />} />
            </Routes>
        </Router>
    );
};

export default AuthContainer;