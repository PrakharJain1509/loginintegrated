import React, { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { redirect, useNavigate } from 'react-router-dom';
import { differenceInMinutes } from 'date-fns';

const ChatApp = () => {
    const navigate = useNavigate();

    const groupId = localStorage.getItem('groupIDofCurrentGroup');
    const [newMessage, setMessage] = useState('');
    const [messages, setMessages] = useState([]); // Fix variable name

    const messagesRef = collection(db, 'messages');

    useEffect(() => {
        console.log('Group ID:', groupId);

        const queryMessage = query(
            messagesRef,
            where('groupId', '==', groupId),
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
    }, [groupId]); // Include 'groupId' in the dependency array to re-run the effect when it changes


    let user = localStorage.getItem('userDetails');
    let userData = JSON.parse(user);

    const leaveChatRoom = () => {
        localStorage.removeItem('groupIDofCurrentGroup');
        navigate('/chatRoom');
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newMessage === '') return;

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            sender: auth.currentUser.displayName,
            groupId: groupId
        });
        setMessage('');
    }

    return (
        <div className="chat-app">
            <h1>Chat App</h1>
            {messages.map((message) => (
                <div key={message.id}>
                    {message.sender} : {message.text}
                </div>
            ))}
            <form onSubmit={handleSubmit} action="" className='new-message-form'>
                <input type="text" className='new-message-input' placeholder='Type Your Message Here' onChange={(e) => setMessage(e.target.value)} value={newMessage} />
                <button type='submit' className='send-button'>Send</button>
            </form>
            <button onClick={leaveChatRoom}>Leave Chat Room</button>
        </div>
    )
}

export default ChatApp;