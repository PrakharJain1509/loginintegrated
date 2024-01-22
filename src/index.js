import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './Dashboard';
import PostPage from './PostPage';
import ProfilePage from './ProfilePage';
import SearchPage from './SearchPage';
import LoginForm from "./Login/loginForm.jsx";
import SignUp from "./pages/SignUp/signUp";
import UserprofilePage from './UserprofilePage';
import homeIcon from './homeicon.png';
import postIcon from './posticon.png';
import profileIcon from './profileicon.png';
import searchIcon from './searchicon.png';
import { BrowserRouter } from 'react-router-dom';
import AboutPage from './AboutPage';
import notificationIcon from './notificationicon.png';
import NotificationPage from "./NotificationPage";
import SplashScreen from './SplashScreen';

const App = (user) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [activeTab, setActiveTab] = useState('confessions');
    // const [mentionedConfessionId, setMentionedConfessionId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [userData, setUserData] = useState({
        confessions: [
            {
                "id": 1,
                "mentioned_user": null,
                "content": "@tester_2 hello mister mmmmmmmmmmmmmmm mmmmmmmmmmmmmmm mmmmmmmmmmmmmmm mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm mmmmmmmmmmmmmmm",
                "date_posted": "2023-09-18T06:13:47.016000Z",
                "author": {
                    "id": 1,
                    "username": "tester_1",
                    "email": "",
                    "first_name": "",
                    "last_name": "",
                    "password": "pbkdf2_sha256$600000$crDWiTkjmkfBnE5pDONpIx$2qKL6gKeoW8JSQtJNSMla0cyYkdq46KpN5+YdLkWuYs=",

                }
            },
            // ... other posts
        ],
        name: 'Friend2',
        id:'2',
        username:'You Just Commented',
        profileImage: '.profileicon',
        branch: 'CSE26',
        bio: 'A passionate blogger and explorer!',




        comments:[
            {
                "id": 1,
                "post_id": 1,
                "comment": "Lorem Ipsum Dolor",
                "user_commented": {
                    "id": 2,
                    "username": "you",
                    "email": "",
                    "first_name": "",
                    "last_name": "",
                    "password": "pbkdf2_sha256$600000$4ilIIV6FQNK6Ngaw1ctO3U$UnNaZDD/yMBvt+v615TSzHLyF2OCMWgnWn3Gyf/lu0U="
                },
                "upvote": false,
                "downvote":false,
            },
        ],


        mentioned: [
            { content: 'Hello, rvc' + '!', date_posted: "2023-08-06T15:15:57Z",},
            { content: 'Another day, another post.',date_posted: "2023-08-06T15:15:57Z", },
            { content: 'Another day, another post.',date_posted: "2023-08-06T15:15:57Z", },
            { content: 'Another day, another post.',date_posted: "2023-08-06T15:15:57Z", },
            { content: 'Another day, another post.' ,date_posted: "2023-08-06T15:15:57Z",},
            { content: 'Another day, another post.',date_posted: "2023-08-06T15:15:57Z", },
            { content: 'Another day, another post.' ,date_posted: "2023-08-06T15:15:57Z",}


            // ... other posts
        ],

        friends: [
            { name: 'Friend1', username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png'},
            { name: 'Friend2',username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png' },
            { name: 'Friend3',username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png' },
            { name: 'Friend1', username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png'},
            { name: 'Friend2',username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png' },
            { name: 'Friend3',username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png' },
            { name: 'Friend1', username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png'},
            { name: 'Friend2',username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png' },
            { name: 'Friend3',username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png' },
            // Add more friends as needed
        ],
    });

    const [usersData, setUsersData] = useState([
        { name: 'Friend1',username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png' },
        { name: 'Friend2',username:'abc', image: 'C:\\Users\\Prakhar Jain\\WebstormProjects\\front-end\\Front-End\\Front-End\\My.jpg' },
        { name: 'Friend3',username:'abc',image: 'C://Users//Prakhar Jain//WebstormProjects//front-end//Front-End//Front-End//My.jpg' },
        // ... other users
    ]);

    const switchToPostPage = () => {
        setCurrentPage('postPage');

    };

    const switchToNotificationPage = () => {
        setCurrentPage('notificationPage');
    };

    const switchToDashboard = () => {
        setCurrentPage('dashboard');

    };

    const switchToProfilePage = () => {
        setCurrentPage('profilePage');

    };

    const switchToSearchPage = () => {
        setCurrentPage('searchPage');

    };

    const switchToAboutPage = () => {
        setCurrentPage('aboutPage');
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const switchToUserprofilePage = () => {
        setCurrentPage('userprofilePage');

    };
    const switchToSignUp = () => {
        setCurrentPage('signUp');

    };

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            switchToDashboard();
        }
    }, [setIsAuthenticated, switchToDashboard]);

    const [notifications, setNotifications] = useState([]); // State to hold notifications
    //
    // // Function to check for mentions and add notifications
    // const checkMentions = () => {
    //     const mentions = userData.confessions.filter((confession) =>
    //         confession.content.includes(`@${userData.username}`)
    //     );
    //
    //     const newNotifications = mentions.map((mention) => ({
    //         text: 'Someone has mentioned you in a confession',
    //         time: mention.date_posted,
    //     }));
    //
    //     setNotifications(newNotifications);
    // };
    //
    // // Check for mentions when user data changes
    // useEffect(() => {
    //     checkMentions();
    // }, [userData]);
    //
    // const openMentionedConfession = (mentionedConfessionId) => {
    //     setCurrentPage('profilePage');
    //     setActiveTab('mentioned');
    //     setMentionedConfessionId(mentionedConfessionId);
    // };

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }, []);

    return (
        <div>
            {isLoading ? (
                <SplashScreen />
            ) : (
                <div>
                    <nav>
                        {isAuthenticated && windowWidth <= 768 && currentPage !== 'postPage' && currentPage !=='aboutPage' && (
                            <div style={{ height: '70px', borderRadius: '11px', display: 'flex', justifyContent: 'space-around', fontSize: '33px', border: '0px solid #808080', marginBottom: '-1px', padding: '13px', position: 'fixed', bottom: '-10px', left: '0', right: '0', backgroundColor: '#ffffff', zIndex: '100', width: '100%', boxSizing: 'border-box', boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)' }}>
                                <img src={homeIcon} onClick={switchToDashboard} style={{ borderRadius: '50%', width: '31px', height: '31px', transform: currentPage === 'dashboard' ? 'scale(1.3)' : 'scale(1)' }} />
                                <img src={searchIcon} onClick={switchToSearchPage} style={{ borderRadius: '50%', width: '31px', height: '31px', transform: currentPage === 'searchPage' ? 'scale(1.3)' : 'scale(1)' }} />
                                <img
                                    src={postIcon}
                                    onClick={() => switchToPostPage('postPage')}
                                    style={{
                                        borderRadius:'30%',
                                        width: '31px',
                                        height: '31px',
                                        transform: currentPage === 'postPage' ? 'scale(1.3)' : 'scale(1)',
                                    }}
                                />
                                <img src={notificationIcon} onClick={switchToNotificationPage} style={{ borderRadius: '30%', width: '31px', height: '31px', transform: currentPage === 'notificationPage' ? 'scale(1.3)' : 'scale(1)' }} />
                                <img src={profileIcon} onClick={switchToProfilePage} style={{ borderRadius: '50%', width: '31px', height: '31px', transform: currentPage === 'profilePage' ? 'scale(1.3)' : 'scale(1)' }} />
                            </div>
                        )}
                        {/* Other navigation elements */}
                    </nav>
                    {isAuthenticated ? (
                        <>
                            {currentPage === 'dashboard' && <Dashboard user={userData} />}
                            {currentPage === 'postPage' && <PostPage switchToDashboard={switchToDashboard} users={usersData} />}
                            {currentPage === 'profilePage' && <ProfilePage user={userData} activeTab={activeTab} handleTabClick={handleTabClick} setUserData={setUserData} switchToAboutPage={switchToAboutPage}  />}
                            {/*mentionedConfessionId={mentionedConfessionId}*/}
                            {currentPage === 'searchPage' && (
                                <SearchPage usersData={usersData} setCurrentPage={switchToUserprofilePage} />
                            )}
                            {currentPage === 'userprofilePage' && <UserprofilePage user={userData} activeTab={activeTab} handleTabClick={handleTabClick} setUserData={setUserData} switchToSearchPage={switchToSearchPage} />}
                            {currentPage === 'aboutPage' && <AboutPage />}
                            {currentPage === 'notificationPage' && <NotificationPage notifications={notifications} switchToProfilePage={switchToProfilePage}  />}
                            {/*openMentionedConfession={openMentionedConfession}*/}
                        </>
                    ) : (
                        <>
                            {/* Render the login form when the user is not authenticated and currentPage is not 'signUp' */}
                            {currentPage !== 'signUp' && (
                                <LoginForm setIsAuthenticated={setIsAuthenticated} switchToDashboard={switchToDashboard} switchToSignUp={switchToSignUp} />
                            )}

                            {/* Render the SignUp form when currentPage is 'signUp' */}
                            {currentPage === 'signUp' && (
                                <SignUp switchToDashboard={switchToDashboard} />
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
);