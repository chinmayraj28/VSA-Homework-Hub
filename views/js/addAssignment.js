document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('homework-form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const currentDate = new Date().toJSON().slice(0, 10);
        const subject = document.getElementById('subject').value;
        const assignmenth = document.getElementById('assignment-h').value;
        const assignmentd = document.getElementById('assignment-d').value;
        const assignmentdate = document.getElementById('assignment-date').value;
        const classNumber = document.getElementById('class').value;
        
        const data = {
            date: currentDate,
            subject: subject,
            assignment: {
                heading: assignmenth,
                details: assignmentd,
                dueDate: assignmentdate
            },
            class: classNumber
        };
        
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/submit', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status === 200) {
                Toastify({
                    text: "Successfully Posted!",
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
            } else {
                Toastify({
                    text: "Form submission failed!",
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

        xhr.onerror = function () {
            console.error('Network Error');
        };

        xhr.send(JSON.stringify(data));

        form.reset();
    });
});