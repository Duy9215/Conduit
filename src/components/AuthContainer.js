import React from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePages from '../pages/HomePages';
import AddAriticles from '../pages/AddArticles'
import BlogDetails from './BlogDetails';
import Profile from '../pages/Profile';
import YourProfile from '../pages/YourProfile';

const AuthContainer = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePages />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/addArticles" element={< AddAriticles />} />
                <Route path="/profiles/:username" element={< Profile />} />
                <Route path="/profiles/:username" element={<Profile />} />
                <Route path="/articles/:slug" element={<BlogDetails />} />
                <Route path="/yourprofile" element={< YourProfile />} />
            </Routes>
        </Router>
    );
};

export default AuthContainer;