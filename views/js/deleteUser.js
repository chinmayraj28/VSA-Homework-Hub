document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.delete-user');

deleteButtons.forEach(button => {
button.addEventListener('click', function() {
const userName = this.getAttribute('data-user-username');
let d = {
    username: userName
}
const row = this.closest('tr');

var xhr = new XMLHttpRequest();
xhr.open('POST', `/deleteuser`, true);
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function() {
    if (xhr.status === 200) {
        Toastify({
            text: `Successfully Deleted user: ${userName}`,
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
        row.remove();
    } else {
        Toastify({
            text: `Error deleting user: ${userName}`,
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

xhr.send(JSON.stringify(d));
});
});
});