const getUserGroups = async () => {
    try {
        const parsedAccessToken = localStorage.getItem('token');
        const response = await fetch(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/user-groups/`, {
            method: 'GET',
            headers: {
                Authorization: `Token ${parsedAccessToken.token}`, // Use proper authorization header
            },
        });

        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                console.log('User Group retrieved successfully.');
                const userGroupsJSON = JSON.stringify(data);
                localStorage.setItem('userGroups', userGroupsJSON);
                return data; // Assuming the response is an array and you want the first user
            } else {
                console.log('No Groups found.');
            }
        } else {
            console.error('Unexpected response from server:', response);
            return null;
        }
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        return null;
    }
};

export default getUserGroups;