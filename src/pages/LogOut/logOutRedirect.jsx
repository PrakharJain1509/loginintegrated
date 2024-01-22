// Logout.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './logOutRedirect.css';

const LogoutPage = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(2); // Set the countdown time in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            if (countdown > 0) {
                setCountdown((prev) => prev - 1);
            } else {
                clearInterval(timer);
                // Redirect to home after the countdown
                navigate('/');
            }
        }, 1000);

        // Cleanup the interval on component unmount
        return () => clearInterval(timer);
    }, [countdown, history]);

    return (
        <div className="logout-container">
            <div className="logout-content">
                <h2>You have been logged out</h2>
                <p>Redirecting to the home page in {countdown} seconds...</p>
            </div>
        </div>
    );
};

export default LogoutPage;