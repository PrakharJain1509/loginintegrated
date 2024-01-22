import React from 'react';

const SplashScreen = () => {
    const splashScreenStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const videoStyle = {
        width: '100%', // Use 100% width to adapt to the screen width
        height: 'auto', // Let the height adjust proportionally
    };

    return (
        <div style={splashScreenStyle}>
            <video autoPlay muted loop style={videoStyle}>
                <source src="/videos/splash.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default SplashScreen;
