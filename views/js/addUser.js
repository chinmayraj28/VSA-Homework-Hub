document.addEventListener('DOMContentLoaded', function() {
    const addUserButton = document.getElementById('add-user-button');
addUserButton.addEventListener('click', function() {
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;
    const newRole = document.getElementById('new-role').value;

    const data = {
        username: newUsername,
        password: newPassword,
        role: newRole
    };
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/adduser', true); 
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            Toastify({
                text: `User ${newUsername} added successfully`,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", 
                position: "center", 
                stopOnFocus: true, 
                style: {
                    background: "#0F9D58",
                },
                onClick: function(){} 
            }).showToast();
            const addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'));
            addUserModal.hide();
        } else {
            Toastify({
                text: `Error adding user: ${newUsername}`,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", 
                position: "center", 
                stopOnFocus: true, 
                style: {
                background: "#DB4437",
                },
                onClick: function(){} 
            }).showToast();
        }
    };

    xhr.onerror = function() {
        console.error('Network Error');
    };

    xhr.send(JSON.stringify(data));
});
});