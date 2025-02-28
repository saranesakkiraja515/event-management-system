USE events;

CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_venue TEXT
);

CREATE TABLE registrations (
    reg_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT, 
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);
SELECT * FROM events;
SELECT * FROM registrations;



