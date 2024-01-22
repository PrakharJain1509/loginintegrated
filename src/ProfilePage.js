import React, {useEffect, useRef, useState} from 'react';
import menuIcon from './menuicon.png';
import likeicon from "./likeicon.png";
import dislikeicon from "./dislikeicon.png";
import commenticon from "./commenticon.png";
import CrossIcon from './cross.png';
import TickIcon from './tickicon.png';
import lockicon from './lockicon.png';
import bubbleicon from "./bubbleicon.png";
import postmenuIcon from "./postmenuicon.png";
import GalleryIcon from './gallery.png';
import GifIcon from './gif.png';
import deleteIcon from './delete.png';
import copyIcon from './copy.png';
import replyIcon from './reply.png';
import PollIcon from './poll.png';
import axios, {options} from 'axios';


const ProfilePage = ({mentionedConfessionId, user ,activeTab='confessions',switchToAboutPage, handleTabClick,usersData}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showStickyNote, setShowStickyNote] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQueryfriends, setSearchQueryfriends] = useState('');
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [likeState, setLikeState] = useState({});
    const [isCommentDropdownOpen, setCommentDropdownOpen] = useState(false);
    const [selectedConfessionComments, setSelectedConfessionComments] = useState([]);
    const [selectedConfessionId, setSelectedConfessionId] = useState(null);
    const [commentCounts, setCommentCounts] = useState({});
    const [showAboutOptions, setShowAboutOptions] = useState(false);
    const [showEditProfileForm, setShowEditProfileForm] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [confessions, setConfessions] = useState([]);
    const [mentions, setMentions] = useState([]);
    const token = localStorage.getItem('token');
    const [newComment, setNewComment] = useState('');
    const [userData, setUserData] = useState(null);
    const [newName, setNewName] = useState(userData ? userData.fullName : '');
    const [newBio, setNewBio] = useState(userData ? userData.bio : '');
    const [newBranch, setNewBranch] = useState(userData ? userData.branch : '');
    const [showpostDropdown, setShowpostDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [posts, setPosts] = useState([]);
    const [selectedConfessionIdForMenu, setSelectedConfessionIdForMenu] = useState(null);
    const [username, setUsername] = useState('');
    const [friends, setFriends] = useState([]);
    const [confessionsCommentCounts, setConfessionsCommentCounts] = useState({});
    const [mentionsCommentCounts, setMentionsCommentCounts] = useState({});
    const [initialName, setInitialName] = useState('');
    const [initialBio, setInitialBio] = useState('');
    const [initialBranch, setInitialBranch] = useState('');
    const commentDropdownRef = useRef(null);
    const settingsdropdownRef = useRef(null);
    const aboutdropdownRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showbubbleDropdown, setShowbubbleDropdown] = useState(false);
    const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupPicture, setGroupPicture] = useState('');
    const [groups, setGroups] = useState([]);
    const [showChatRoom, setShowChatRoom] = useState(false);
    const [showchatRoomMenu, setshowchatRoomMenu] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [message, setMessage] = useState('');
    const [messagesByGroup, setMessagesByGroup] = useState({});
    const [messageList, setMessageList] = useState([]);
    const bottomRef = useRef(null);
    const [searchQuerychatroom, setSearchQuerychatroom] = useState('');
    const [showAddUserDropdown, setShowAddUserDropdown] = useState(false);
    const [showPollLayout, setShowPollLayout] = useState(false);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);
    const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image
    const [gifData, setGifData] = useState([]);
    const [showGifPopup, setShowGifPopup] = useState(false);
    const gifPopupRef = useRef(null);
    const [selectedGif, setSelectedGif] = useState(null);
    const [offset, setOffset] = useState(0);
    const [searchgifQuery, setSearchgifQuery] = useState('');
    const [pollVotes, setPollVotes] = useState([]);
    const [pollEndTime, setPollEndTime] = useState(null);
    const [showmessagemenu, setShowmessagemenu] = useState(false); // To show/hide delete dropdown
    const [deletemsg, setDeletemsg] = useState(null);
    const timeoutRef = useRef(null);
    const [showCopyPopup, setShowCopyPopup] = useState(false);



    const fetchConfessions = async () => {
        try {
            // Retrieve the authentication token from local storage
            const token = localStorage.getItem('token');

            // Retrieve the username from local storage or wherever it's stored
            const username = localStorage.getItem('username'); // Replace with your actual way of getting the username

            // Create an Axios instance with the token in the headers
            const axiosInstance = axios.create({
                baseURL: 'https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/api/',
                headers: {
                    Authorization: `Token ${token}`, // Include the token in the headers
                },
            });

            // Make a GET request to your Django backend API using the Axios instance
            const response = await axiosInstance.get(`posts-by-author/${username}/`);

            // Extract the confessions data from the API response
            const confessionsData = response.data.map((confession) => ({
                ...confession,
                backgroundColor: getColorSet(confession.color_code)[0],
                post_id: confession.id,// Get the background color based on color_code
            }));

            // Once you have the modified data, you can set it to your component's state
            setConfessions(confessionsData);

            const commentCountPromises = confessionsData.map((post) => {
                return axios
                    .get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/comments/comments_on_post/${post.id}/`, {
                        headers: {
                            Authorization: `Token ${token}`,
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

            Promise.all(commentCountPromises)
                .then((counts) => {
                    const commentCountsObject = {};
                    counts.forEach((countObj) => {
                        commentCountsObject[countObj.postId] = countObj.count;
                    });
                    setConfessionsCommentCounts(commentCountsObject); // Update the confessions comment counts
                })
                .catch((error) => {
                    console.error('Error fetching comment counts:', error);
                });

        } catch (error) {
            console.error('Error fetching confessions:', error);
        }
    };

    useEffect(() => {
        axios.get('https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/user-groups/', {
            headers: {
                Authorization: `Token ${token}`,
            },
        })
            .then(response => {
                const userGroupData = response.data;

                // Extract unique group IDs
                const groupIds = Array.from(new Set(userGroupData.map(item => item.group)));

                // Fetch details for each group
                const groupRequests = groupIds.map(groupId =>
                    axios.get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/groups/${groupId}/`, {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    })
                );

                // Wait for all requests to finish
                return Promise.all(groupRequests);
            })
            .then(groupResponses => {
                // Extract relevant details and update state
                const updatedGroups = groupResponses.map(response => ({
                    id: response.data.id,
                    members: response.data.members,
                    picture: response.data.picture || '',
                    name: response.data.name,
                }));

                setGroups(updatedGroups);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [token]);

    const openChatRoomMenu = async (group) => {
        try {
            // console.log('Clicked group:', group);

            if (group && group.id) {
                setSelectedGroup(group);
                setGroupPicture(group.picture || '');
                setGroupName(group.name);
                setSearchQuerychatroom('');
                setshowchatRoomMenu(true);

                // Load members for the selected group
                await loadGroupMembers(group.id);
            } else {
                console.error("Invalid group or group ID is undefined");
                // Handle the error or provide feedback to the user
            }
        } catch (error) {
            console.error("Error in openChatRoomMenu:", error);
        }
    };






    // Assuming you have this state variable in your component
    const [loadedMembers, setLoadedMembers] = useState([]);

// Replace the existing loadGroupMembers function with the updated version
    const loadGroupMembers = async (groupId) => {
        try {
            // Fetch the token from local storage
            const token = localStorage.getItem('token');

            // Make sure the token is available before making the request
            if (!token) {
                console.error('Token not found in local storage');
                return [];
            }

            // Include the token in the request headers
            const headers = {
                Authorization: `Token ${token}`,
            };

            // Make the request with the headers
            const response = await axios.get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/groups/${groupId}/`, {
                headers,
            });

            const groupData = response.data;

            // Assuming groupData.members is an array of members
            const members = groupData.members || [];

            // Update the state with the loaded members
            setLoadedMembers(members);

            // Return the members to the calling function
            return members;
        } catch (error) {
            console.error('Error fetching group members:', error);
            throw error; // Rethrow the error to handle it in the calling function
        }
    };




    useEffect(() => {
        if (searchQuerychatroom.trim().length >= 2 && selectedGroup && selectedGroup.id) {
            setIsSearching(true);

            const cleanedQuery = searchQuerychatroom.trim().toLowerCase().replace(/\s/g, '');

            // Fetch members for the selected group
            loadGroupMembers(selectedGroup.id)
                .then((members) => {
                    // Filter members based on the search query
                    const filteredUsers = members.filter((user) =>
                        user.first_name.toLowerCase().replace(/\s/g, '').includes(cleanedQuery) ||
                        user.last_name.toLowerCase().replace(/\s/g, '').includes(cleanedQuery)
                    );

                    setSearchResults(filteredUsers);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setIsSearching(false);
                });
        } else {
            setSearchResults([]);
            setIsSearching(false); // Make sure to set isSearching to false when no search query.
        }
    }, [searchQuerychatroom, selectedGroup]);



    // const openChatRoom = group => {
    //     // Implement your logic to open a chat room
    //     console.log('Opening chat room for group:', group);
    // };

    const handleCommentSubmit = () => {
        if (newComment.trim() === '') {
            return; // Prevent posting empty comments
        }

        const commentData = {
            comment: newComment,
            post_id: selectedConfessionId, // Use the selected post's ID
        };

        // Make a POST request to the API endpoint with token authentication
        axios
            .post('https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/comments/', commentData, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then((response) => {
                // Handle successful comment submission
                // console.log('Comment posted successfully:', response.data);

                // Step 1: Add the new comment to the selectedConfessionComments state
                const newCommentData = {
                    ...response.data,
                    user_commented: user, // Add user details to the comment
                };
                setSelectedConfessionComments([...selectedConfessionComments, newCommentData]);

                // Step 2: Update the comment count for the selected post
                setCommentCounts((prevCounts) => ({
                    ...prevCounts,
                    [selectedConfessionId]: (prevCounts[selectedConfessionId] || 0) + 1,
                }));

                // Clear the comment input field
                setNewComment('');

                // Refresh the page to show the updated comments
                // window.location.reload();
            })
            .catch((error) => {
                console.error('Error posting comment:', error);
            });
    };

    const fetchUserId = () => {
        const username = localStorage.getItem('username');
        const apiUrl = `https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/by-username/${username}/`;

        axios
            .get(apiUrl)
            .then((response) => {
                // Extract the user ID from the response
                const userId = response.data.id;

                // Call the fetchFriends function with the obtained user ID
                fetchFriends(userId);
            })
            .catch((error) => {
                console.error('Error fetching user ID:', error);

            });
    };

    const handlepostmenuClick = (confessionId) => {
        // Toggle the dropdown menu
        setSelectedConfessionIdForMenu(confessionId);
        setShowpostDropdown(!showpostDropdown);
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
                        Authorization: `Token ${token}`, // Include any required authentication headers
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
                            setIsLoading(false);
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

    const fetchUserDetails = (userId) => {
        return axios.get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/${userId}/`, {
            headers: {
                Authorization: `Token ${token}`,
            },
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

    const handleCommentInputChange = (event) => {
        setNewComment(event.target.value);
    };

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');

            // First, fetch user data from the first endpoint for profile picture and bio
            const firstEndpointResponse = await axios.get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/profile-pics/by-username/${username}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            const userProfileData = firstEndpointResponse.data;

            // Then, use the 'user' ID from the first endpoint to fetch the user's name from the second endpoint
            const secondEndpointResponse = await axios.get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/${userProfileData.user}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            const userDataFromSecondEndpoint = secondEndpointResponse.data;

            // Combine the first and last name to create the fullName
            const fullName = `${userDataFromSecondEndpoint.first_name || ''} ${userDataFromSecondEndpoint.last_name || ''}`;

            // Update the state with the user profile data, including pre-filling name and bio
            setUserData({
                id: userProfileData.id,
                bio: userProfileData.bio || '', // Pre-fill with an empty string if bio is null
                branch: userProfileData.branch || '', // You can update this as needed
                profile_picture: userProfileData.profile_picture || '', // You can update this as needed
                user: userProfileData.user || '', // You can update this as needed
                fullName, // Use the corrected fullName
                // Add other fields as needed
            });

            // Pre-fill the name and bio fields
            setNewName(fullName || ''); // Use the first_name field if available
            setNewBio(userProfileData.bio || ''); // Pre-fill with an empty string if bio is null
            setNewBranch(userProfileData.branch || '');

        } catch (error) {
            console.error('Error fetching user profile data:', error);
        }
        setIsLoading(false);
    };

    const handleDeleteConfession = () => {
        if (selectedConfessionIdForMenu) {
            // Send a DELETE request to the endpoint for deleting the post
            axios
                .delete(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/posts/${selectedConfessionIdForMenu}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                })
                .then((response) => {
                    // Handle successful post deletion (e.g., remove it from the state)
                    // You can update the state here to remove the deleted post
                    const updatedConfessions = confessions.filter((confession) => confession.id !== selectedConfessionIdForMenu);
                    const updatedMentions = mentions.filter((mention) => mention.id !== selectedConfessionIdForMenu);
                    setConfessions(updatedConfessions);
                    setMentions(updatedMentions);
                    // Optionally, close the dropdown or perform any other necessary actions
                    setShowpostDropdown(false);
                })
                .catch((error) => {
                    console.error('Error deleting post:', error);
                });
        }
    };



    // Fetch user profile data when the component mounts
    useEffect(() => {
        fetchUserData();
    }, []);



    const fetchMentions = async () => {
        try {
            // Retrieve the authentication token from local storage
            const token = localStorage.getItem('token');

            // Retrieve the username from local storage or wherever it's stored
            const username = localStorage.getItem('username'); // Replace with your actual way of getting the username

            // Create an Axios instance with the token in the headers
            const axiosInstance = axios.create({
                baseURL: 'https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/api/',
                headers: {
                    Authorization: `Token ${token}`, // Include the token in the headers
                },
            });

            // Make a GET request to your Django backend API using the Axios instance
            const response = await axiosInstance.get(`mentioned-posts/${username}/`);

            // Once you have the response, you can set it to your component's state
            const mentionsWithColors = response.data.map((mention, index) => ({
                ...mention,
                colors: getColorSet(mention.color_code),
                post_id: mention.id// Get the color set based on color_code
            }));

            setMentions(mentionsWithColors);

            const commentCountPromises = mentionsWithColors.map((post) => {
                return axios
                    .get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/comments/comments_on_post/${post.id}/`, {
                        headers: {
                            Authorization: `Token ${token}`,
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

            Promise.all(commentCountPromises)
                .then((counts) => {
                    const commentCountsObject = {};
                    counts.forEach((countObj) => {
                        commentCountsObject[countObj.postId] = countObj.count;
                    });
                    setMentionsCommentCounts(commentCountsObject); // Update the mentions comment counts
                })
                .catch((error) => {
                    console.error('Error fetching comment counts:', error);
                });
        } catch (error) {
            console.error('Error fetching mentions:', error);
        }
    };


    useEffect(() => {
        fetchMentions();
    }, []);


    useEffect(() => {
        fetchConfessions();
    }, []);

    const getColorSet = (colorCode) => {
        const colorMap = {
            pink: ['#FC85BDB7', '#ff76b3'],
            blue: ['#89E7FFB7', '#76cfff'],
            red: ['#FF8989B7', '#FF7676FF'],
            yellow: ['#FFF189B7', '#ffef76'],
            purple: ['#AA89FFB7', '#9b76ff'],
            green: ['#88FD88B7', '#76fd76'],
        };

        return colorMap[colorCode] || colorMap['default']; // Provide a default color set if colorCode is not found
    };



    const formatTimeDifference = (confessionDate,mentionDate) => {
        const currentDate = new Date();
        const timeDifference = currentDate - new Date(confessionDate);

        if (timeDifference < 60000) { // Less than 1 minute
            return Math.floor(timeDifference / 1000) + " s";
        } else if (timeDifference < 3600000) { // Less than 1 hour
            return Math.floor(timeDifference / 60000) + " m";
        } else if (timeDifference < 86400000) { // Less than 1 day
            return Math.floor(timeDifference / 3600000) + " h";
        } else { // More than 1 day
            return Math.floor(timeDifference / 86400000) + " d";
        }
    };

    useEffect(() => {
        // Update window width on resize
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);


        const handleScroll = () => {
            setShowStickyNote(window.scrollY <= 0); // Show sticky note when scrolling up
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const getStickyNoteColor = (index) => {
        // Replace this logic with your color generation or predefined colors
        const colors = ['rgba(252,133,189,0.72)', 'rgba(137,231,255,0.72)', 'rgba(255,137,137,0.72)', 'rgba(255,241,137,0.72)', 'rgba(170,137,255,0.72)', 'rgba(136,253,136,0.72)',];
        return colors[index % colors.length];
    };
    const getStickyNoteColor1 = (index) => {
        // Replace this logic with your color generation or predefined colors
        const colors = ['#ff76b3', '#76cfff', '#FF7676FF', '#ffef76', '#9b76ff', '#76fd76',];
        return colors[index % colors.length];
    };
    const handleUnfriend = (friendshipId, friendName) => {
        // Send a PUT request to update the friendship status
        const apiUrl = `https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/friendships/${friendshipId}/`;

        axios
            .put(apiUrl, { status: 'unfriended' })
            .then((response) => {
                // Check if the PUT request was successful
                if (response.status === 200) {
                    // Remove the friend from the filteredFriends array
                    const updatedFilteredFriends = filteredFriends.filter((friend) => friend.fullName !== friendName);
                    setFilteredFriends(updatedFilteredFriends);
                } else {
                    console.error('Error unfriending friend:', response.statusText);
                }
            })
            .catch((error) => {
                console.error('Error unfriending friend:', error);
            });
    };

    const handleInputChangefriends = (e) => {
        const query = e.target.value;
        setSearchQueryfriends(query);
        filterFriends(query);
    };
    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    };
    const filterFriends = (query) => {
        const filtered = friends.filter(
            (friend) =>
                friend.fullName.toLowerCase().includes(query.toLowerCase()) ||
                friend.username.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredFriends(filtered);
    };
    const handleSettingsClick = () => {
        // Toggle the dropdown menu
        setShowDropdown(!showDropdown);
    };

    const handleAboutClick = () => {
        // Toggle the About options
        setShowAboutOptions(!showAboutOptions);
    };

    const handleLogout = () => {
        // Clear user-related data from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userDetails');



        // Reload the page
        window.location.reload();
    };


    const handleLikeDislike = (confessionId) => {
        const newLikeState = { ...likeState };
        newLikeState[confessionId] = !newLikeState[confessionId];
        setLikeState(newLikeState);
    };

    // Function to fetch friends data
    const fetchFriends = (userId) => {
        // Construct the URL with the user's ID
        const apiUrl = `https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/user-friends/${userId}/`;

        axios
            .get(apiUrl)
            .then((response) => {
                // Check if response.data is defined and is an array
                if (Array.isArray(response.data)) {
                    // Extract the list of friends from the response with a status of "accepted"
                    const friendsList = response.data
                        .filter((friendship) => friendship.status === 'accepted')
                        .map((friendship) => {
                            // Check if friendship object contains 'user' and 'friend' properties
                            if (friendship.user && friendship.friend) {
                                const friendUser =
                                    friendship.friend.id === userId ? friendship.user : friendship.friend;
                                // Check if friendUser object contains 'id', 'username', 'first_name', and 'last_name' properties
                                if (
                                    friendUser.id &&
                                    friendUser.username &&
                                    friendUser.first_name &&
                                    friendUser.last_name
                                ) {
                                    const fullName = friendUser.first_name + ' ' + friendUser.last_name;
                                    return {
                                        id: friendUser.id,
                                        username: friendUser.username,
                                        fullName,
                                        friendshipId: friendship.friendship_id, // Store the friendship_id
                                    };
                                } else {
                                    console.error('Error fetching friends: Invalid friendUser data', friendUser);
                                }
                            } else {
                                console.error('Error fetching friends: Invalid friendship data', friendship);
                            }
                        });

                    // Remove undefined items from the friendsList array
                    const filteredFriendsList = friendsList.filter((friend) => friend);

                    // Update the state with the list of friends
                    setFriends(filteredFriendsList);
                    // Also, initially set filteredFriends to the entire list
                    setFilteredFriends(filteredFriendsList);
                } else {
                    // Handle the case where response.data is not an array
                    console.error('Error fetching friends: Response data is not an array', response.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching friends:', error);
            });
    };



    // Fetch friends data when the component is mounted
    useEffect(() => {
        fetchUserId();
    }, [username]);



    const handleEditProfileClick = () => {
        // Step 2: Update the new state variables with current values
        setInitialName(newName);
        setInitialBio(newBio);
        setInitialBranch(newBranch);

        setShowEditProfileForm(true);
    };


    const handleEditProfileCancel = () => {
        setShowEditProfileForm(false);
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        // You can add code here to upload the selected profile picture to a server or display it on the page.
        setProfilePic(file);
    };

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleBioChange = (e) => {
        setNewBio(e.target.value);
    };

    const handleBranchChange = (e) => {
        setNewBranch(e.target.value);
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && settingsdropdownRef.current && !settingsdropdownRef.current.contains(event.target)) {
                // Click occurred outside the dropdown
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showDropdown]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showAboutOptions && aboutdropdownRef.current && !aboutdropdownRef.current.contains(event.target)) {
                // Click occurred outside the "About" dropdown
                setShowAboutOptions(false);
            }
        };

        if (showAboutOptions) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showAboutOptions]);

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

    useEffect(() => {
        if (searchQueryfriends.trim().length  >= 2) {
            setIsSearching(true);

            const cleanedQuery = searchQueryfriends.trim().toLowerCase().replace(/\s/g, '')  ;

            axios.get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/`)
                .then((response) => {
                    const filteredUsers = response.data.filter((user) =>
                        user.username.toLowerCase().replace(/\s/g, '').includes(cleanedQuery) ||
                        user.first_name.toLowerCase().replace(/\s/g, '').includes(cleanedQuery) ||
                        user.last_name.toLowerCase().replace(/\s/g, '').includes(cleanedQuery)
                    );

                    setSearchResults(filteredUsers);
                    setIsSearching(false);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setIsSearching(false);
                });
        } else {
            setSearchResults([]);
        }
    }, [searchQueryfriends ]);

    useEffect(() => {
        if (searchQuery.trim().length  >= 2) {
            setIsSearching(true);

            const cleanedQuery = searchQuery.trim().toLowerCase().replace(/\s/g, '')  ;

            axios.get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/`)
                .then((response) => {
                    const filteredUsers = response.data.filter((user) =>
                        user.username.toLowerCase().replace(/\s/g, '').includes(cleanedQuery) ||
                        user.first_name.toLowerCase().replace(/\s/g, '').includes(cleanedQuery) ||
                        user.last_name.toLowerCase().replace(/\s/g, '').includes(cleanedQuery)
                    );

                    setSearchResults(filteredUsers);
                    setIsSearching(false);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setIsSearching(false);
                });
        } else {
            setSearchResults([]);
        }
    }, [searchQuery ]);

    const toggleUserSelection = (user) => {
        const isAlreadySelected = selectedUsers.some((selectedUser) => selectedUser.id === user.id);
        const isUserInGroup = selectedGroup && selectedGroup.users.some((existingUser) => existingUser.id === user.id);

        if (!isUserInGroup && !isAlreadySelected) {
            // Add the user to selectedUsers if not already selected and not part of the group
            setSelectedUsers([...selectedUsers, user]);
        } else if (isAlreadySelected) {
            // Remove the user from selectedUsers if already selected
            const updatedUsers = selectedUsers.filter((selectedUser) => selectedUser.id !== user.id);
            setSelectedUsers(updatedUsers);
        }
        // You can add other conditions or handling based on your specific use case
    };

    const removeUserFromGroup = (user, isAddUserDropdown) => {
        const updatedUsers = selectedUsers.filter((selectedUser) => selectedUser.id !== user.id);
        setSelectedUsers(updatedUsers);

        let removedUserMessage = null;

        const updatedGroups = groups.map((group) => {
            if (selectedGroup && group.id === selectedGroup.id) {
                const updatedGroupUsers = group.users.filter((groupUser) => groupUser.id !== user.id);
                return { ...group, users: updatedGroupUsers };
            }
            return group;
        });

        setGroups(updatedGroups);

        const updatedSelectedGroup = selectedGroup ? updatedGroups.find((group) => group.id === selectedGroup.id) : null;
        setSelectedGroup(updatedSelectedGroup);

        if (!isAddUserDropdown) {
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            removedUserMessage = {
                content: `${user.first_name} ${user.last_name} has been removed from the bubble`,
                sender: 'system',
                timestamp: currentTime,
            };
        }

        if (removedUserMessage) {
            const groupId = selectedGroup ? selectedGroup.id : null;
            const updatedMessages = { ...messagesByGroup };
            const messages = updatedMessages[groupId] || [];
            updatedMessages[groupId] = [...messages, removedUserMessage];

            setMessagesByGroup(updatedMessages);
        }

        if (!isAddUserDropdown) {
            setshowchatRoomMenu(false);
        }
    };
    useEffect(() => {
        if (selectedGroup && selectedGroup.id) {
            loadGroupMembers(selectedGroup.id);
        }
    }, [selectedGroup]);






    const createGroup = async () => {
        const currentUser = { id: 'your_current_user_id', name: 'Your Current User Name' };
        const newGroup = {
            name: groupName,
            picture: groupPicture ? URL.createObjectURL(groupPicture) : null,
            admin: currentUser,
        };

        try {
            // Step 1: Create the group
            const createGroupResponse = await axios.post('https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/groups/', newGroup, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`, // Assuming you store the token in local storage
                },
            });

            // Step 2: Add members to the group
            const groupId = createGroupResponse.data.id;
            const addMembersPromises = selectedUsers.map(async (user) => {
                const addMemberResponse = await axios.post('https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/memberships/', {
                    user: user.id, // Assuming each user object in selectedUsers has an 'id' property
                    group: groupId,
                }, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`,
                    },
                });
                return addMemberResponse.data;
            });

            await Promise.all(addMembersPromises);

            // Step 3: Update the local state or perform any other actions if needed
            setGroups([...groups, createGroupResponse.data]);
            setSelectedUsers([]);
            setGroupName('');
            setGroupPicture(null);
            setShowCreateGroupForm(false);
            setShowbubbleDropdown(false);

            // Optional: Load the members for the created group
            loadGroupMembers(groupId);
        } catch (error) {
            // Handle errors appropriately
            console.error('Error creating group:', error);
        }
    };
    const createbubble = () => {
        setGroupName('');
        setGroupPicture(null);
        setSearchQuery('');
        setShowCreateGroupForm(true);
    };
    const handleBubbleClick = () => {
        setShowbubbleDropdown(true);
        setShowCreateGroupForm(false);
        setSelectedUsers([]);
        setSearchQuery('');
    };


    const formatMatchingText = (text, query) => {
        if (typeof text !== 'string' || typeof query !== 'string') {
            return text; // Return original text if either text or query is not a string
        }

        const regex = new RegExp(`(${query})`, 'gi');
        return text.split(regex).map((part, index) =>
            regex.test(part) ? <b key={index}>{part}</b> : part
        );
    };


    const handlecancelbubbleDropdown= () => {
        setShowbubbleDropdown(false);
        setSelectedUsers([]);
        setSearchQuery('');

    };
        const handlecancelGroupForm= () => {
        setShowCreateGroupForm(false);
            setSearchQuery('');
    };

    const openChatRoom = (group) => {
        // console.log("Clicked group:", group);

        if (group && group.id) {
            // console.log("Valid group. ID:", group.id);

            setSelectedGroup(group);
            setShowChatRoom(true);

            // Additional logic or actions you want to perform when opening a chat room

            // Load members for the selected group
            loadGroupMembers(group.id);
        } else {
            console.error("Invalid group or group ID is undefined");
            // Handle the error or provide feedback to the user
        }
    };


    const closeChatRoom = () => {
        setShowChatRoom(false);
        setSelectedGroup(null); // Reset selected group when chat room is closed
        setShowPollLayout(false);
        setPollQuestion('');
        setPollOptions(['', '']);
        setSelectedImage(null);
        setSelectedGif(null);
    };



    const closeChatRoomMenu = (group) => {
        setGroupPicture(selectedGroup.picture);
        setGroupName(selectedGroup.name);
        setshowchatRoomMenu(false);

    };


    const handleMessageSend = () => {
        if (selectedGroup) {
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let contentToSend = message;
            let imgcontent = null;
            let gifcontent = null;
            let pollContent = null;
            // Check if a poll is active and add it to the message content
            if (showPollLayout && pollQuestion && pollOptions.length > 1) {
                const currentTime = new Date();
                const endTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
                setPollEndTime(endTime);

                pollContent = {
                    pollQuestion: pollQuestion,
                    pollOptions: pollOptions
                };
                initializeVotes();
            }
            if (selectedImage) {
                imgcontent = selectedImage;
                contentToSend = message;
                setSelectedImage(null); // Clear the selected image after sending
            }
            if (selectedGif) {
                gifcontent = selectedGif;
                contentToSend = message;
                setSelectedGif(null); // Clear the selected GIF after sending
            }


            const newMessage = {
                content: contentToSend.trim(),
                imgcontent:selectedImage,
                gifcontent:selectedGif,
                pollContent: pollContent,
                sender: '', // Set sender information as required
                timestamp: currentTime,
            };

            const groupId = selectedGroup.id;

            // Create a copy of the messages for the selected group
            const updatedMessages = { ...messagesByGroup };
            const messages = updatedMessages[groupId] || [];
            updatedMessages[groupId] = [...messages, newMessage];

            // Update messagesByGroup state
            setMessagesByGroup(updatedMessages);
            setMessage('');
            setShowPollLayout(false); // Hide the poll layout after sending the message
            setPollQuestion('');
            setPollOptions(['', '']); // Reset poll question and options
        }
    };


    const scrollToBottom = () => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [showChatRoom]);

    useEffect(() => {
        scrollToBottom();
    }, [messagesByGroup]);

    const handlePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // Update the group picture state with the selected file
                setGroupPicture(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

// Function to save the updated group details
    const updateGroupDetails = () => {
        const updatedGroups = groups.map((group) => {
            if (group.id === selectedGroup.id) {
                return {
                    ...group,
                    name: groupName,
                    picture: groupPicture,
                };
            }
            return group;
        });

        // Update the selectedGroup state with the modified group details
        const updatedSelectedGroup = updatedGroups.find(group => group.id === selectedGroup.id);
        setSelectedGroup(updatedSelectedGroup);

        setGroups(updatedGroups);
        setshowchatRoomMenu(false);
    };
    const handlesearchQuerychatroom = (e) => {
        setSearchQuerychatroom(e.target.value);
    };

    const filteredUsers = selectedGroup && selectedGroup.members
        ? selectedGroup.members.filter((user) => {
            // console.log('Filtered User:', user);
            const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
            return fullName.includes(searchQuerychatroom.toLowerCase());
        })
        : [];




    const deleteGroup = () => {
        // Filter out the selected group from the groups list
        const updatedGroups = groups.filter((group) => group.id !== selectedGroup.id);
        setGroups(updatedGroups);

        // Clear the selectedGroup state
        setSelectedGroup(null);
        // Reset the selectedGroup state and related states
        setSelectedGroup(null);
        setSelectedUsers([]);
        setGroupName('');
        setGroupPicture(null);
        setMessageList([]); // Clear the message list

        // Close the chat room menu after deleting the group
        setshowchatRoomMenu(false);
        setShowChatRoom(false);
    };

    const openAddUserDropdown = () => {
        setShowAddUserDropdown(true);
        setSearchQuery('');
    };

    const closeAddUserDropdown = () => {
        setShowAddUserDropdown(false);
        setSearchQuery('');
    };

    const addUsersToGroup = () => {
        const newUsersToAdd = selectedUsers.filter((user) => {
            return !selectedGroup.users.some((existingUser) => existingUser.id === user.id);
        });

        const updatedGroups = groups.map((group) => {
            if (group.id === selectedGroup.id) {
                return {
                    ...group,
                    users: [...group.users, ...newUsersToAdd],
                };
            }
            return group;
        });

        setGroups(updatedGroups);

        const updatedSelectedGroup = {
            ...selectedGroup,
            users: [...selectedGroup.users, ...newUsersToAdd],
        };
        setSelectedGroup(updatedSelectedGroup);

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const addedUsersMessages = newUsersToAdd.map((user) => ({
            content: `${user.first_name} ${user.last_name} has been added to the bubble`,
            sender: 'system',
            timestamp: currentTime,
            userId: user.id, // Optionally, you can include user ID in the message for future reference
        }));

        const groupId = selectedGroup.id;
        const updatedMessages = { ...messagesByGroup };
        const messages = updatedMessages[groupId] || [];
        updatedMessages[groupId] = [...messages, ...addedUsersMessages];

        setMessagesByGroup(updatedMessages);

        setSelectedUsers([]);
        setShowAddUserDropdown(false);
        setshowchatRoomMenu(false);
        setSearchQuery('');
    };

    const handlePollQuestionChange = (event) => {
        setPollQuestion(event.target.value);
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...pollOptions];
        updatedOptions[index] = value;
        setPollOptions(updatedOptions);
    };

    const removeOption = (index) => {
        const updatedOptions = [...pollOptions];
        updatedOptions.splice(index, 1);
        setPollOptions(updatedOptions);
    };

    const addNewOption = () => {
        setPollOptions([...pollOptions, '']);
    };
    const initializeVotes = () => {
        const initialVotes = pollOptions.map(() => 0);
        setPollVotes(prevVotes => ({
            ...prevVotes,
            [messagesByGroup[selectedGroup?.id]?.length || 0]: initialVotes // Store votes for a particular poll ID
        }));
    };


    const handleOptionVote = (pollIndex, optionIndex) => {
        setPollVotes(prevVotes => {
            const updatedVotes = { ...prevVotes };
            if (updatedVotes[pollIndex]) {
                updatedVotes[pollIndex] = [...updatedVotes[pollIndex]]; // Create a copy of the votes array
                updatedVotes[pollIndex][optionIndex] += 1; // Update the specific option's vote count
            }
            return updatedVotes;
        });
    };

    const handleCancelPoll = () => {
        setShowPollLayout(false);
        setPollQuestion('');
        setPollOptions(['', '']);
        setSelectedImage(null);
        setShowGifPopup(false);
        setSearchgifQuery(''); // Clear search query when closing popup
        setGifData([]); // Clear fetched GIFs when closing popup
        setOffset(0);
    };
    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const fetchGifs = async () => {
        try {
            const API_KEY = 'xeCVW6hURo4ov1BJfQjtgUenGgfcRzOF';
            const response = await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchgifQuery}&offset=${offset}`);
            setGifData((prevData) => [...prevData, ...response.data.data]);
            setOffset((prevOffset) => prevOffset + response.data.data.length);
        } catch (error) {
            console.error('Error fetching GIFs:', error);
        }
    };

    const fetchTrendingGifs = async () => {
        try {
            const API_KEY = 'xeCVW6hURo4ov1BJfQjtgUenGgfcRzOF';
            const response = await axios.get(`https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&offset=${offset}`);
            setGifData((prevData) => [...prevData, ...response.data.data]);
            setOffset((prevOffset) => prevOffset + response.data.data.length);
        } catch (error) {
            console.error('Error fetching trending GIFs:', error);
        }
    };

    useEffect(() => {
        if (showGifPopup) {
            setSearchgifQuery(''); // Clear search query when opening the popup
            setOffset(0); // Reset offset when opening the popup
            fetchTrendingGifs();
        }
    }, [showGifPopup]);

    useEffect(() => {
        if (showGifPopup && searchgifQuery.trim() !== '') {
            fetchGifs();
        } else if (showGifPopup) {
            fetchTrendingGifs();
        }
    }, [searchgifQuery, showGifPopup]);

    const handleGifClick = () => {
        setShowGifPopup(true);
    };

    const handleClosegifPopup = () => {
        setShowGifPopup(false);
        setSearchgifQuery(''); // Clear search query when closing popup
        setGifData([]); // Clear fetched GIFs when closing popup
        setOffset(0); // Reset offset when closing popup
    };

    const handleScroll = () => {
        const { current } = gifPopupRef;
        if (current && current.scrollTop + current.clientHeight >= current.scrollHeight - 20) {
            // Fetch more GIFs when scrolled to the bottom (with 20px buffer)
            fetchGifs();
        }
    };
    const handleGifSelection = (gifUrl) => {
        setSelectedGif(gifUrl); // Set the selected GIF URL
        setShowGifPopup(false); // Close the GIF popup
    };

    const handleTapStart = (index) => {
        timeoutRef.current = setTimeout(() => {
            setShowmessagemenu(true);
            setDeletemsg(index);
        }, 500); // Set timeout for 1 second (1000 milliseconds)
    };

    const handleTapEnd = () => {
        clearTimeout(timeoutRef.current);
    };

    const handleDeletemsg = (message, index) => {
        const updatedMessages = { ...messagesByGroup };
        const messages = updatedMessages[selectedGroup?.id] || [];

        // Check if the message to be deleted is a poll
        if (messages[index].pollContent) {
            const deletedPollVotes = pollVotes[index]; // Store votes of the deleted poll
            const updatedVotes = { ...pollVotes };

            // Remove the deleted poll's votes from the votes object
            delete updatedVotes[index];

            // Shift votes of subsequent polls up by one index to maintain association
            for (let i = index + 1; i < messages.length; i++) {
                if (updatedVotes[i]) {
                    updatedVotes[i - 1] = updatedVotes[i];
                    delete updatedVotes[i];
                }
            }

            // Update the state with the modified votes object
            setPollVotes(updatedVotes);
        }

        // Remove the deleted message from the messages array
        const updatedMessagesForGroup = messages.filter((msg, i) => i !== index);
        updatedMessages[selectedGroup?.id] = updatedMessagesForGroup;

        // Update the messages state
        setMessagesByGroup(updatedMessages);
        setShowmessagemenu(false); // Hide the delete dropdown after deleting
    };


    const handleCopyMsg = (msgContent) => {
        // Extract the 'content' field from the provided message content
        const contentToCopy = msgContent.content;

        navigator.clipboard.writeText(contentToCopy)
            .then(() => {
                setShowCopyPopup(true); // Show copy success popup
                setTimeout(() => {
                    setShowCopyPopup(false); // Hide copy success popup after 1 second
                }, 1000);
            })
            .catch((error) => {
                console.error('Unable to copy: ', error);
            });

        setShowmessagemenu(false); // Hide the copy dropdown after copying
    };





    const handleReplyMsg = (msgContent) => {
        // Logic to handle replying to a message
        // Example: Implement reply functionality, like opening a reply interface or sending a reply message
        setShowmessagemenu(false); // Hide the reply dropdown after replying
    };


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
            <img src={menuIcon} alt="Settings" style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer',width: '30px', height: '30px' }} onClick={handleSettingsClick} /><br/>
            <p style={{fontFamily: 'Helvetica', fontSize: '30px'}}><b>{userData ? userData.fullName : 'Loading...'}</b> </p>
            <div style={{ position: 'relative' }}>
                <img src={userData ? userData.profile_picture : 'Loading...'} style={{boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',width: '70px', height: '70px', borderRadius: '50%', position:'absolute', top: '-60px', right: '14px'}}/>
                <br/>
                <p style={{fontFamily: 'Helvetica',position:'absolute', top: '-35px'}}>{userData ? userData.branch : 'Loading...'}</p>
                <p style={{fontFamily: 'Helvetica',position:'absolute', top: '-10px'}}>{userData ? userData.bio : 'Loading...'}</p>
            </div>

            {showDropdown && (
                <div
                    ref={settingsdropdownRef}
                    style={{overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'50%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)'}}>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                        <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'black' }} >🎉Upcoming updates🎉</li>
                        {/* onClick={}*/}
                        <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'black' }} onClick={handleEditProfileClick}>Edit profile</li>
                        {showEditProfileForm && (
                            <form   style={{  overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'99%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)' }}>
                                {/* Edit Profile Form */}
                                <img src={CrossIcon} style={{position: 'absolute', top: '20px', right: '20px', height:'20px',width:'20px'}} onClick={handleEditProfileCancel}/>

                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/*"
                                    onChange={handleProfilePicChange}
                                    style={{
                                        display: 'none',

                                    }}
                                />
                                <label htmlFor="fileInput">
                                    <img
                                        src={profilePic || user.image}
                                        style={{
                                            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                            marginBottom: '15px',
                                            fontFamily: 'Helvetica',
                                            width: '150px',
                                            height: '150px',
                                            background: 'rgba(255, 252, 255, 0.5)',
                                            border: '1px solid #ccc',
                                            fontSize: '10px',
                                            zIndex: '1',
                                            borderRadius: '50%',
                                            position:'absolute',
                                            left: '50%',
                                            top: '16%',
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    />
                                </label>

                                <input
                                    type="text"
                                    placeholder="Branch"
                                    value={newBranch}
                                    onChange={handleBranchChange}
                                    style={{boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                        marginBottom: '15px',
                                        position:'relative',
                                        left: '50%',
                                        top: '38%',
                                        transform: 'translate(-50%, -50%)',
                                        paddingLeft: '18px',
                                        fontFamily: 'Helvetica',
                                        width: 'calc(90% - 25px)',
                                        height: '40px',
                                        background: 'rgba(255, 255, 255, 0.5)',
                                        border: '1px solid #ccc',
                                        fontSize: '18px',
                                        zIndex: '1',
                                        borderRadius: '11px',}}
                                />
                                <textarea
                                    placeholder="Bio"
                                    value={newBio}
                                    onChange={handleBioChange}
                                    style={{boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                        marginBottom: '15px',
                                        paddingLeft: '18px',
                                        position:'relative',
                                        left: '50%',
                                        top: '45%',
                                        transform: 'translate(-50%, -50%)',
                                        fontFamily: 'Helvetica',
                                        width: 'calc(90% - 25px)',
                                        height: '100px',
                                        background: 'rgba(255, 255, 255, 0.5)',
                                        border: '1px solid #ccc',
                                        fontSize: '18px',
                                        zIndex: '1',
                                        borderRadius: '11px',}}
                                />
                                 Include the code to submit the updated profile information
                                <button type="submit"
                                        style={{  position:'relative', left: '50%', top: '45%',
                                            transform: 'translate(-50%, -50%)',boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',color:'#fff', fontFamily: 'Helvetica', width: '100px', height: '40px',background:'#000',border:'1px solid #ccc',fontSize:'18px',borderRadius: '11px',}}
                                >Save</button>
                            </form>
                        )}
                        <li style={{ padding: '15px', cursor: 'pointer', fontFamily: 'Helvetica', fontSize: '18px', color: 'black' }} onClick={handleAboutClick}>About</li>
                        {showAboutOptions && (
                            <div
                                ref={aboutdropdownRef}
                                style={{overflowY:'scroll',position: 'relative', top: '0px', left: 0, height:'200px',width: '100%', backgroundColor: 'white',  zIndex: '100',borderRadius:'11px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)'}}>
                                <ul style={{ listStyle: 'none', padding: '0' }}>
                                    <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'black' }} onClick= {switchToAboutPage}  >About RV Connect</li>
                                    <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'black' }} >Guildlines</li>
                                    <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'black' }} >Terms of Use</li>
                                    <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'black' }} >Privacy Policy</li>
                                </ul>
                            </div>
                        )}
                        <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'red' }} onClick={handleLogout}>Log out</li>
                        {/* Add other options here */}
                    </ul>
                </div>
            )}


            <div style={{ display: 'flex', marginTop: '20px' , justifyContent: 'space-between',width: '100%', }}>

                <div
                    className={`tab ${activeTab === 'confessions' ? 'active' : ''}`}
                    onClick={() => handleTabClick('confessions')}
                    style={{
                        flex: 1,
                        fontFamily: 'Helvetica', fontSize: '20px',
                        textAlign: 'center',
                        color: activeTab === 'confessions' ? '#000' : '#c0c0c0',
                    }}

                >
                    <b>Gossips</b>
                </div>

                <div
                    className={`tab ${activeTab === 'mentioned' ? 'active' : ''}`}
                    onClick={() => handleTabClick('mentioned')}
                    style={{
                        flex: 1,
                        fontFamily: 'Helvetica', fontSize: '20px',
                        textAlign: 'center',
                        color: activeTab === 'mentioned' ? '#000' : '#c0c0c0',
                    }}

                >
                    <b>Mentions</b>
                </div>
                {/*{activeTab === 'mentioned' && mentionedConfessionId && (*/}
                {/*    // Fetch and display the mentioned confession content using mentionedConfessionId*/}
                {/*    <div>*/}
                {/*        /!* Fetch and display mentioned confession content using mentionedConfessionId *!/*/}
                {/*    </div>*/}
                {/*)}*/}
                <div
                    className={`tab ${activeTab === 'bubbles' ? 'active' : ''}`}
                    onClick={() => handleTabClick('bubbles')}
                    style={{
                        flex: 1,
                        fontFamily: 'Helvetica', fontSize: '20px',
                        textAlign: 'center',
                        color: activeTab === 'bubbles' ? '#000' : '#c0c0c0',}}
                >
                    <b>Bubbles</b>
                </div>

                <div
                    className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
                    onClick={() => handleTabClick('friends')}
                    style={{
                        flex: 1,
                        fontFamily: 'Helvetica', fontSize: '20px',
                        textAlign: 'center',
                        color: activeTab === 'friends' ? '#000' : '#c0c0c0',}}
                >
                    <b>Friends</b>
                </div>
            </div>
            <hr />
            <br/>

            {activeTab === 'confessions' && (
                <>
                    {confessions.slice().reverse().map((confession, index) => {
                        // Get the color set based on the color code from the API response
                        const colorSet = getColorSet(confession.color_code);

                        // Destructure the color set to get the two colors
                        const [backgroundColor, backgroundColor1] = colorSet || [];

                        return (
                            <div key={index} style={{
                                borderRadius: '11px',
                                borderBottomLeftRadius: '30px',
                                background: backgroundColor || getStickyNoteColor(index),
                                position: 'relative',
                                bottom: '10px',
                                zIndex: 'auto',
                                border: '0px solid #000',
                                padding: '10px',
                                margin: '10px',
                                maxWidth: '100%',
                                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                whiteSpace: 'pre-line', /* Allow text to wrap to the next line */
                                overflow: 'hidden', /* Hide overflowing text */
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

                                    <button
                                        onClick={() => handlepostmenuClick(confession.id)}
                                        style={{ backgroundColor: 'transparent', border: 'none' }}
                                    >
                                        <img src={postmenuIcon} style={{ position: 'relative', cursor: 'pointer', width: '25px', height: '25px', marginRight: '10px' }} />
                                    </button>

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
                {formatCommentCount(confessionsCommentCounts[confession.id] || 0)}
              </span>
                                    </button>
                                    {isCommentDropdownOpen && selectedConfessionComments.length > 0 && (
                                        <div ref={commentDropdownRef}
                                            style={{
                                            bottom: 60,
                                            overflowY: 'scroll',
                                            position: 'fixed',
                                            left: 0,
                                            height: '43%',
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
                                                        }}><b>{comment.user_commented.first_name + comment.user_commented.last_name}</b></p>
                                                        <p style={{
                                                            fontFamily: 'Helvetica',
                                                            color: '#8f8f8f',
                                                            position: 'relative',
                                                            top: '-10px',
                                                            fontSize: '17px',
                                                        }}>@{comment.user_commented.username}</p>
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
                <span dangerouslySetInnerHTML={{
                    __html: confession.content.replace(
                        /@(\w+)/g,
                        (match, username) => `<b>@${username}</b>`
                    )
                }} />
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
                                    background: backgroundColor1 || getStickyNoteColor1(index),
                                    clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 75%)',
                                    zIndex: '0',
                                    transform: 'rotate(-83.6deg)',
                                    transformOrigin: 'bottom left',
                                }}
                                />
                            </div>
                        );
                    })}
                </>
            )}
            {/* Bottom Navigation */}
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


            {activeTab === 'mentioned' && (
                <>
                    {mentions.slice().reverse().map((mention, index) => (
                        <div key={index} style={{
                            borderRadius: '11px',
                            borderBottomLeftRadius: '30px',
                            background: mention.colors[0], // Use the first color from the colors array
                            position: 'relative',
                            bottom: '10px',
                            zIndex: 'auto',
                            border: '0px solid #000',
                            padding: '10px',
                            margin: '10px',
                            maxWidth: '100%',
                            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                            whiteSpace: 'pre-line', /* Allow text to wrap to the next line */
                            overflow: 'hidden', /* Hide overflowing text */
                            overflowWrap: 'break-word',
                            display: selectedConfessionId === mention.id || !isCommentDropdownOpen ? 'block' : 'none',
                        }}>
                            <div style={{ zIndex: '1', fontFamily: 'Helvetica', position: 'relative' }}>
                                <p style={{
                                    position: 'absolute',
                                    top: '-15px',
                                    right: '4px',
                                    color: '#000',
                                    fontFamily: 'Helvetica'
                                }}>{formatTimeDifference(mention.date_posted)}</p>

                                <button
                                    onClick={() => handlepostmenuClick(mention.id)}
                                    style={{ backgroundColor: 'transparent', border: 'none' }}
                                >
                                    <img src={postmenuIcon} style={{ position: 'relative', cursor: 'pointer', width: '25px', height: '25px', marginRight: '10px' }} />
                                </button>

                                {showpostDropdown && (
                                    <div  ref={dropdownRef}
                                          style={{overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'50%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)'}}>
                                        <ul style={{ listStyle: 'none', padding: '0' }}>
                                            <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'#ff4b4b' }}  onClick={() => handleDeleteConfession(mention.id)}><b>Delete</b></li>
                                        </ul>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleLikeDislike(mention.id)}
                                    style={{ backgroundColor: 'transparent', border: 'none', }}
                                >
                                    {likeState[mention.id] ? <img src={likeicon} style={{ height: '25px', width: '25px' }} /> : <img src={dislikeicon} style={{ height: '25px', width: '25px' }} />}
                                </button>
                                <button
                                    onClick={() => toggleCommentDropdown(mention)}
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                    }}>
                                    <img src={commenticon} style={{ height: '25px', width: '25px' }} />
                                    <span style={{ marginLeft: '4px', fontFamily: 'Helvetica', position: 'relative', top: '-7px' }}>
                            {formatCommentCount(mentionsCommentCounts[mention.id] || 0)}
                        </span>
                                </button>
                                {isCommentDropdownOpen && selectedConfessionComments.length > 0 && (
                                    <div ref={commentDropdownRef}
                                        style={{
                                        bottom: 60,
                                        overflowY: 'scroll',
                                        position: 'fixed',
                                        left: 0,
                                        height: '43%',
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
                                                    }}>
                                                        <b>{comment.user_commented.first_name + comment.user_commented.last_name}</b>
                                                    </p>
                                                    <p style={{
                                                        fontFamily: 'Helvetica',
                                                        color: '#8f8f8f',
                                                        position: 'relative',
                                                        top: '-10px',
                                                        fontSize: '17px',
                                                    }}>@{comment.user_commented.username}</p>
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
                            <span dangerouslySetInnerHTML={{
                                __html: mention.content.replace(
                                    /@(\w+)/g,
                                    (match, username) => `<b>@${username}</b>`
                                )
                            }} />
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
                                background: mention.colors[1], // Use the second color from the colors array
                                clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 75%)',
                                zIndex: '0',
                                transform: 'rotate(-83.6deg)',
                                transformOrigin: 'bottom left',
                            }}
                            />
                        </div>
                    ))}
                </>
            )}


            {/* Bottom Navigation */}
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



                    {activeTab === 'bubbles' && (
                        <>
                            <button onClick={handleBubbleClick} style={{ position:'fixed',bottom:'80px',right:'15px', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',backgroundImage: 'linear-gradient(to right, #ff00cc, #3390FF, #ff00cc)', border: 'none', borderRadius:'50%' ,height:'80px',width:'82px'}}>
                                <img src={bubbleicon} style={{ height: '70px', width: '70px',backgroundColor:'#fff',borderRadius:'50%',alignItems: 'center',justifyContent:'center',display:'flex'}} />
                            </button>

                            {showbubbleDropdown && (

                                <div
                                    style={{overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'99%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)'}}>

                                    {selectedUsers.length > 0 && (
                                        <div style={{ borderBottom: '1px solid #ccc', padding: '0px 0', position: 'relative', top: '70px', overflowX: 'auto' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '8px', marginLeft:'10px'}}>
                                                {selectedUsers.map((selectedUser) => (
                                                    <div key={selectedUser.id} style={{ position:'relative',display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '35px' }}>
                                                        <img
                                                            src={selectedUser.image} // Replace with the actual image field
                                                            style={{ width: '40px', height: '40px', borderRadius: '100%', marginBottom: '5px' ,border:'none'}}
                                                        />

                                                        <button
                                                            onClick={() => removeUserFromGroup(selectedUser)} // Add your remove function here
                                                            style={{ position: 'absolute', top: '0px', right: '-10px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                                                        >
                                                            <img src={CrossIcon} style={{ height: '12px', width: '12px' }}  />
                                                        </button>

                                                        <p style={{ fontFamily: 'Helvetica', color: '#8f8f8f', fontSize: '14px', textAlign: 'center' }}>
                                                            {selectedUser.first_name} {selectedUser.last_name}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="text"
                                        placeholder="Search users"
                                        value={searchQuery}
                                        onChange={handleInputChange}
                                        style={{
                                            paddingLeft: '18px',
                                            fontFamily: 'Helvetica',
                                            width: 'calc(100% - 22px)',
                                            height: '40px',
                                            background: '#efefef',
                                            border: '1px solid #ccc',
                                            fontSize: '20px',
                                            borderRadius: '11px',
                                            marginTop:'70px',
                                        }}
                                    />

                                    {/* Display search results */}
                                    {isSearching ? (
                                        <p>Searching...</p>
                                    ) : (
                                        searchResults.map((user) => (
                                            <div key={user.id}
                                                 onClick={() => toggleUserSelection(user)}
                                                 style={{
                                                     display: 'flex',
                                                     alignItems: 'center',
                                                     borderBottom: '1px solid #ccc',
                                                     padding: '0px 0',

                                                 }}>
                                                <img
                                                    src={user.image} // Replace with the actual image field
                                                    alt={user.username} // Add alt text
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        marginRight: '10px',
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        flex: '1',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <div>
                                                        <p
                                                            style={{
                                                                fontFamily: 'Helvetica',
                                                                color: '#000',
                                                                fontSize: '17px',
                                                                position: 'relative',
                                                                top: '4px',
                                                                margin: '10px',
                                                            }}
                                                        >
                                                            <b>@{formatMatchingText(user.username, searchQuery)}</b>
                                                        </p>
                                                        <p
                                                            style={{
                                                                fontFamily: 'Helvetica',
                                                                color: '#8f8f8f',
                                                                position: 'relative',
                                                                top: '-2px',
                                                                fontSize: '17px',
                                                                margin: '10px',
                                                            }}
                                                        >
                                                            {formatMatchingText(user.first_name, searchQuery)} {formatMatchingText(user.last_name, searchQuery)}
                                                        </p>
                                                    </div>
                                                    {selectedUsers.some((selectedUser) => selectedUser.id === user.id) &&
                                                        <button style={{ marginRight:'30px',border:'none',background:'transparent', }}>
                                                            <img src={TickIcon} style={{position: 'absolute',  height:'20px',width:'20px'}} />
                                                        </button>}

                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {showCreateGroupForm && (

                                        <div

                                            style={{overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'99%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)'}}>
                                            <input
                                                type="file"
                                                id="fileInput"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    // Handle file upload and set groupPicture state accordingly
                                                    const file = e.target.files[0];
                                                    // Handle file upload logic here
                                                    setGroupPicture(file);
                                                }}
                                                style={{
                                                    display: 'none',

                                                }}
                                            />
                                            <label htmlFor="fileInput">
                                                <img
                                                    style={{
                                                        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                                        marginBottom: '15px',
                                                        fontFamily: 'Helvetica',
                                                        width: '150px',
                                                        height: '150px',
                                                        background: 'rgba(255, 252, 255, 0.5)',
                                                        border: '1px solid #ccc',
                                                        fontSize: '10px',
                                                        zIndex: '1',
                                                        borderRadius: '50%',
                                                        position:'absolute',
                                                        left: '50%',
                                                        top: '16%',
                                                        transform: 'translate(-50%, -50%)'
                                                    }}
                                                />
                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Enter group name"
                                                value={groupName}
                                                onChange={(e) => setGroupName(e.target.value)}
                                                style={{boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                                    marginBottom: '15px',
                                                    position:'relative',
                                                    left: '50%',
                                                    top: '38%',
                                                    transform: 'translate(-50%, -50%)',
                                                    paddingLeft: '18px',
                                                    fontFamily: 'Helvetica',
                                                    width: 'calc(90% - 25px)',
                                                    height: '40px',
                                                    background: 'rgba(255, 255, 255, 0.5)',
                                                    border: '1px solid #ccc',
                                                    fontSize: '18px',
                                                    zIndex: '1',
                                                    borderRadius: '11px',}}
                                            />

                                            <button  onClick={createGroup}
                                                     style={{  position:'relative', left: '50%', top: '45%',
                                                         transform: 'translate(-50%, -50%)',boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',color:'#fff', fontFamily: 'Helvetica', width: '100px', height: '40px',background:'#000',border:'1px solid #ccc',fontSize:'18px',borderRadius: '11px',}}
                                            >Create</button>
                                            <button onClick={handlecancelGroupForm}
                                                    style={{border:'none',background:'transparent',position:'absolute',top:'10px',left:'15px'}}>
                                                <img src={CrossIcon} style={{position: 'absolute',  height:'15px',width:'15px'}} />
                                            </button>
                                        </div>
                                    )}

                                    {selectedUsers.length > 0 && (
                                        <button onClick={createbubble}
                                                style={{border: 'none',background:'transparent',fontSize:'18px',fontFamily:'Helvetica',position:'absolute',top:'10px',right:'15px'}}
                                        ><b>Create Bubble</b></button>
                                    )}
                                    <button onClick={handlecancelbubbleDropdown}
                                            style={{border:'none',background:'transparent',position:'absolute',top:'10px',left:'15px'}}>
                                        <img src={CrossIcon} style={{position: 'absolute',  height:'15px',width:'15px'}} />
                                    </button>
                                </div>
                            )}
                            <div style={{display:'flex',flexWrap:'wrap' ,alignItems: 'center',justifyContent:'space-evenly',marginTop:'-30px',marginLeft:'-10px'}}>
                                {groups.map((group, index) => (
                                    <div key={index} style={{ textAlign:'center',marginTop:'30px',marginLeft:'10px',}}>
                                        {group.picture && <img src={group.picture} style={{height:'100px',width:'100px', borderRadius:'50%',boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',}}
                                                               onClick={() => openChatRoom(group)} />}
                                        <p style={{textAlign:'center',width: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',fontSize:'18px',fontFamily: 'Helvetica',}} onClick={() => openChatRoom(group)}><b>{group.name}</b></p>
                                    </div>

                                ))}
                            </div>

                            {showChatRoom && selectedGroup && (
                                <div
                                    style={{overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'99%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)'}}>

                                    <div style={{ position: 'fixed',backgroundColor: '#fff', left:'0px',top:'8px',width:'100%',borderTopRightRadius:'20px',borderTopLeftRadius:'20px',borderBottom:'1px solid #ccc'}}>
                                        <button onClick={closeChatRoom} style={{ border: 'none', background: 'transparent', position: 'absolute', top: '30px', left: '0px' }}>
                                            <img src={CrossIcon} style={{ height: '15px', width: '15px' }} />
                                        </button>
                                        {/* Group picture and name */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '10px',marginLeft:'30px', }}>
                                            {/* Replace selectedGroup.picture with the actual image */}
                                            <img src={selectedGroup.picture} style={{ height: '50px', width: '50px', borderRadius: '50%' ,boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)'}} />
                                            <p style={{fontFamily: 'Helvetica', marginLeft: '10px',width: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',fontSize:'20px' }}><b>{selectedGroup.name}</b></p>
                                        </div>
                                        <button onClick={() => openChatRoomMenu(selectedGroup)} style={{ border: 'none', background: 'transparent', position: 'absolute', top: '25px', right: '15px' }}>
                                        <img src={menuIcon} style={{ height: '30px', width: '30px' }} />
                                        </button>

                                    </div>

                                    {showchatRoomMenu && (

                                        <div

                                            style={{overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'99%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)'}}>
                                            <input
                                                type="file"
                                                id="fileInput"
                                                accept="image/*"
                                                onChange={handlePictureChange}
                                                style={{
                                                    display: 'none',

                                                }}
                                            />
                                            <label htmlFor="fileInput">
                                                <img
                                                    src={groupPicture}
                                                    style={{
                                                        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                                        fontFamily: 'Helvetica',
                                                        width: '150px',
                                                        height: '150px',
                                                        background: 'rgba(255, 252, 255, 0.5)',
                                                        border: '1px solid #ccc',
                                                        fontSize: '10px',
                                                        zIndex: '1',
                                                        borderRadius: '50%',
                                                        position:'relative',
                                                        left: '50%',
                                                        top: '16%',
                                                        transform: 'translate(-50%, -50%)'
                                                    }}
                                                />
                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Enter group name"
                                                value={groupName}
                                                onChange={(e) => setGroupName(e.target.value)}
                                                style={{boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                                    marginBottom: '15px',
                                                    position:'relative',
                                                    left: '50%',
                                                    top: '15%',
                                                    transform: 'translate(-50%, -50%)',
                                                    paddingLeft: '18px',
                                                    fontFamily: 'Helvetica',
                                                    width: 'calc(90% - 25px)',
                                                    height: '40px',
                                                    background: 'rgba(255, 255, 255, 0.5)',
                                                    border: '1px solid #ccc',
                                                    fontSize: '18px',
                                                    zIndex: '1',
                                                    borderRadius: '11px',}}
                                            />

                                            <button onClick={updateGroupDetails}
                                                    style={{float:'right',  position:'absolute', right: '15px', top:'10px',boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',color:'#fff', fontFamily: 'Helvetica', width: '100px', height: '40px',background:'#000',border:'1px solid #ccc',fontSize:'18px',borderRadius: '11px',}}
                                            >Save</button>
                                            <button  onClick={closeChatRoomMenu}
                                                     style={{border:'none',background:'transparent',position:'absolute',top:'10px',left:'15px'}}>
                                                <img src={CrossIcon} style={{position: 'absolute',  height:'15px',width:'15px'}} />
                                            </button>
                                            <div style={{display:'flex',justifyContent:'space-between',position:'relative',top:'15%'}}>
                                                <button onClick={openAddUserDropdown}
                                                        style={{  marginLeft:'20px',boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',color:'#fff', fontFamily: 'Helvetica', width: '100px', height: '40px',background:'#000',border:'1px solid #ccc',fontSize:'18px',borderRadius: '11px',}}
                                                >Add users</button>

                                                <button  onClick={deleteGroup}
                                                         style={{float:'right',border:'none',background:'transparent',color:'#ff4141',fontSize:'18px', fontFamily: 'Helvetica', marginRight:'20px',}}>
                                                    <b>Delete group</b>
                                                </button>
                                            </div>

                                            <input
                                                type="text"
                                                placeholder="Search users"
                                                value={searchQuerychatroom}
                                                onChange={handlesearchQuerychatroom}
                                                style={{
                                                    position:'relative',
                                                    paddingLeft: '18px',
                                                    fontFamily: 'Helvetica',
                                                    width: 'calc(100% - 22px)',
                                                    height: '40px',
                                                    background: '#efefef',
                                                    border: '1px solid #ccc',
                                                    fontSize: '20px',
                                                    borderRadius: '11px',
                                                    top:'20%',
                                                }}
                                            />

                                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-evenly', position: 'relative', top: '25%', left: '0px', gap: '40px', }}>
                                                {filteredUsers.map((selectedUser) => (
                                                    <div key={selectedUser.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <img
                                                            src={selectedUser.image} // Replace with the actual image field
                                                            style={{ width: '40px', height: '40px', borderRadius: '100%', marginBottom: '5px', border: 'none' }}
                                                        />

                                                        <button
                                                            onClick={() => removeUserFromGroup(selectedUser)} // Add your remove function here
                                                            style={{ position: 'absolute', top: '0px', right: '0px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                                                        >
                                                            <img src={CrossIcon} style={{ height: '12px', width: '12px' }} />
                                                        </button>

                                                        {selectedUser.first_name && selectedUser.last_name ? (
                                                            <p style={{ fontFamily: 'Helvetica', color: '#8f8f8f', fontSize: '14px', textAlign: 'center', width: '70px' }}>
                                                                {selectedUser.first_name} {selectedUser.last_name}
                                                            </p>
                                                        ) : (
                                                            <p style={{ fontFamily: 'Helvetica', color: '#8f8f8f', fontSize: '14px', textAlign: 'center', width: '70px' }}>
                                                                Unknown User
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}

                                            </div>

                                            {showAddUserDropdown && (
                                                <div
                                                    style={{overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'99%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)'}}>

                                                    {selectedUsers.length > 0 && (
                                                        <div style={{ borderBottom: '1px solid #ccc', padding: '0px 0', position: 'relative', top: '70px', overflowX: 'auto' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '8px', marginLeft:'10px'}}>
                                                                {filteredUsers.map((selectedUser) => (
                                                                    <div key={selectedUser.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                        <img
                                                                            src={selectedUser.image} // Replace with the actual image field
                                                                            style={{ width: '40px', height: '40px', borderRadius: '100%', marginBottom: '5px', border: 'none' }}
                                                                        />

                                                                        <button
                                                                            onClick={() => removeUserFromGroup(selectedUser)}
                                                                            style={{ position: 'absolute', top: '0px', right: '0px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                                                                        >
                                                                            <img src={CrossIcon} style={{ height: '12px', width: '12px' }} />
                                                                        </button>

                                                                        <p style={{ fontFamily: 'Helvetica', color: '#8f8f8f', fontSize: '14px', textAlign: 'center', width: '70px' }}>
                                                                            {`${selectedUser.first_name} ${selectedUser.last_name}`}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <input
                                                        type="text"
                                                        placeholder="Search users"
                                                        value={searchQuery}
                                                        onChange={handleInputChange}
                                                        style={{
                                                            paddingLeft: '18px',
                                                            fontFamily: 'Helvetica',
                                                            width: 'calc(100% - 22px)',
                                                            height: '40px',
                                                            background: '#efefef',
                                                            border: '1px solid #ccc',
                                                            fontSize: '20px',
                                                            borderRadius: '11px',
                                                            marginTop:'70px',
                                                        }}
                                                    />

                                                    {/* Display search results */}
                                                    {isSearching ? (
                                                        <p>Searching...</p>
                                                    ) : (
                                                        searchResults.map((user) => (
                                                            <div key={user.id}
                                                                 onClick={() => toggleUserSelection(user)}
                                                                 style={{
                                                                     display: 'flex',
                                                                     alignItems: 'center',
                                                                     borderBottom: '1px solid #ccc',
                                                                     padding: '0px 0',

                                                                 }}>
                                                                <img
                                                                    src={user.image} // Replace with the actual image field
                                                                    alt={user.username} // Add alt text
                                                                    style={{
                                                                        width: '40px',
                                                                        height: '40px',
                                                                        borderRadius: '50%',
                                                                        marginRight: '10px',
                                                                    }}
                                                                />
                                                                <div
                                                                    style={{
                                                                        flex: '1',
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                    }}
                                                                >
                                                                    <div>
                                                                        <p
                                                                            style={{
                                                                                fontFamily: 'Helvetica',
                                                                                color: '#000',
                                                                                fontSize: '17px',
                                                                                position: 'relative',
                                                                                top: '4px',
                                                                                margin: '10px',
                                                                            }}
                                                                        >
                                                                            <b>@{formatMatchingText(user.username, searchQuery)}</b>
                                                                        </p>
                                                                        <p
                                                                            style={{
                                                                                fontFamily: 'Helvetica',
                                                                                color: '#8f8f8f',
                                                                                position: 'relative',
                                                                                top: '-2px',
                                                                                fontSize: '17px',
                                                                                margin: '10px',
                                                                            }}
                                                                        >
                                                                            {formatMatchingText(user.first_name, searchQuery)} {formatMatchingText(user.last_name, searchQuery)}
                                                                        </p>
                                                                    </div>
                                                                    {selectedGroup && selectedGroup.users.some((existingUser) => existingUser.id === user.id) ? (
                                                                        <button disabled style={{ marginRight: '10px', border: 'none', background: 'transparent',fontFamily:'Helvetica',color:'#8a8a8a',fontSize:'12px' }}>
                                                                            <b>(Already added to the bubble)</b>
                                                                        </button>
                                                                    ) : (
                                                                        <button onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            toggleUserSelection(user);
                                                                        }} style={{ marginRight: '30px', border: 'none', background: 'transparent' }}>
                                                                            {selectedUsers.some((selectedUser) => selectedUser.id === user.id) && (
                                                                                <img src={TickIcon} style={{ position: 'absolute', height: '20px', width: '20px' }} />
                                                                            )}
                                                                        </button>
                                                                    )}

                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                    {selectedUsers.length > 0 && (
                                                        <button  onClick={addUsersToGroup}
                                                                 style={{border: 'none',background:'transparent',fontSize:'18px',fontFamily:'Helvetica',position:'absolute',top:'10px',right:'15px'}}
                                                        ><b>Add</b></button>
                                                    )}
                                                    <button onClick={closeAddUserDropdown}
                                                            style={{border:'none',background:'transparent',position:'absolute',top:'10px',left:'15px'}}>
                                                        <img src={CrossIcon} style={{position: 'absolute',  height:'15px',width:'15px'}} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}


                                    {/* Chat content */}


                                    <div style={{ position: 'fixed', bottom: '-5px',left:'-10px', width: '100%', backgroundColor: '#fff', padding: '10px',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)',borderRadius:'25px' }}>

                                        {selectedImage && (
                                            <div style={{ position: 'relative' , }}>
                                                <div style={{ display: 'inline-block', position: 'relative',width:'40%',left:'30%' }}>
                                                    <img
                                                        src={selectedImage}
                                                        alt="Selected Image"
                                                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '11px' }}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            setSelectedImage(null); // Clear selected image on button click
                                                        }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '0px',
                                                            right: '0px',
                                                            backgroundColor: '#fff',
                                                            border: 'none',
                                                            padding: '5px',
                                                            cursor: 'pointer',
                                                            borderTopRightRadius: '11px',
                                                            borderBottomLeftRadius:'20px',
                                                            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                                        }}
                                                    >
                                                        <img
                                                            src={CrossIcon}
                                                            alt="Close"
                                                            style={{ width: '20px', height: '20px' }}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {selectedGif && (
                                            <div style={{ position: 'relative',textAlign: 'center', }}>
                                                <div style={{ display: 'inline-block', position: 'relative' }}>
                                                    <img
                                                        src={selectedGif}
                                                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '11px' }}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            setSelectedGif(null); // Clear selected image on button click
                                                        }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '0px',
                                                            right: '0px',
                                                            backgroundColor: '#fff',
                                                            border: 'none',
                                                            padding: '5px',
                                                            cursor: 'pointer',
                                                            borderTopRightRadius: '11px',
                                                            borderBottomLeftRadius:'20px',
                                                            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                                        }}
                                                    >
                                                        <img
                                                            src={CrossIcon}
                                                            alt="Close"
                                                            style={{ width: '20px', height: '20px' }}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {showGifPopup && (
                                            <div ref={gifPopupRef} onScroll={handleScroll} className="gif-popup" style={{overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'99%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)'}}>
                                                <button onClick={handleClosegifPopup} style={{ position: 'absolute', top: '10px', right: '5px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                    <img src={CrossIcon} alt="Close" style={{ width: '18px', height: '18px' }} />
                                                </button>
                                                <input type="text" value={searchgifQuery} onChange={(e) => setSearchgifQuery(e.target.value)} placeholder="Powered by GIPHY"
                                                       style={{paddingLeft: '18px',
                                                           fontFamily: 'Helvetica',
                                                           width: 'calc(100% - 22px)',
                                                           height: '40px',
                                                           background: '#efefef',
                                                           border: '1px solid #ccc',
                                                           fontSize: '20px',
                                                           borderRadius: '11px',
                                                           position:'relative',
                                                           top:'40px'}} />
                                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',margin:'5px',marginTop:'50px' }}>
                                                    {gifData.map((gif) => (
                                                        <div key={gif.id} style={{ width: '48%', marginBottom: '10px', }}>
                                                            <img src={gif.images.fixed_height.url} alt={gif.title} onClick={() => handleGifSelection(gif.images.fixed_height.url)}
                                                                 style={{ width: '100%', borderRadius: '11px' }} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/*{selectedReplyMsg && (*/}

                                        {/*    <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '8px', marginBottom: '10px',  width: 'calc(100% - 40px)', marginLeft:'10px',fontFamily: 'Helvetica'}}>*/}
                                        {/*        <p>{selectedReplyMsg.content}</p>*/}
                                        {/*        /!* Any other details you want to display *!/*/}
                                        {/*    </div>*/}
                                        {/*)}*/}

                                        {message.length > 0 || (pollQuestion.length > 0 && pollOptions.every(option => option.trim() !== ''))   || selectedImage || selectedGif ? (
                                            <button
                                                onClick={handleMessageSend}
                                                style={{
                                                    right: '40px',
                                                    position: 'absolute',
                                                    padding: '18px 10px',
                                                    background: 'transparent',
                                                    color: '#000',
                                                    border: 'none',
                                                    fontFamily: 'Helvetica',
                                                    fontSize: '22px',
                                                }}
                                            >

                                                <b>Send</b>
                                            </button>
                                        ) : (

                                            <div style={{ position: 'fixed', right: '40px', bottom: '0px', transform: 'translateY(-50%)' }}>
                                                {!showPollLayout && (
                                                    <div>

                                                        <label htmlFor="fileInput">
                                                            <img src={GalleryIcon}  style={{ width: '28px', height: '28px',marginRight:'10px' }} />
                                                        </label>
                                                        <input
                                                            id="fileInput"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageSelect}
                                                            style={{ display: 'none' }}
                                                        />
                                                        <img src={GifIcon} onClick={handleGifClick} style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                                                        <img src={PollIcon} onClick={() => setShowPollLayout(true)} style={{ width: '30px', height: '30px' }}  />
                                                    </div>)}
                                            </div>
                                        )}


                                        {!showPollLayout ? (
                                            <textarea
                                                type="text"
                                                placeholder="Message..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                rows={Math.max(message.split('\n').length + 1, message.length > 25 ? Math.ceil(message.length / 25) : 1)}
                                                style={{ width: 'calc(100% - 130px)', padding: '8px',borderRadius: '25px' ,height:'auto',fontSize:'18px',resize:'none',marginLeft:'10px',paddingRight:'100px'}}
                                            />
                                        ) : (
                                            <div>
                            <textarea
                                type="text"
                                placeholder="Write your poll question here:"
                                value={pollQuestion}
                                onChange={handlePollQuestionChange}
                                rows={Math.max(pollQuestion.split('\n').length + 1, pollQuestion.length > 25 ? Math.ceil(message.length / 25) : 1)}
                                style={{ width: 'calc(100% - 130px)', padding: '8px',borderRadius: '25px' ,height:'auto',fontSize:'18px',resize:'none',marginLeft:'10px',paddingRight:'100px',marginBottom:'10px'}}

                            />
                                                <div>
                                                    {pollOptions.map((option, index) => (
                                                        <div key={index}>
                                        <textarea
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            style={{ bottom:'5px',position: 'relative', zIndex: '1',backgroundColor: 'transparent',resize: 'none', marginLeft: '25px',border: '1px solid grey',borderRadius:'11px',outline: 'none', lineHeight:'1.5',width: 'calc(100% - 80px)',height: '30px', fontSize: '20px' , fontFamily:'Helvetica'}}
                                        />
                                                            {index >= 2 && (
                                                                <button onClick={() => removeOption(index)} style={{backgroundColor:'transparent',border: 'none',position:'relative',bottom:'17px'}}><img src={CrossIcon} alt="Close" style={{ width: '12px', height: '12px' }} /></button>
                                                            )}
                                                        </div>

                                                    ))}
                                                    <button onClick={addNewOption}
                                                            style={{ bottom:'5px', color:'rgba(33,33,33,0.77)', position: 'relative', zIndex: '1',backgroundColor: 'transparent',resize: 'none', marginLeft: '25px',border: '1px dashed grey',borderRadius:'11px',outline: 'none', lineHeight:'1.5',width: 'calc(100% - 75px)',height:'35px', fontSize: '20px' , fontFamily:'Helvetica'}}
                                                    ><b>Add Option</b></button>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',position:'relative',bottom:'13px' }}>
                                                        <p style={{ color: 'rgba(33, 33, 33, 0.77)', position:'relative',left:'27px',fontSize: '16px', fontFamily: 'Helvetica' }}>Ends in 24h</p>
                                                        <button onClick={handleCancelPoll}
                                                                style={{color:'rgba(33,33,33,0.77)',backgroundColor:'transparent',border: 'none',position:'relative',right:'45px',fontSize: '16px' , fontFamily:'Helvetica', float:'right'}}
                                                        ><b>Remove poll</b></button>
                                                    </div>

                                                    {!selectedGif && !selectedImage && (
                                                        <div style={{ position: 'relative', left: '30px', bottom:'0px', transform: 'translateY(-50%)' }}>
                                                            <label htmlFor="fileInput">
                                                                <img src={GalleryIcon}  style={{ width: '28px', height: '28px' }} />
                                                            </label>
                                                            <input
                                                                id="fileInput"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleImageSelect}
                                                                style={{ display: 'none' }}
                                                            />
                                                            <img src={GifIcon} onClick={handleGifClick} style={{ width: '30px', height: '30px', marginLeft:'10px' }} />
                                                        </div>)}
                                                </div>

                                            </div>
                                        )}

                                    </div>


                                    {showCopyPopup && (
                                        <div  style={{bottom:'100px',position: 'fixed', left: '50%', transform: 'translateX(-50%)',zIndex:'1000' }}>
                                            <div style={{textAlign: 'center', width:'130px', color: '#000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.2)',backgroundColor:'rgb(255,255,255)',borderRadius:'10px',padding:'2px',fontFamily: 'Helvetica',fontSize:'16px'}} className="copy-popup">
                                                <p>Message copied!</p>
                                            </div>
                                        </div>
                                    )}


                                    <div  style={{top:'90px',marginBottom:'170px', padding: '10px', flex: '1', overflowY: 'auto',position:'relative',zIndex:'-1', }}>
                                        <div style={{ textAlign: 'center', marginBottom: '20px', color: '#000',backgroundColor:'#f0f0f0',borderRadius:'10px',padding:'15px',fontFamily: 'Helvetica',fontSize:'18px' }}>
                                            <img src={lockicon} style={{ width: '18px', height: '18px', marginRight: '5px' }} />
                                            Messages are end to end encrypted.
                                        </div>
                                        {messagesByGroup[selectedGroup?.id]?.map((msg, index) => (

                                            <div key={index}
                                                 onTouchStart={() => handleTapStart(index)}
                                                 onTouchEnd={handleTapEnd}
                                                 style={{
                                                     fontFamily: 'Helvetica',
                                                     borderRadius: '10px',
                                                     padding:'5px',
                                                     clear: 'both',
                                                     overflow: 'hidden',
                                                     marginLeft: msg.sender === '' ? 'auto' : '0',
                                                     marginRight: msg.sender === '' ? '0' : 'auto',
                                                     wordWrap: 'break-word',
                                                     fontSize: '18px',
                                                     backgroundColor: msg.sender === 'system' ? '#f0f0f0' : (msg.sender === '' ? '#85ff9a' : '#f0f0f0'),
                                                     maxWidth:msg.sender === 'system' ?'100%':'70%',
                                                     marginBottom: '8px',
                                                     color: '#000',

                                                 }}>

                                                <div>
                                                    {msg.imgcontent && (
                                                        <div>
                                                            <img src={msg.imgcontent}  style={{ width: '40%', maxHeight: '200px',borderRadius:'10px' }} />
                                                            <br/>
                                                        </div>
                                                    )}
                                                    {msg.gifcontent && (
                                                        <div>
                                                            <img src={msg.gifcontent}  style={{ maxWidth: '100%', maxHeight: '200px',borderRadius:'10px' }} />
                                                            <br/>
                                                        </div>
                                                    )}
                                                    {msg.pollContent && (
                                                        <div>
                                                            <p><b>{msg.pollContent.pollQuestion}</b></p>
                                                            {msg.pollContent.pollOptions.map((option, optionIndex) => (
                                                                <div style={{ display: 'flex' }} key={optionIndex}>
                                                                    <button
                                                                        style={{ boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)',marginBottom:'10px',textAlign:'left',bottom:'5px',position: 'relative', zIndex: '1',backgroundColor: 'transparent',resize: 'none', marginLeft: '0px',border: '1px solid grey',borderRadius:'11px',outline: 'none', lineHeight:'1.5',width: 'calc(100% - 50px)',height: '30px', fontSize: '20px' , fontFamily:'Helvetica'}}
                                                                        onClick={() => handleOptionVote(index, optionIndex)}
                                                                        disabled={msg.pollEndTime <= new Date()} // Disable voting if poll ended
                                                                    >
                                                                        {option}
                                                                    </button>
                                                                    {pollVotes[index] && (
                                                                        <span  style={{ position: 'relative', left: '10px', fontSize: '18px' }}>
                                                            <b>{pollVotes[index][optionIndex]}</b>
                                                             </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            {msg.pollEndTime <= new Date() && <p style={{ textAlign: 'center' }}><b>The poll has ended.</b></p>}
                                                        </div>
                                                    )}

                                                    {msg.content && (
                                                        <div>
                                                            <p>{msg.content}</p>
                                                        </div>
                                                    )}


                                                    <span style={{ fontSize: '12px', color: '#484848', marginTop: '3px', fontFamily: 'Helvetica' }}>{msg.timestamp}</span>

                                                </div>


                                                {showmessagemenu && deletemsg === index && (

                                                    <div>
                                                        <ul style={{ listStyle: 'none', padding: '0px',display:'flex',justifyContent:'space-evenly',backgroundColor:'rgba(255,255,255,0.41)',borderRadius:'25px', boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.2)',width:'165px',marginBottom:'5px' }}>
                                                            <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'#ff4b4b' }}  onClick={() => handleDeletemsg(message, index)}>
                                                                <img src={deleteIcon}  style={{ width: '25px', height: '25px', }} /></li>
                                                            {msg.content &&(
                                                                <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'#ff4b4b' }}  onClick={()=>handleCopyMsg(msg)}>
                                                                    <img src={copyIcon}  style={{ width: '25px', height: '25px', }} /></li>
                                                            )}

                                                            {/*<li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'#ff4b4b' }}  onClick={() => handleReplyMsg(msg)}>*/}
                                                            {/*    <img src={replyIcon}  style={{ width: '25px', height: '25px', }} /></li>*/}

                                                        </ul>
                                                    </div>
                                                )}

                                            </div>
                                        ))}
                                        <div ref={bottomRef} />
                                    </div>
                                </div>

                            )}
                        </>
                    )}


            {activeTab === 'friends' && (
                <>
                    <div >

                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQueryfriends}
                            onChange={handleInputChangefriends}
                            style={{paddingLeft:'18px', fontFamily: 'Helvetica', width:'calc(100% - 22px)', height: '40px',background:'#efefef',border:'1px solid #ccc',fontSize:'20px',borderRadius: '11px',}}

                        />
                        {filteredFriends.map((friend, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc', padding: '0px 0' }}>
                                <img src={friend.image} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                                <div style={{ flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontFamily: 'Helvetica', color: '#000', fontSize: '17px', position: 'relative', top: '4px', margin: '10px' }}><b>{friend.fullName}</b></p>
                                        <p style={{ fontFamily: 'Helvetica', color: '#8f8f8f', position: 'relative', top: '-2px', fontSize: '17px', margin: '10px' }}>@{friend.username}</p>
                                    </div>
                                    <button style={{ fontFamily: 'Helvetica', backgroundColor: 'white', padding: '6px 10px', border: '1.2px solid #ccc', borderRadius: '10px', fontSize: '17px' }} onClick={() => handleUnfriend(friend.friendshipId)}><b>Unfriend</b></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

                </>
            )}



        </div>
    );
};

export default ProfilePage;