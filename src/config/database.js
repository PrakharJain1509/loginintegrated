const admin = require('firebase-admin');
const mysql = require('mysql');

// Set up MySQL connection
const mysqlConfig = {
    host: 'p8u4DZxbX2UzaPO8hev0LDEUT0XcDM.mysql.pythonanywhere-services.com',
    user: 'p8u4DZxbX2UzaPO8',
    password: 'mukundprakharsarvagya',
    database: 'p8u4DZxbX2UzaPO8$RV_Connect'
};

const connection = mysql.createConnection(mysqlConfig);

// Authenticate user and insert data into MySQL
async function processUser(uid) {
    try {
        const userRecord = await admin.auth().getUser(uid);

        // Insert data into MySQL
        const sql = 'INSERT INTO users (uid, email) VALUES (?, ?)';
        const values = [userRecord.uid, userRecord.email];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Error inserting data into MySQL:', error);
            } else {
                console.log('Data inserted into MySQL:', results);
            }

            // Close MySQL connection
            connection.end();
        });
    } catch (error) {
        console.error('Error fetching user from Firebase:', error);
    }
}

// Example usage
const userId = 'some-firebase-user-id';
processUser(userId);