import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import pushUidToMainDB from '../config/Functions/pushUidToMainDB';
import getUserFromEmail from '../config/Functions/getUserFromEmail';
import getTokenFromEmail from '../config/Functions/getTokenFromEmail';
import getUserGroups from '../config/Functions/userGroups';
import { useNavigate } from 'react-router-dom';
import './static/styles.css';

const LoginForm = ({ setIsAuthenticated, switchToDashboard, switchToSignUp }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            // Check if the user is authenticated and the token is present
            const token = localStorage.getItem('token');
            if (user && token) {
                setIsAuthenticated(true);
                switchToDashboard();
            }
        });

        return () => {
            unsubscribe();
        };
    }, [setIsAuthenticated, switchToDashboard]);

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if the user already exists
            const existingUser = await getUserFromEmail(user.email);

            if (existingUser === "AAz7ytCq1Y2CFow9FaQDTwaDmkeNAE85") {
                await signOut(auth);
                console.log('User not found. Redirecting to SignUpForm.');
                // Redirect to SignUp page if the user is not found
                switchToSignUp();
            } else {
                console.log('User already exists in the database.');
                await fetchTokenFollowedByGroups(user);
            }
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    async function fetchTokenFollowedByGroups(user) {
        try {
            await getTokenFromEmail(user.email, user.uid);
            getUserGroups();
            setIsAuthenticated(true);
            switchToDashboard();
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    return (
        <>
            <div className="login-container">
                {user ? (
                    (() => {
                        const accessToken = localStorage.getItem('token');
                        if (accessToken) {
                            // Token is present, set isAuthenticated to true and redirect to dashboard
                            setIsAuthenticated(true);
                            switchToDashboard();
                        } else {
                            // Token is not present, display user details and log out button
                            return (
                                <>
                                    {/* Add the option to sign up with Google */}
                                    <button onClick={signInWithGoogle}>Sign Up with Google</button>
                                </>
                            );
                        }
                    })()
                ) : (
                    // User is not logged in, display sign in with Google button
                    <button onClick={signInWithGoogle}>Sign In with Google</button>
                )}
            </div>
        </>
    );
};

export default LoginForm;
