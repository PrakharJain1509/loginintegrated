import getUserFromEmail from "./getUserFromEmail";

const pushUidToMainDB = async (email, uid ,branch, college, bio, photoURL) => {
    try {
        console.log(email);
        console.log(branch);
        console.log(college);
        const existingUser = await getUserFromEmail(email);
        // Send a POST request to your DRF API endpoint with the user information
        const response = await fetch(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/profile-pics/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "firebase_uid": uid,
                "profile_picture": photoURL,
                "branch": branch,
                "college": college,
                "user": existingUser["id"],
                "bio" : bio,
            }),
        });

        if (response.ok) {
            console.log('User profile saved successfully.');
        } else {
            console.log('Failed to save user profile.');
        }
    } catch (error) {
        console.error('Error saving user profile:', error);
    }
};

export default pushUidToMainDB;