import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './signUp.css';
import { createUserWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import pushUidToMainDB from '../../config/Functions/pushUidToMainDB';
import getTokenFromEmail from '../../config/Functions/getTokenFromEmail';
import getUserFromEmail from '../../config/Functions/getUserFromEmail';
import getUserGroups from '../../config/Functions/userGroups';


const choices = [
    { value: 'CSE', label: 'Computer Science and Engineering' },
    { value: 'CSE_DS', label: 'Computer Science and Engineering (Data Science)' },
    { value: 'CSE_CS', label: 'Computer Science and Engineering (Cyber Security)' },
    { value: 'ISE', label: 'Information Science and Engineering' },
    { value: 'EE', label: 'Electrical Engineering' },
    { value: 'ME', label: 'Mechanical Engineering' },
    { value: 'TE', label: 'Telecommunication Engineering' },
    { value: 'IEM', label: 'Industrial Engineering and Management' },
    { value: 'AIML', label: 'Artificial Intelligence and Machine Learning' },
    { value: 'AE', label: 'Aerospace Engineering' },
    { value: 'MCA', label: 'Masters of Computer Applications' },
    { value: 'ECE', label: 'Electronics and Telecommunication Engineering' },
    { value: 'EIE', label: 'Electronics and Instrumentation Engineering' },
    { value: 'EEE', label: 'Electrical and Electronics Engineering' },
    { value: 'CE', label: 'Chemical Engineering' },
    { value: 'CV', label: 'Civil Engineering' },
    { value: 'BT', label: 'Biotechnology' },
    { value: 'RV-University', label: 'RVU' },
];

const collegeChoices = [
    { value: 'RVCE', label: 'R.V. College of Engineering' },
    { value: 'RVU', label: 'R.V. University' },
]

const SignUp = ({ switchToDashboard }) => {
    const navigate = useNavigate();
    const [selectedChoice, setSelectedChoice] = useState('');
    const [selectedCollege, setSelectedCollege] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleBioCHange = (event) => {
        setBio(event.target.value);
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleChoiceChange = (event) => {
        setSelectedChoice(event.target.value);
    };

    const handleCollegeChange = (event) => {
        setSelectedCollege(event.target.value);
    };


    const [user, setUser] = useState('');

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        setUser(result.user);
    }

    async function fetchSignUpData(username, firstName, lastName, user) {
        try {
            // Make sure to use 'await' for the fetch call
            const userCreationResponse = await fetch(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "username": username,
                    "email": auth.currentUser.email,
                    "first_name": firstName,
                    "last_name": lastName,
                    "password": user.uid
                }),
            });

            // Make sure to await the result of getUserFromEmail
            const response = await getUserFromEmail(auth.currentUser.email);

            localStorage.setItem('signUpUserDetails', JSON.stringify(response));

            // Check if the userCreationResponse is okay before proceeding
            if (userCreationResponse.ok) {
                await getTokenFromEmail(auth.currentUser.email, auth.currentUser.uid);
                await pushUidToMainDB(auth.currentUser.email, auth.currentUser.uid, selectedChoice, selectedCollege, bio, auth.currentUser.photoURL);
                await getUserGroups();
                switchToDashboard();
            } else {
                console.error('Failed to create user:', userCreationResponse);
            }

        } catch (error) {
            console.error("An error occurred:", error);
        }
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(auth.currentUser);

        try {
            await fetchSignUpData(username, firstName, lastName, user);

            // let userDetailsResponse = await getUserFromEmail(auth.currentUser.email);
            // localStorage.setItem('userDetails', JSON.stringify(userDetailsResponse));

            navigate('/');
        } catch (error) {
            console.error("An error occurred during submission:", error);
        }
    };

    const form = (
        <div className="mainForm">
            <div className="branchChoice">
                <form>
                    <label>
                        Select your choice:
                        <select value={selectedChoice} onChange={handleChoiceChange}>
                            <option value="" disabled>
                                Choose an option
                            </option>
                            {choices.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </form>
            </div>

            <div className="collegeChoice">
                <form>
                    <label>
                        Select your choice:
                        <select value={selectedCollege} onChange={handleCollegeChange}>
                            <option value="" disabled>
                                Choose an option
                            </option>
                            {collegeChoices.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </form>
            </div>

            <form onSubmit={handleSubmit}>
                <label>
                    Username
                    <input type="text" value={username} onChange={handleUsernameChange} />
                </label>
                <label>
                    First Name:
                    <input type="text" value={firstName} onChange={handleFirstNameChange} />
                </label>
                <br />
                <label>
                    Last Name:
                    <input type="text" value={lastName} onChange={handleLastNameChange} />
                </label>
                <br />
                <button onClick={handleSubmit} type="submit">Submit</button>
                <label>
                    Bio
                    <input type="text" value={bio} onChange={handleBioCHange} />
                </label>
            </form>
        </div>
    )

    const signInWithGoogleButton = (
        <button onClick={signInWithGoogle}>Sign In with Google</button>
    )

    return (
        <>
            <h1>SignUp</h1>
            {user === '' ? (
                signInWithGoogleButton
            ) : (
                form
            )}
        </>
    );
};

export default SignUp;