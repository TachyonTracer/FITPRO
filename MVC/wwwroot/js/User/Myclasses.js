$("document").ready(function () {
    const userId = getUserIdFromToken();
    loadBookedClasses(userId);
})

let selectedRating = 0;

function openFeedback() {
    document.getElementById("feedbackModal").style.display = "flex";
}

function closeFeedback() {
    const modal = document.getElementById('feedbackModal');
    modal.style.display = 'none';
    document.getElementById('feedbackText').value = '';
    document.querySelectorAll('#starRating span').forEach(star => {
        star.classList.remove('active');
    });
}

function resetFeedback() {
    document.getElementById("feedbackText").value = "";
    selectedRating = 0;
    document.querySelectorAll("#starRating span").forEach(s => s.classList.remove("active"));
}

function submitFeedback() {
    const modal = document.getElementById('feedbackModal');
    const userId = getUserIdFromToken();
    const userName = getUserNameFromToken();
    const classId = modal.dataset.classId;
    const className = modal.dataset.className;
    const instructorName = modal.dataset.instructorName;
    const feedback = document.getElementById('feedbackText').value;
    const rating = document.querySelectorAll('#starRating span.active').length;

    // Validation
    if (!feedback || rating === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Incomplete Feedback',
            text: 'Please provide both feedback text and rating'
        });
        return;
    }

    // Prepare feedback data
    const feedbackData = {
        userId: parseInt(userId),
        classId: parseInt(classId),
        feedback: feedback,
        rating: rating,
        userName: userName,
        className: className,
        instructorName: instructorName
    };

    // Send feedback to backend
    $.ajax({
        url: 'http://localhost:8080/api/Feedback/class',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(feedbackData),
        success: function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Feedback submitted successfully!'
            });
            closeFeedback();
            loadBookedClasses(userId); // Refresh the class list

        },
        error: function (xhr, status, error) {
            console.error('Error submitting feedback:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to submit feedback. Please try again.'
            });
        }
    });
}

function getUserNameFromToken() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return JSON.parse(payload.UserObject).userName;
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
}

// Star Selection Logic
document.querySelectorAll("#starRating span").forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = parseInt(star.getAttribute("data-value"));
        document.querySelectorAll("#starRating span").forEach(s => {
            s.classList.toggle("active", parseInt(s.getAttribute("data-value")) <= selectedRating);
        });
    });
});

// Auto-attach openFeedback to all feedback buttons
document.querySelectorAll(".cancel-btn").forEach(btn => {
    if (btn.textContent.includes("Feedback")) {
        btn.onclick = openFeedback;
    }
});


function getUserIdFromToken() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return JSON.parse(payload.UserObject).userId;
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
}

function loadBookedClasses(userId) {
    if (!userId) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please login to view your booked classes'
        });
        return;
    }

    $.ajax({
        url: `http://localhost:8080/api/Class/GetBookedClassesByUser/${userId}`,
        method: 'GET',
        success: function (response) {
            if (response.success && response.data) {
                displayClasses(response.data);
            } else {
                console.error('Failed to load classes:', response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error loading classes:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load your booked classes'
            });
        }
    });
}

function getClassStatus(startDate, endDate) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
        return 'upcoming';
    } else if (now > end) {
        return 'completed';
    } else {
        return 'live';
    }
}

// Update the displayClasses function to use the new status logic
function displayClasses(classes) {
    const classGrid = document.querySelector('.class-grid');
    classGrid.innerHTML = '';

    classes.forEach(classItem => {
        const startDate = new Date(classItem.startDate);
        const endDate = new Date(classItem.endDate);
        const status = getClassStatus(startDate, endDate);


        // Add different styling for live status
        const statusStyle = status === 'live' ?
            'background-color:#FF0000; color: #0f0f0f;' :
            (status === 'completed' ? '' : '');

        const classCard = `
            <div class="class-card" data-status="${status}" data-class-id="${classItem.classId}">
                <img src="/ClassAssets/${classItem.assets.banner}" alt="${classItem.className}" class="class-img" />
                <div class="class-info">
                    <h3>${classItem.className}</h3>
                    <p><strong>Instructor:</strong> ${classItem.instructorName}</p>
                    <p><strong>Schedule:</strong> ${formatDate(startDate)} - ${formatDate(endDate)} | ${classItem.startTime.substring(0, 5)} - ${classItem.endTime.substring(0, 5)}</p>
                    <span class="status-tag" style="${statusStyle}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    ${classItem.waitList != 0 && status != 'completed' && status != 'live' ?
                `<div class="waitlist-box">WL: ${classItem.waitList}</div>` : ''}
                </div>
                ${status === 'completed' ?
                `<button class="cancel-btn" style="background-color: #facc15; color: #0f0f0f; border: none;" 
                    onclick="openFeedback('${classItem.classId}', '${classItem.className}', '${classItem.instructorName}')">
                    Give Feedback
                </button>` :



                `<button class="cancel-btn" onclick="cancelBooking('${classItem.classId}', '${classItem.className}')">
                        Cancel Booking
                    </button>`
            }
            </div>
        `;
        classGrid.innerHTML += classCard;
    });
}

function isClassCompleted(endDate) {
    return new Date(endDate) < new Date();
}

function formatDate(date) {
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short'
    });
}

function cancelBooking(classId, className) {
    const userId = getUserIdFromToken();

    Swal.fire({
        title: 'Cancel Booking?',
        text: `Are you sure you want to cancel your booking for ${className}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `http://localhost:8080/api/Class/CancelBooking/${userId}/${classId}`,
                method: 'DELETE',
                contentType: 'application/json',
                success: function (response) {
                    if (response.success) {
                        Swal.fire({
                            title: "Canceled!",
                            text: response.message || "Your booking has been canceled",
                            icon: "success"

                        });
                        loadBookedClasses(userId); // Refresh the list
                    } else {
                        Swal.fire({
                            title: "Canceled!",
                            text: response.message || "Your booking has not been  canceled",
                            icon: "error"
                        });

                    }
                },
                error: function (xhr, status, error) {

                    Swal.fire({
                        title: "Canceled!",
                        text: JSON.parse(xhr.responseText).message || "Your booking has not been  canceled",
                        icon: "error"
                    });
                }
            });
        }
    });
}

function openFeedback(classId, className, instructorName) {
    // Store class details for feedback submission
    document.getElementById('feedbackModal').dataset.classId = classId;
    document.getElementById('feedbackModal').dataset.className = className;
    document.getElementById('feedbackModal').dataset.instructorName = instructorName;
    document.getElementById('feedbackModal').style.display = 'flex';
}
