document.getElementById('createEventForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const eventName = document.getElementById('event_name').value;
    const eventDate = document.getElementById('event_date').value;
    const eventVenue = document.getElementById('event_venue').value;

    console.log("Sending Data:", { eventName, eventDate, eventVenue });

    fetch('http://localhost:3001/createEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName, eventDate, eventVenue })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Event created successfully!");
            document.getElementById('createEventForm').reset();
            loadEvents();
        } else {
            console.error("Server error:", data.message);
        }
    })
    .catch(error => console.error("Fetch error:", error));
});

function loadEvents() {
    fetch('http://localhost:3001/getEvents')
    .then(response => response.json())
    .then(events => {
        const eventsContainer = document.getElementById('eventsContainer');
        eventsContainer.innerHTML = '';

        events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.innerHTML = `
                <h3>${event.event_name}</h3>
                <p>${event.event_venue}</p>
                <p>Date: ${event.event_date}</p>
                <button onclick="registerForEvent(${event.event_id})">Register</button>
                <button onclick="cancelEvent(${event.event_id})">Cancel</button>
                <div class="registered-users" id="users-${event.event_id}">
                    <h4>Registered Users:</h4>
                    <ul id="user-list-${event.event_id}"></ul>
                </div>
            `;

            eventsContainer.appendChild(eventDiv);

            fetch(`http://localhost:3001/getRegisteredUsers/${event.event_id}`)
            .then(response => response.json())
            .then(users => {
                const userList = document.getElementById(`user-list-${event.event_id}`);
                userList.innerHTML = '';
                users.forEach(user => {
                    const userItem = document.createElement('li');
                    userItem.textContent = `${user.user_name} (${user.user_email})`;
                    userList.appendChild(userItem);
                });
            })
            .catch(error => console.error('Error fetching registered users:', error));
        });
    })
    .catch(error => console.error('Fetch error:', error));
}

function registerForEvent(eventId) {
    const userName = prompt('Enter your name:');
    const userEmail = prompt('Enter your email:');

    if (!userName || !userEmail) {
        alert("Please provide valid details!");
        return;
    }

    fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, userName, userEmail })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Registration Successful!");
            loadEvents();
        } else {
            console.error("Server error:", data.message);
        }
    })
    .catch(error => console.error("Fetch error:", error));
}

function cancelEvent(eventId) {
    fetch('http://localhost:3001/cancelEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadEvents();
        } else {
            console.error("Server error:", data.message);
        }
    })
    .catch(error => console.error("Fetch error:", error));
}

document.addEventListener('DOMContentLoaded', loadEvents);
