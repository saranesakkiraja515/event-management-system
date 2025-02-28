const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Connect to MySQL Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'saranraja', // Replace with your password
    database: 'events'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ **Create an Event**
app.post('/createEvent', (req, res) => {
    console.log("Received Data:", req.body);
    const { eventName, eventDate, eventVenue } = req.body;

    if (!eventName || !eventDate || !eventVenue) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const sql = 'INSERT INTO events (event_name, event_date, event_venue) VALUES (?, ?, ?)';
    db.query(sql, [eventName, eventDate, eventVenue], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        console.log('Event Created:', result);
        res.json({ success: true, eventId: result.insertId });
    });
});

// ✅ **Get All Events**
app.get('/getEvents', (req, res) => {
    const sql = 'SELECT * FROM events';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// ✅ **Register for an Event**
app.post('/register', (req, res) => {
    const { eventId, userName, userEmail } = req.body;

    if (!eventId || !userName || !userEmail) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const sql = 'INSERT INTO registrations (event_id, user_name, user_email) VALUES (?, ?, ?)';
    db.query(sql, [eventId, userName, userEmail], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        res.json({ success: true });
    });
});

// ✅ **Get Registered Users for an Event**
app.get('/getRegisteredUsers/:eventId', (req, res) => {
    const { eventId } = req.params;
    const sql = 'SELECT user_name, user_email FROM registrations WHERE event_id = ?';

    db.query(sql, [eventId], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        res.json(results);
    });
});

// ✅ **Cancel an Event (Deletes Registrations Too)**
app.post('/cancelEvent', (req, res) => {
    const { eventId } = req.body;
    const sql = 'DELETE FROM events WHERE event_id = ?';

    db.query(sql, [eventId], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
