import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePages from '../pages/HomePages';
import Login from '../pages/Login';


const AuthContainer = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePages />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default AuthContainer;