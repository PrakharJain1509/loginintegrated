import getUserFromEmail from "./getUserFromEmail";

const getTokenFromEmail = async (email, fid) => {
    try {
        const userData = await getUserFromEmail(email);
        const response = await fetch(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/api-token-auth/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: String(userData.username),
                password: String(fid),
            }),
        });

        if (response.ok) {
            console.log('User profile saved successfully.');
            const data = await response.json();

            const token = data.token;

            localStorage.setItem('token', token);

            return token;
        }

        else {
            console.log('Failed to save user profile.');
            return null;
        }
    } catch (error) {
        console.error('Error saving user profile:', error);
        return null;
    }
};

export default getTokenFromEmail;