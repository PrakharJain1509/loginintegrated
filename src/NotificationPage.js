import React, { useEffect, useState } from 'react';
import axios from 'axios';


const NotificationPage = ({ notifications, openMentionedConfession }) => {
    const [mentionedNotifications, setMentionedNotifications] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [senderDetails, setSenderDetails] = useState({});
    const [friendRequestNotifications, setFriendRequestNotifications] = useState([]);
    const [mergedNotifications, setMergedNotifications] = useState([]);


    const formatTimeDifference = (notificationTime) => {
        const currentTime = new Date();
        const timeDifference = currentTime - new Date(notificationTime);

        if (timeDifference < 60000) {
            return Math.floor(timeDifference / 1000) + ' s';
        } else if (timeDifference < 3600000) {
            return Math.floor(timeDifference / 60000) + ' m';
        } else if (timeDifference < 86400000) {
            return Math.floor(timeDifference / 3600000) + ' h';
        } else {
            return Math.floor(timeDifference / 86400000) + ' d';
        }
    };

    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.time) - new Date(a.time));

    const fetchMentionedPosts = async () => {
        try {
            const username = localStorage.getItem('username');

            if (username) {
                const response = await fetch(
                    `https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/api/mentioned-posts/${username}/`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('token')}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();

                    // Parse the date strings into Date objects
                    const mentionedPosts = data.map(post => ({
                        ...post,
                        time: new Date(post.date_posted),
                    }));

                    // Sort mentioned posts by time in descending order
                    const sortedMentionedPosts = mentionedPosts.sort((a, b) => b.time - a.time);

                    setMentionedNotifications(sortedMentionedPosts);
                } else {
                    // Handle error response
                }
            } else {
                console.error('Username not available in local storage');
            }
        } catch (error) {
            console.error('Error fetching mentioned posts:', error);
        }
    };

    useEffect(() => {
        fetchFriendRequests();
        fetchMentionedPosts();
    }, []);

    const fetchFriendRequests = async () => {
        try {
            const response = await fetch(
                'https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/friend-requests/received_requests/',
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                const pendingRequests = data.filter(notification => (
                    notification.status === 'pending' || notification.status === "('pending', 'Pending')"
                ));

                // Log the pending requests to check if they are sorted correctly

                // Fetch sender details for each pending request
                const requestsWithSenderNames = await Promise.all(
                    pendingRequests.map(async (request) => {
                        const senderName = await fetchSenderDetails(request.sender);
                        return {
                            ...request,
                            senderName,
                        };
                    })
                );

                // Set friendRequestNotifications with the pending friend requests
                setFriendRequestNotifications(requestsWithSenderNames);

                return requestsWithSenderNames;
            } else {
                // Handle error response
            }
        } catch (error) {
            console.error('Error:', error);
            // Return some default or error value, e.g., an empty array or an error message
            return [];
        }
    };

    const mergeAndSortNotifications = () => {
        const friendRequestNotificationsWithType = friendRequestNotifications.map((notification) => ({
            ...notification,
            type: 'friendRequest',
        }));

        const allNotifications = [...friendRequestNotificationsWithType];

        const sortedNotifications = allNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setMergedNotifications(sortedNotifications);
    };

    useEffect(() => {
        mergeAndSortNotifications();
    }, [friendRequestNotifications]);



    const fetchSenderDetails = async (senderId) => {
        try {
            const response = await fetch(
                `https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/${senderId}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                return `${data.first_name} ${data.last_name}`;
            } else {
                // Handle error response
            }
        } catch (error) {
            console.error('Error:', error);
            // Return some default or error value, e.g., an empty array or an error message
            return [];
        }
    };

    useEffect(() => {
        fetchFriendRequests()
            .then((data) => {
                // Filter and keep only pending friend requests
                const pendingRequests = data.filter((request) => request.status === 'pending');
                // Sort pending requests by timestamp in descending order
                const sortedPendingRequests = pendingRequests.sort((a, b) => {
                    const timeA = new Date(a.created_at);
                    const timeB = new Date(b.created_at);
                    return timeB - timeA;
                });
                // Store the sorted requests in state
                setFriendRequests(sortedPendingRequests);

                // Fetch sender details for each pending request
                const senderPromises = sortedPendingRequests.map((request) => {
                    // Extract the sender ID from the request object
                    const senderId = request.sender;
                    return fetchSenderDetails(senderId);
                });

                // Resolve all sender details promises
                Promise.all(senderPromises)
                    .then((senderData) => {
                        // Create a map of sender IDs to their details
                        const senderDetailsMap = {};
                        senderData.forEach((sender, index) => {
                            // Use the sender ID from the request to map to their details
                            const senderId = sortedPendingRequests[index].sender;
                            senderDetailsMap[senderId] = sender;
                        });
                        // Store the sender details map in state
                        setSenderDetails(senderDetailsMap);
                    })
                    .catch((error) => {
                        console.error('Error fetching sender details:', error);
                    });
            })
            .catch((error) => {
                console.error('Error fetching friend requests:', error);
            });
    }, []);




    const categorizeNotifications = (notifications) => {
        // Sort notifications by timestamp in descending order
        const sortedNotifications = [...notifications].sort((a, b) => {
            const timeA = new Date(a.time);
            const timeB = new Date(b.time);
            return timeB - timeA;
        });

        // Initialize empty arrays for each category
        const categorized = {
            today: [],
            yesterday: [],
            last7Days: [],
            last30Days: [],
        };

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 7);
        const last30Days = new Date(today);
        last30Days.setDate(today.getDate() - 30);

        // Iterate through sorted notifications and categorize them
        sortedNotifications.forEach((notification) => {
            const notificationTime = new Date(notification.time);
            if (notificationTime >= today) {
                categorized.today.push(notification);
            } else if (notificationTime >= yesterday) {
                categorized.yesterday.push(notification);
            } else if (notificationTime >= last7Days) {
                categorized.last7Days.push(notification);
            } else if (notificationTime >= last30Days) {
                categorized.last30Days.push(notification);
            }
        });

        return categorized;
    };



    const categorizedNotifications = categorizeNotifications(notifications);


    const handleAcceptFriendRequest = async (requestId) => {
        try {
            const response = await fetch(
                `https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/friend-requests/${requestId}/accept_request/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.ok) {
                // Request accepted successfully, remove the notification from the array
                setFriendRequestNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification.request_id !== requestId)
                );
            } else {
                // Handle error response
            }
        } catch (error) {
            // Handle fetch error
        }
    };

    const handleDeleteFriendRequest = async (requestId) => {
        try {
            const response = await fetch(
                `https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/friend-requests/${requestId}/reject_request/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.ok) {
                // Request deleted successfully, remove the notification from the array
                setFriendRequestNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification.request_id !== requestId)
                );
            } else {
                // Handle error response
            }
        } catch (error) {
            // Handle fetch error
        }
    };


    return (
        <div>
            <h2 style={{ fontFamily: 'Helvetica', fontSize: '28px' }}>Notifications</h2>

            {mentionedNotifications.length > 0 && (
                <div>
                    <h2 style={{ fontFamily: 'Helvetica', fontSize: '20px' }}>Mentioned Posts</h2>
                    {mentionedNotifications.map((mentionedPost) => (
                        <div
                            key={mentionedPost.id}  // Use a unique identifier like the mentioned post's ID
                            onClick={() => openMentionedConfession(mentionedPost.id)}
                            style={{
                                borderRadius: '50px',
                                background: '#ffffff',
                                border: '1px solid #e8e8e8',
                                boxShadow: '6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff',
                                position: 'relative',
                                top: '0',
                                zIndex: 'auto',
                                padding: '10px',
                                margin: '10px',
                                maxWidth: '100%',
                                whiteSpace: 'pre-line',
                                overflow: 'hidden',
                                overflowWrap: 'break-word',
                            }}
                        >
                            <div style={{ zIndex: '1', fontFamily: 'Helvetica', position: 'relative' }}>
                                <p
                                    style={{
                                        position: 'absolute',
                                        top: '-13px',
                                        right: '4px',
                                        color: '#000',
                                        fontFamily: 'Helvetica',
                                    }}
                                >
                                    {formatTimeDifference(mentionedPost.time)}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <p
                                        style={{
                                            fontFamily: 'Helvetica',
                                            position: 'relative',
                                            left: '27px',
                                            top: '0px',
                                            maxWidth: '80%',
                                        }}
                                    >
                                        Someone mentioned you in a post {/* Change here */}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {Object.keys(categorizedNotifications).map((category) => (
                categorizedNotifications[category].length > 0 && (
                    <div key={category}>
                        <h2 style={{ fontFamily: 'Helvetica', fontSize: '20px' }}>{category}</h2>
                        {categorizedNotifications[category].map((notification, index) => (
                            <div
                                key={index}
                                onClick={() => openMentionedConfession(notification.mentionedConfessionId)}
                                style={{
                                    borderRadius: '11px',
                                    // Add your styling for each notification here
                                }}
                            >
                                {/* Add your notification content here */}
                            </div>
                        ))}
                    </div>
                )
            ))}

            {friendRequestNotifications.length > 0 && (
                <div>
                    {friendRequestNotifications
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort friend requests by time
                        .map((notification, index) => (
                            <div
                                key={index}
                                // Handle the accept and delete actions when the buttons are clicked
                                style={{
                                    borderRadius: '50px',
                                    background: '#ffffff',
                                    border: '1px solid #e8e8e8',
                                    boxShadow: '6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff',
                                    position: 'relative',
                                    top: '0',
                                    zIndex: 'auto',
                                    padding: '10px',
                                    margin: '10px',
                                    maxWidth: '100%',
                                    whiteSpace: 'pre-line',
                                    overflow: 'hidden',
                                    overflowWrap: 'break-word',
                                }}
                            >
                                <div style={{ zIndex: '1', fontFamily: 'Helvetica', position: 'relative' }}>
                                    <p
                                        style={{
                                            position: 'absolute',
                                            top: '-13px',
                                            right: '4px',
                                            color: '#000',
                                            fontFamily: 'Helvetica',
                                        }}
                                    >
                                        {formatTimeDifference(notification.created_at)}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p
                                            style={{
                                                fontFamily: 'Helvetica',
                                                position: 'relative',
                                                left: '27px',
                                                top: '0px',
                                                maxWidth: '80%',
                                            }}
                                        >
                                            {`${notification.senderName} sent you a friend request`}
                                            <div style={{ display: 'flex' }}>
                                                <button onClick={() => handleAcceptFriendRequest(notification.request_id)}
                                                        style={{
                                                            fontFamily: 'Helvetica',
                                                            position: 'relative',
                                                            left: '0px',
                                                            top: '20px',
                                                            maxWidth: '87%',
                                                            display: 'inline-block',
                                                            width: '70px',
                                                            height: '25px',
                                                            background: '#000',
                                                            border: '1px solid #ccc',
                                                            color: '#fff',
                                                            fontSize: '11px',
                                                            borderRadius: '11px',
                                                            marginRight: '5px',
                                                            cursor: 'pointer',
                                                            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                                        }}>Accept</button>
                                                <button onClick={() => handleDeleteFriendRequest(notification.request_id)}
                                                        style={{
                                                            fontFamily: 'Helvetica',
                                                            position: 'relative',
                                                            left: '0px',
                                                            top: '20px',
                                                            maxWidth: '87%',
                                                            display: 'inline-block',
                                                            width: '70px',
                                                            height: '25px',
                                                            background: '#000',
                                                            border: '1px solid #ccc',
                                                            color: '#fff',
                                                            fontSize: '11px',
                                                            borderRadius: '11px',
                                                            marginRight: '5px',
                                                            cursor: 'pointer',
                                                            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                                        }}>Delete</button>
                                            </div>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default NotificationPage;
