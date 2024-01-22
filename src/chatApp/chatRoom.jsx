import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getUserGroups from '../config/Functions/userGroups';

import './styles.css';

const ChatRoom = () => {
    const navigate = useNavigate();
    const [dataList, setDataList] = useState([]);

    const fetchData = async () => {
        try {
            const userGroups = await getUserGroups();
            localStorage.setItem('userGroups', JSON.stringify(userGroups));
            setDataList(userGroups);
        } catch (error) {
            console.error('Error fetching user groups', error);
        }
    };

    useEffect(() => {
        // Fetch user groups and update state
        fetchData();
    }, []);

    const toggleChat = (item) => {
        navigate(`/chatApp`);
        localStorage.setItem('groupIDofCurrentGroup', item.group);
    };

    const refreshChatrooms = () => {
        // Remove 'userGroups' item from localStorage and trigger a re-fetch
        localStorage.removeItem('userGroups');
        fetchData();
    };

    const Card = ({ item }) => (
        <div className="group-card">
            <h2>Group {item.group}</h2>
            <p>
                <strong>ID:</strong> {item.id}, <strong>User:</strong> {item.user}
            </p>
            <button onClick={() => toggleChat(item)}>
                Open ChatROOM
            </button>
        </div>
    );

    const groups = dataList?.length ? (
        <div className="groups-container">
            {dataList.map((item) => (
                <Card key={item.id} item={item} />
            ))}
        </div>
    ) : null;

    const noGroups = (
        <div>
            <h2>Data List</h2>
            <p>No data found</p>
        </div>
    );

    return (
        <>
            <h1>Chat Room</h1>
            {dataList?.length ? groups : noGroups}
            <button onClick={refreshChatrooms}>Refresh</button>
        </>
    );
};

export default ChatRoom;