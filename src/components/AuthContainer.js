import React from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePages from '../pages/HomePages';
// import Profile from '../pages/Profile';
// import Editor from '../pages/Editor';
// import BlogDetails from './BlogDetails';
// import YourProfile from '../pages/YourProfile';
// import EditAritcle from '../pages/EditAritcle';


const AuthContainer = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePages />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* <Route path="/yourprofile" element={< YourProfile />} />
                <Route path="/edit" element={< Editor />} />
                <Route path="/articles/:slug" element={<BlogDetails />} />
                <Route path="/profiles/:username" element={< Profile />} />
                <Route path="/articlesedit/:slug" element={<EditAritcle />} /> */}
            </Routes>
        </Router>
    );
};

export default AuthContainer;