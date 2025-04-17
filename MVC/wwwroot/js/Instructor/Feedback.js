$(document).ready(function () {
    // Initialize Kendo TabStrip

    loadFeedbacks();
    $("#mainTabstrip").kendoTabStrip({
        animation: {
            open: { effects: "fadeIn" }
        }
    });

    const tabstrip = $("#mainTabstrip").data("kendoTabStrip");
    if (tabstrip) {
        console.log("TabStrip initialized");
        tabstrip.bind("activate", function (e) {
            console.log("Tab activated:", $(e.item).text().trim());
            if ($(e.item).text().trim() === "Feedback") {
                console.log("Loading feedbacks for Feedback tab");
                loadFeedbacks();
            }
        });

        // Check if Feedback tab is active on page load
        if ($(tabstrip.select()).text().trim() === "Feedback") {
            console.log("Feedback tab active on load");
            loadFeedbacks();
        }
    } else {
        console.error("TabStrip not initialized");
    }
});

async function loadFeedbacks() {
    const feedbackContainer = document.getElementById('feedbackContainer');
    
    try {
        // Get instructor ID and validate
        const instructorId = getUserIdFromToken() || 1;
        if (!instructorId) {
            throw new Error('Invalid instructor ID');
        }

        // First verify if instructor exists
        const instructorResponse = await fetch(`http://localhost:8080/api/Instructor/GetOneInstructor/${instructorId}`);
        const instructorData = await instructorResponse.json();

        if (!instructorData.success) {
            throw new Error(instructorData.message || 'Failed to verify instructor');
        }

        // Then fetch feedbacks
        const response = await fetch(`http://localhost:8080/api/Feedback/class/instructor/${instructorId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch feedbacks');
        }

        const result = await response.json();
        console.log('Feedback API Response:', result);

        // Clear loading message
        feedbackContainer.innerHTML = '';

        if (!result.data || result.data.length === 0) {
            feedbackContainer.innerHTML = `
                <div class="no-feedback-msg">
                    No feedbacks available yet.
                </div>
            `;
            return;
        }

        // Group feedbacks by class
        const groupedFeedbacks = {};
        result.data.forEach(feedback => {
            if (!groupedFeedbacks[feedback.className]) {
                groupedFeedbacks[feedback.className] = [];
            }
            groupedFeedbacks[feedback.className].push(feedback);
        });

        // Create class cards
        Object.entries(groupedFeedbacks).forEach(([className, feedbacks]) => {
            const classCard = document.createElement('div');
            classCard.className = 'class-card';
            classCard.innerHTML = `
                <h2>${className} <span class="feedback-count">(${feedbacks.length} feedbacks)</span></h2>
                <div class="filter-row">
                    <label for="ratingFilter_${className}">Filter by Rating:</label>
                    <select id="ratingFilter_${className}" onchange="filterFeedbacks(this)">
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
                <div class="no-feedback-msg" style="display: none;">No feedbacks available for this rating.</div>
                <div class="feedback-row">
                    ${feedbacks.map(feedback => `
                        <div class="feedback-box" data-rating="${feedback.rating}">
                            <div class="user-info">
                                <div class="user-initials">${feedback.userName?.charAt(0) || 'U'}</div>
                                <div class="user-name">${feedback.userName || 'Anonymous'}</div>
                            </div>
                            <div class="rating">${'⭐'.repeat(feedback.rating)}</div>
                            <div class="feedback-text">${feedback.feedback || 'No comment provided'}</div>
                            <div class="feedback-footer">${new Date(feedback.createdAt).toLocaleDateString()}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            feedbackContainer.appendChild(classCard);
        });

    } catch (error) {
        console.error('Error:', error);
        feedbackContainer.innerHTML = `
            <div class="no-feedback-msg">
                <div style="color: #ff4444; margin-bottom: 10px;">⚠️ Error</div>
                Failed to load feedbacks: ${error.message}<br>
                Please try again later.
            </div>
        `;

        // Show error notification
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Failed to load feedbacks: ${error.message}`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    }
}

function getUserIdFromToken() {
    const token = localStorage.getItem('authToken');
    console.log('Token:', token);
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        console.log('Token Payload:', payload);
        return payload.instructorId || null;
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
}

function filterFeedbacks(select) {
    const value = select.value;
    const classCard = select.closest('.class-card');
    const feedbackBoxes = classCard.querySelectorAll('.feedback-box');
    const noMsg = classCard.querySelector('.no-feedback-msg');

    let visibleCount = 0;

    feedbackBoxes.forEach(box => {
        const stars = box.querySelector('.rating').textContent.trim().length;
        if (value === 'all' || stars == value) {
            box.style.display = 'block';
            visibleCount++;
        } else {
            box.style.display = 'none';
        }
    });

    noMsg.style.display = visibleCount === 0 ? 'block' : 'none';
}