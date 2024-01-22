import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';

import homeIcon from './homeicon.png';
import searchIcon from './searchicon.png';
import postIcon from './posticon.png';
import profileIcon from './profileicon.png';
import rvclogo from './rvclogo.png';
import likeicon from './likeicon.png';
import dislikeicon from './dislikeicon.png';
import commenticon from './commenticon.png';
import postmenuIcon from "./postmenuicon.png";

// const hasCompletedProfile = () => {
//     // Check if a flag in local storage exists to indicate profile completion.
//     return localStorage.getItem('profileCompleted') === 'true';
// };
//
// const markProfileAsCompleted = () => {
//     // Set the flag in local storage to indicate profile completion.
//     localStorage.setItem('profileCompleted', 'true');
// };

const Dashboard = ({ user }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showStickyNote, setShowStickyNote] = useState(true);
    const [likeState, setLikeState] = useState({});
    const [posts, setPosts] = useState([]);
    const [isCommentDropdownOpen, setCommentDropdownOpen] = useState(false);
    const [selectedConfessionComments, setSelectedConfessionComments] = useState([]);
    const [selectedConfessionId, setSelectedConfessionId] = useState(null);
    const [commentCounts, setCommentCounts] = useState({});
    const authToken = localStorage.getItem('token');
    const [newComment, setNewComment] = useState('');
    const [showpostDropdown, setShowpostDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const loggedInUsername = localStorage.getItem('username'); // Get the currently logged-in user's username
    const [mentionedPosts, setMentionedPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [selectedPostComments, setSelectedPostComments] = useState([]);
    const [selectedPostForDeletion, setSelectedPostForDeletion] = useState(null);
    const commentDropdownRef = useRef(null);
    // const [profilePic, setProfilePic] = useState();
    // const [Branch, setBranch] = useState();
    // const [Bio, setBio] = useState()
    // const [showuserinfoForm, setShowuserinfoForm] = useState(!hasCompletedProfile());
    const [isLoading, setIsLoading] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const bubbleNames = ['Bubble 1', 'Bubble 2', 'Bubble 3', 'Bubble 4', 'Bubble 5','abchhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhabc'];

    useEffect(() => {
        axios
            .get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/api/mentioned-posts/${loggedInUsername}/`, {
                headers: {
                    Authorization: `Token ${authToken}`,
                },
            })
            .then((response) => {
                const mentionedPosts = response.data;

                // Update the state to include mentioned posts
                setMentionedPosts(mentionedPosts);
            })
            .catch((error) => {
                console.error('Error fetching mentioned posts:', error);
            });
    }, [authToken, loggedInUsername]);

    // Fetch the posts authored by the user
    useEffect(() => {
        axios
            .get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/api/posts-by-author/${loggedInUsername}/`, {
                headers: {
                    Authorization: `Token ${authToken}`,
                },
            })
            .then((response) => {
                const userPosts = response.data;

                // Update the state to include user's posts
                setUserPosts(userPosts);
            })
            .catch((error) => {
                console.error('Error fetching user posts:', error);
            });
    }, [authToken, loggedInUsername]);

    const shouldShowPostMenuIcon = (postId) => {
        // Check if the post is authored by the user or mentioned in mentionedPosts
        const isUserPost = userPosts.some((post) => post.id === postId);
        const isMentionedPost = mentionedPosts.some((post) => post.id === postId);

        return isUserPost || isMentionedPost;
    };

    const handleCommentInputChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = () => {
        if (newComment.trim() === '') {
            return; // Prevent posting empty comments
        }

        const commentData = {
            comment: newComment,
            post_id: selectedConfessionId, // Use the selected post's ID
        };

        // Make a POST request to add a new comment with token authentication
        axios
            .post('https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/comments/', commentData, {
                headers: {
                    Authorization: `Token ${authToken}`,
                },
            })
            .then((response) => {
                // Handle successful comment submission
                const newCommentData = {
                    ...response.data,
                    user_commented: user, // Add user details to the comment
                };

                // Update the comments state with the newly added comment immediately
                setSelectedConfessionComments((prevComments) => [...prevComments, newCommentData]);

                // Clear the comment input field
                setNewComment('');

                // No need to fetch comments here; they will already be in selectedConfessionComments
            })
            .catch((error) => {
                console.error('Error posting comment:', error);
            });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showpostDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowpostDropdown(false);

            }
        };

        if (showpostDropdown) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showpostDropdown]);

    const fetchUserDetails = (userId) => {
        return axios.get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/${userId}/`, {
            headers: {
                Authorization: `Token ${authToken}`,
            },
        });
    };

    const formatTimeDifference = (confessionDate) => {
        const currentDate = new Date();
        const timeDifference = currentDate - new Date(confessionDate);

        if (timeDifference < 60000) {
            return Math.floor(timeDifference / 1000) + " s";
        } else if (timeDifference < 3600000) {
            return Math.floor(timeDifference / 60000) + " m";
        } else if (timeDifference < 86400000) {
            return Math.floor(timeDifference / 3600000) + " h";
        } else {
            return Math.floor(timeDifference / 86400000) + " d";
        }
    };

    // Define a mapping between color names and color pairs
    const colorMapping = {
        pink: ['#FC85BDB7', '#ff76b3'],
        blue: ['#89E7FFB7', '#76cfff'],
        red: ['#FF8989B7', '#FF7676FF'],
        yellow: ['#FFF189B7', '#ffef76'],
        purple: ['#AA89FFB7', '#9b76ff'],
        green: ['#88FD88B7', '#76fd76'],
    };

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        const handleScroll = () => {
            setShowStickyNote(window.scrollY <= 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const authToken = localStorage.getItem('token');

        axios
            .get('https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/posts/', {
                headers: {
                    Authorization: `Token ${authToken}`,
                },
            })
            .then((response) => {
                const postsWithColors = response.data.map((post) => {
                    const colorPair = colorMapping[post.color_code] || ['#FFFFFF', '#FFFFFF']; // Default to white if color not found
                    return {
                        ...post,
                        colorPair,
                        post_id: post.id, // Add the post_id property
                    };
                });
                setPosts(postsWithColors);

                // Fetch comment counts for each post
                const commentCountPromises = postsWithColors.map((post) => {
                    return axios
                        .get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/comments/comments_on_post/${post.id}/`, {
                            headers: {
                                Authorization: `Token ${authToken}`,
                            },
                        })
                        .then((response) => {
                            const count = response.data.length;
                            return { postId: post.id, count };
                        })
                        .catch((error) => {
                            console.error('Error fetching comment count:', error);
                            return { postId: post.id, count: 0 };
                        });
                });

                // Wait for all comment count requests to complete
                Promise.all(commentCountPromises)
                    .then((counts) => {
                        // Create an object with post IDs as keys and comment counts as values
                        const commentCountsObject = {};
                        counts.forEach((countObj) => {
                            commentCountsObject[countObj.postId] = countObj.count;
                        });
                        setCommentCounts(commentCountsObject);
                    })
                    .catch((error) => {
                        console.error('Error fetching comment counts:', error);
                    });
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    }, [authToken]);

    const handlepostmenuClick = (postId) => { // Modify the function to accept postId
        // Toggle the dropdown menu
        setShowpostDropdown(!showpostDropdown);
        setSelectedPostForDeletion(postId); // Set the selected post for deletion
    };

    const handleDeleteConfession = () => {
        if (selectedPostForDeletion) {
            // Send a DELETE request to the endpoint for deleting the post
            axios
                .delete(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/posts/${selectedPostForDeletion}/`, {
                    headers: {
                        Authorization: `Token ${authToken}`,
                    },
                })
                .then((response) => {
                    // Handle successful post deletion (e.g., remove it from the state)
                    // You can update the state here to remove the deleted post
                    const updatedPosts = posts.filter((post) => post.id !== selectedPostForDeletion);
                    setPosts(updatedPosts);
                    setSelectedPostForDeletion(null); // Clear the selected post for deletion
                    setShowpostDropdown(false); // Close the dropdown menu
                })
                .catch((error) => {
                    console.error('Error deleting post:', error);
                });
        }
    };



    const handleLikeDislike = (confessionId) => {
        const newLikeState = { ...likeState };
        newLikeState[confessionId] = !newLikeState[confessionId];
        setLikeState(newLikeState);
    };

    const toggleCommentDropdown = (confession) => {
        if (isCommentDropdownOpen) {
            // Close the comment section
            setCommentDropdownOpen(false);
            setSelectedConfessionComments([]);
            setSelectedConfessionId(null);
        } else {
            setIsLoading(true);
            // Open the comment section
            axios
                .get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/comments/comments_on_post/${confession.id}/`, {
                    headers: {
                        Authorization: `Token ${authToken}`, // Include any required authentication headers
                    },
                })
                .then((response) => {
                    // Fetch user details for each comment
                    const commentPromises = response.data.map((comment) => {
                        return fetchUserDetails(comment.user_commented).then((userResponse) => {
                            return {
                                ...comment,
                                user_commented: userResponse.data, // Replace user_commented ID with user details
                            };
                        });
                    });

                    // Wait for all user detail requests to complete
                    Promise.all(commentPromises)
                        .then((commentsWithUsers) => {
                            setSelectedConfessionComments(commentsWithUsers);
                            setSelectedConfessionId(confession.id);
                            setCommentDropdownOpen(true);

                            // Fetch comments for the selected post immediately when opening the comment section
                            fetchComments(confession.id);
                            setIsLoading(false);// This line is already in the correct place
                        })
                        .catch((error) => {
                            console.error('Error fetching comments:', error);
                            setIsLoading(false);
                        });
                })
                .catch((error) => {
                    console.error('Error fetching comments:', error);
                    setIsLoading(false);
                });
        }
    };

    useEffect(() => {
        // Fetch comments for the selected post when the component mounts
        if (selectedConfessionId !== null) {
            fetchComments(selectedConfessionId);
        }
    }, [selectedConfessionId]);

    const fetchComments = (postId) => {
        // Make a GET request to fetch comments for the selected post
        axios
            .get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/comments/?post_id=${postId}`)
            .then((response) => {
                // Set the comments in the state
                setComments(response.data);
            })
            .catch((error) => {
                console.error('Error fetching comments:', error);
            });
    };


    useEffect(() => {
        const counts = {};
        user.confessions.forEach((confession) => {
            const comments = user.comments.filter((comment) => comment.post_id === confession.id);
            counts[confession.id] = comments.length;
        });
        setCommentCounts(counts);
    }, [user.confessions, user.comments]);
    const formatCommentCount = (count) => {
        if (count < 1000) {
            return count.toString();
        } else if (count < 1000000) {
            return (count / 1000).toFixed(1) + 'K';
        } else {
            return (count / 1000000).toFixed(1) + 'M';
        }
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isCommentDropdownOpen && commentDropdownRef.current && !commentDropdownRef.current.contains(event.target)) {
                // Click occurred outside the comment dropdown
                setCommentDropdownOpen(false);
                setSelectedConfessionComments([]);
                setSelectedConfessionId(null);
            }
        };

        if (isCommentDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isCommentDropdownOpen]);


    useEffect(() => {
        const handleCommentDropdownOpen = () => {
            // Disable scrolling when the comment dropdown is open
            document.body.style.overflow = 'hidden';
        };

        const handleCommentDropdownClose = () => {
            // Enable scrolling when the comment dropdown is closed
            document.body.style.overflow = 'auto';
        };

        if (isCommentDropdownOpen) {
            handleCommentDropdownOpen();
        } else {
            handleCommentDropdownClose();
        }

        return () => {
            handleCommentDropdownClose();
        };
    }, [isCommentDropdownOpen]);

    // const handleProfilePicChange = (e) => {
    //     const file = e.target.files[0];
    //     // You can add code here to upload the selected profile picture to a server or display it on the page.
    //     setProfilePic(file);
    // };
    //
    // const handleNameChange = (e) => {
    //     setBranch(e.target.value);
    // };
    //
    // const handleBioChange = (e) => {
    //     setBio(e.target.value);
    // };
    // const handleUserInfoSubmit = (e) => {
    //     e.preventDefault();
    //     // Add code to submit the updated profile information
    //     // You can include an API call or any other logic to save the user's profile data.
    //
    //     // Mark the profile as completed when the user submits their information.
    //     markProfileAsCompleted();
    //     setShowuserinfoForm(false); // Hide the form after completion.
    // };

    const movingGradientBorderCSS = `
        @keyframes moveGradientBorder {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }
    `;
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    return (
        <div style={{ marginBottom: windowWidth <= 768 ? '60px' : '0' }}>
            {isLoading ? (
                // Display loading screen while data is being fetched
                <div style={{ textAlign: 'center', paddingTop: '50px' }}>
                    <p>Loading...</p>
                    {/* You can add a spinner or any other loading indicator here */}
                </div>
            ) : (
            <>
                <div style={{ position: 'fixed', top: visible ? '0' : '-190px', transition: 'top 0.3s', left: '0', right: '0', backgroundColor: '#fff', zIndex: '1000' }}>
                    <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
                        {/* RV Connected logo */}
                        <div>
                            <img src={rvclogo} alt="RV Connected" style={{ paddingTop: '5px', height: '140px', width: '140px' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', overflowX: 'auto', marginBottom: '-15px', whiteSpace: 'nowrap', position: 'relative',top:'-10px', }}>
                        {bubbleNames.map((name, index) => (
                            <div key={index} style={{  margin: '5px 15px', textAlign: 'center', position: 'relative',justifyContent:'space-evenly' }}>
                                {/* Bubble with moving gradient border */}
                                <div style={{marginLeft:'10px'}}>
                                <div style={{boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)', borderRadius: '50%', width: '59px', height: '59px',  backgroundImage: 'linear-gradient(to right, #ff00cc, #3390FF, #ff00cc)', backgroundSize: '200% 200%', animation: 'moveGradientBorder 3s linear infinite', overflow: 'hidden' }}>
                                    <img src={rvclogo} style={{ height: '50px', width: '50px', borderRadius: '50%' , backgroundColor:'#fff',position:'relative',top:'5px',left:'0px'}} />
                                    </div>
                                </div>
                                <p style={{fontFamily: 'Helvetica', width: 'auto', maxWidth:'100px',overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',fontSize:'18px',justifyContent:'space-evenly' }}><b>{name}</b></p>
                            </div>
                        ))}
                    </div>
                </div>
                <style>{movingGradientBorderCSS}</style>
                <div style={{ paddingTop: '190px' }}>
            {posts.map((confession, index) => (
                <div key={index} style={{
                    borderRadius: '11px',
                    borderBottomLeftRadius: '30px',
                    background: confession.colorPair[0], // Use the first color from the pair
                    position: 'relative',
                    bottom: '10px',
                    zIndex: 'auto',
                    border: '0px solid #000',
                    padding: '10px',
                    margin: '10px',
                    maxWidth: '100%',
                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                    whiteSpace: 'pre-line',
                    overflow: 'hidden',
                    overflowWrap: 'break-word',
                    display: selectedConfessionId === confession.id || !isCommentDropdownOpen ? 'block' : 'none',
                }}>
                    <div style={{ zIndex: '1', fontFamily: 'Helvetica', position: 'relative' }}>
                        <p style={{
                            position: 'absolute',
                            top: '-15px',
                            right: '4px',
                            color: '#000',
                            fontFamily: 'Helvetica'
                        }}>{formatTimeDifference(confession.date_posted)}</p>

                        {shouldShowPostMenuIcon(confession.id) && (
                            <button onClick={() => handlepostmenuClick(confession.id)} style={{ backgroundColor: 'transparent', border: 'none' }}>
                                <img src={postmenuIcon} style={{ position: 'relative', cursor: 'pointer', width: '25px', height: '25px', marginRight: '10px' }} />
                            </button>
                        )}
                        {showpostDropdown && (
                            <div  ref={dropdownRef}
                                  style={{overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'50%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)'}}>
                                <ul style={{ listStyle: 'none', padding: '0' }}>
                                    <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'#ff4b4b' }}  onClick={() => handleDeleteConfession(confession.id)}><b>Delete</b></li>
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={() => handleLikeDislike(confession.id)}
                            style={{ backgroundColor: 'transparent', border: 'none' }}
                        >
                            {likeState[confession.id] ? <img src={likeicon} style={{ height: '25px', width: '25px' }} /> : <img src={dislikeicon} style={{ height: '25px', width: '25px' }} />}
                        </button>
                        <button
                            onClick={() => toggleCommentDropdown(confession)}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                            }}>
                            <img src={commenticon} style={{ height: '25px', width: '25px' }} />
                            <span style={{ marginLeft: '4px', fontFamily: 'Helvetica', position: 'relative', top: '-7px' }}>
                                {formatCommentCount(commentCounts[confession.id] || 0)}
                            </span>

                        </button>
                        {isCommentDropdownOpen && selectedConfessionComments.length > 0 && (
                            <div ref={commentDropdownRef}
                                style={{
                                bottom: 60,
                                overflowY: 'scroll',
                                position: 'fixed',
                                left: 0,
                                height:'50%',
                                width: '100%',
                                backgroundColor: 'white',
                                zIndex: '100',
                                borderTopRightRadius: '20px',
                                borderTopLeftRadius: '20px',
                                border: '0px solid #000',
                                boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)',
                            }}>
                                {selectedConfessionComments.map((comment) => (
                                    <div style={{
                                        padding: '0px 0',
                                        borderBottom: '1px solid #ccc',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}>
                                        {comment.user_commented && comment.user_commented.profilepic ? (
                                            <img src={comment.user_commented.profilepic} style={{
                                                minWidth: '40px',
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                marginLeft: '15px',
                                                backgroundColor: '#000',
                                                position: 'relative',
                                                top: '-50px'
                                            }} />
                                        ) : (
                                            <div style={{ minWidth: '40px', width: '40px', height: '40px', borderRadius: '50%', marginLeft: '15px' }} />
                                        )}
                                        <div key={comment.id} style={{
                                            padding: '15px',
                                            whiteSpace: 'pre-line',
                                            overflow: 'hidden',
                                            overflowWrap: 'break-word',
                                        }}>
                                            <p style={{
                                                fontFamily: 'Helvetica',
                                                color: '#000',
                                                fontSize: '17px',
                                                position: 'relative',
                                                top: '4px',
                                            }}> <b>{comment.user_commented.first_name} {comment.user_commented.last_name}</b> </p>
                                            <p style={{
                                                fontFamily: 'Helvetica',
                                                color: '#8f8f8f',
                                                position: 'relative',
                                                top: '-10px',
                                                fontSize: '17px',
                                            }}><b>@{comment.user_commented.username || ''}</b></p>
                                            <p style={{
                                                fontFamily: 'Helvetica',
                                                position: 'relative',
                                                top: '-10px',
                                                fontSize: '17px',
                                                maxWidth: '90%',
                                            }}>{comment.comment}</p>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={{
                                fontFamily: 'Helvetica',
                                position: 'relative',
                                left: '27px',
                                top: '-10px',
                                maxWidth: '87%',
                            }}>
                <span dangerouslySetInnerHTML={{ __html: confession.content.replace(
                        /@(\w+)/g,
                        (match, username) => `<b>@${username}</b>`
                    ) }} />
                            </p>
                        </div>
                    </div>
                    <div style={{
                        borderBottom: '3px solid #000',
                        borderRight: '1px solid #000',
                        borderTopRightRadius: '0px',
                        borderTopLeftRadius: '30px',
                        borderBottomRightRadius: '11px',
                        borderBottomLeftRadius: '2px',
                        position: 'absolute',
                        bottom: '-0.4px',
                        left: '30.5px',
                        width: '30px',
                        height: '31px',
                        background: confession.colorPair[1], // Use the second color from the pair
                        clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 75%)',
                        zIndex: '0',
                        transform: 'rotate(-83.6deg)',
                        transformOrigin: 'bottom left',
                    }}
                    />
                </div>
            ))}
            {isCommentDropdownOpen ? (
                <div ref={commentDropdownRef} style={{ zIndex: '100', position: 'fixed', bottom: '10px', left: '0px', right: '0px' }}>
                    <div style={{ background: '#fff', boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)', borderRadius: '11px', height: '155px', zIndex: '100', width: '100%', position: 'relative', top: '70px' }}>
                        <textarea
                            type="text"
                            placeholder="Enter your comment"
                            style={{
                                resize: 'none',
                                whiteSpace: 'pre-wrap',
                                overflowWrap: 'break-word',
                                paddingBottom: '0px',
                                paddingLeft: '18.5px',
                                fontFamily: 'Helvetica',
                                width: 'calc(100% - 21px)',
                                height: '40px',
                                background: 'transparent',
                                border: '0px solid #ccc',
                                fontSize: '20px',
                                borderRadius: '0px',
                                position: 'relative',
                                top: '10px',
                            }}
                            value={newComment} // Bind the value to the state
                            onChange={handleCommentInputChange} // Step 2: Attach the event handler
                        />
                        <button
                            onClick={handleCommentSubmit} // Step 3: Attach the event handler
                            style={{ float: 'right', right: '10px', position: 'relative', bottom: '-12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '11px', padding: '6px 12px', fontSize: '15px', cursor: 'pointer', fontFamily: 'Helvetica' }}
                        >
                            <b>Comment</b>
                        </button>
                    </div>
                </div>
            ) : (
                // Render your bottom navigation when the dropdown is closed
                <div style={{ position: 'fixed', bottom: '0', left: '0', right: '0', backgroundColor: '#333' }}>
                </div>
            )}
            {/*{showuserinfoForm && (*/}
            {/*    <form  onSubmit={handleUserInfoSubmit} style={{  overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'99%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)' }}>*/}

            {/*        <input*/}
            {/*            type="file"*/}
            {/*            id="fileInput"*/}
            {/*            accept="image/*"*/}
            {/*            onChange={handleProfilePicChange}*/}
            {/*            style={{*/}
            {/*                display: 'none',*/}

            {/*            }}*/}
            {/*        />*/}
            {/*        <label htmlFor="fileInput">*/}
            {/*            <img*/}
            {/*                src={profilePic}*/}
            {/*                style={{*/}
            {/*                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',*/}
            {/*                    marginBottom: '15px',*/}
            {/*                    fontFamily: 'Helvetica',*/}
            {/*                    width: '150px',*/}
            {/*                    height: '150px',*/}
            {/*                    background: 'rgba(255, 252, 255, 0.5)',*/}
            {/*                    border: '1px solid #ccc',*/}
            {/*                    fontSize: '10px',*/}
            {/*                    zIndex: '1',*/}
            {/*                    borderRadius: '50%',*/}
            {/*                    position:'absolute',*/}
            {/*                    left: '50%',*/}
            {/*                    top: '16%',*/}
            {/*                    transform: 'translate(-50%, -50%)'*/}
            {/*                }}*/}
            {/*            />*/}
            {/*        </label>*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            placeholder="Branch"*/}
            {/*            value={Branch}*/}
            {/*            onChange={handleNameChange}*/}
            {/*            style={{boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',*/}
            {/*                marginBottom: '15px',*/}
            {/*                position:'relative',*/}
            {/*                left: '50%',*/}
            {/*                top: '38%',*/}
            {/*                transform: 'translate(-50%, -50%)',*/}
            {/*                paddingLeft: '18px',*/}
            {/*                fontFamily: 'Helvetica',*/}
            {/*                width: 'calc(90% - 25px)',*/}
            {/*                height: '40px',*/}
            {/*                background: 'rgba(255, 255, 255, 0.5)',*/}
            {/*                border: '1px solid #ccc',*/}
            {/*                fontSize: '18px',*/}
            {/*                zIndex: '1',*/}
            {/*                borderRadius: '11px',}}*/}
            {/*        />*/}
            {/*        <textarea*/}
            {/*            placeholder="Bio"*/}
            {/*            value={Bio}*/}
            {/*            onChange={handleBioChange}*/}
            {/*            style={{boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',*/}
            {/*                marginBottom: '15px',*/}
            {/*                paddingLeft: '18px',*/}
            {/*                position:'relative',*/}
            {/*                left: '50%',*/}
            {/*                top: '45%',*/}
            {/*                transform: 'translate(-50%, -50%)',*/}
            {/*                fontFamily: 'Helvetica',*/}
            {/*                width: 'calc(90% - 25px)',*/}
            {/*                height: '100px',*/}
            {/*                background: 'rgba(255, 255, 255, 0.5)',*/}
            {/*                border: '1px solid #ccc',*/}
            {/*                fontSize: '18px',*/}
            {/*                zIndex: '1',*/}
            {/*                borderRadius: '11px',}}*/}
            {/*        />*/}
            {/*        /!* Include the code to submit the updated profile information *!/*/}
            {/*        <button type="submit"*/}
            {/*                style={{  position:'relative', left: '50%', top: '40%',*/}
            {/*                    transform: 'translate(-50%, -50%)',boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',color:'#fff', fontFamily: 'Helvetica', width: '100px', height: '40px',background:'#000',border:'1px solid #ccc',fontSize:'18px',borderRadius: '11px',}}*/}
            {/*        >Submit</button>*/}
            {/*    </form>*/}
            {/*)}*/}
                </div>
            </>
)}

        </div>
    );
};

export default Dashboard;