import {React, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home/home';
import LogoutPage from '../pages/LogOut/logOutRedirect';
import SignUp from '../pages/SignUp/signUp';
import ChatApp from '../chatApp/chatApp';
import Login from '../Login/login';
import ChatRoom from '../chatApp/chatRoom';
import Omegle from '../omegle/omegle';
import LoadingPage from '../omegle/loadingPage';

const MainApp = () => {


    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/logOutPage" element={<LogoutPage/>} />
                <Route path="/SignUpForm" element={<SignUp />} />
                <Route path="/chatRoom" element={<ChatRoom />} />
                <Route path="/chatApp" element={<ChatApp />} />
                <Route path="/randomChat" element={<Omegle />} />
                <Route path="/startRandomChat" element={<LoadingPage />} />
            </Routes>
        </Router>
    );
};

export default MainApp;