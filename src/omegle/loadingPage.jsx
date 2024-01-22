import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingPage = () => {
    const navigate = useNavigate();

    const startRandomChat = async () => {
        // Generate a random group_id for the chat room
        const group_id = String(Math.random().toString(36).substring(2, 20));

        // Check if the number of existing chat rooms is less than 10 before creating a new one
        const existingChatroomsResponse = await fetch('https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/chatrooms/');
        const existingChatrooms = await existingChatroomsResponse.json();

        if (existingChatrooms.length >= 10) {
            console.log('Cannot create more than 10 chat rooms.');
            return;
        }

        // Create a new chat room
        const response = await fetch('https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/chatrooms/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_id: group_id,
            }),
        });

        // Handle the response as needed (e.g., check for success or error)
        if (response.ok) {
            // Handle success
            console.log('Chat started successfully');
            navigate('/randomChat'); // Move this line inside the success block
        } else {
            // Handle error
            console.error('Failed to start chat:', response.statusText);
        }
    };

    return (
        <button onClick={startRandomChat}>Start Random Chat</button>
    );
};

export default LoadingPage;
