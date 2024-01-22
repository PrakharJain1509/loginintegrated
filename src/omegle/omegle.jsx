import React, { useEffect, useState } from 'react';
import {
    addDoc,
    collection,
    serverTimestamp,
    onSnapshot,
    query,
    where,
    orderBy,
    getDocs,
    deleteDoc,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { differenceInMinutes } from 'date-fns';
import './omegle.css';

const Omegle = () => {
    const navigate = useNavigate();

    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [groupId, setGroupId] = useState(null);
    const [id, setId] = useState(null);

    const messagesRef = collection(db, 'messages');

    const userDetails = localStorage.getItem('userDetails');
    const userData = JSON.parse(userDetails);

    useEffect(() => {
        const fetchRandomChat = async () => {
            const randomGroupId = await getGroupId();
            setGroupId(randomGroupId);

            const queryMessage = query(
                messagesRef,
                where('groupId', '==', randomGroupId),
                orderBy('createdAt', 'asc')
            );

            const unsubscribe = onSnapshot(queryMessage, (snapshot) => {
                let messagesArray = [];
                snapshot.forEach((doc) => {
                    messagesArray.push({ ...doc.data(), id: doc.id });
                });
                setMessages(messagesArray);
            });

            return () => {
                unsubscribe();
            };
        };

        fetchRandomChat();
    }, []); // Dependency array is empty to run only once on component mount

    const getGroupId = async () => {
        navigate('/randomChat');

        try {
            const response = await fetch(
                'https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/chatrooms/',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();

                if (data.length > 0) {
                    const firstGroupId = data[0].group_id;
                    console.log('Chat started successfully. First Group ID:', firstGroupId);
                    setId(data[0].id);
                    return firstGroupId;
                }
                else {
                    console.error('No chatrooms found');
                }
            } else {
                console.error('Failed to start chat:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching random chat:', error);
        }
    };

    const leaveChatRoom = async () => {
        try {
            // Deleting all messages from the group
            const groupMessagesQuery = query(messagesRef, where('groupId', '==', groupId));
            const groupMessagesSnapshot = await getDocs(groupMessagesQuery);

            const deleteMessagesPromises = groupMessagesSnapshot.docs.map(async (doc) => {
                await deleteDoc(doc.ref);
            });
            await Promise.all(deleteMessagesPromises);

            navigate('/startRandomChat');

            // Deleting the group
            const deleteGroupResponse = await fetch(
                `https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/chatrooms/${id}/`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!deleteGroupResponse.ok) {
                console.error('Failed to delete group:', deleteGroupResponse.statusText);
            }
        } catch (error) {
            console.error('Error leaving chat room:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newMessage === '') return;

        try {
            await addDoc(messagesRef, {
                text: newMessage,
                createdAt: serverTimestamp(),
                sender: auth.currentUser.email,
                groupId: groupId,
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error adding message:', error);
        }
    };

    return (
        <div className="chat-app">
            <h1>Chat App</h1>
            {messages.map((message) => (
                <div key={message.id} className={`message ${message.sender === userData.email ? 'person1' : 'person2'}`}>
                    {message.text}
                </div>
            ))}
            <form onSubmit={handleSubmit} action="" className="new-message-form">
                <input
                    type="text"
                    className="new-message-input"
                    placeholder="Type Your Message Here"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                />
                <button type="submit" className="send-button">
                    Send
                </button>
            </form>
            <button onClick={leaveChatRoom}>Leave Chat Room</button>
        </div>
    );
};

export default Omegle;
