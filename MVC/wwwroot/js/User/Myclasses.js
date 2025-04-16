let drawer;
$("document").ready(function () {
    const userId = getUserIdFromToken();
    loadBookedClasses(userId);
    var user = localStorage.getItem("authToken");
    if (!user) {
        window.location.href = "/auth/login"
    }
    
 drawer = $("#profileDrawer").kendoDrawer({
    template: `
            <div class="k-drawer-content">
                <div class="k-drawer-title">Update Profile</div>
                <form id="profileForm" class="profile-form">
                    <div class="mb-2">
                        <label for="userName" class="form-label">Name</label>
                        <input id="userName"/>
                        <span class="text-danger validation-message" id="nameError"></span>
                    </div>
                    <div class="mb-2">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" disabled>
                    </div>
                    <div class="mb-2">
                        <label for="phone" class="form-label">Phone</label>
                        <input id="phone"/>
                        <span class="text-danger validation-message" id="phoneError"></span>
                    </div>
                    <div class="mb-2">
                        <label for="height" class="form-label">Height (cm)</label>
                        <input id="height" />
                        <span class="text-danger validation-message" id="heightError"></span>
                    </div>
                    <div class="mb-2">
                        <label for="weight" class="form-label">Weight (kg)</label>
                        <input id="weight"/>
                        <span class="text-danger validation-message" id="weightError"></span>
                    </div>
                    <div class="mb-2">
                        <label for="goal" class="form-label">Goal</label>
                        <select id="goal" multiple ></select>
                        <span class="text-danger validation-message" id="goalError"></span>
                    </div>
                    <div class="mb-2">
                        <label for="medicalCondition" class="form-label">Medical Condition</label>
                        <select id="medicalCondition" multiple ></select>
                        <span class="text-danger validation-message" id="medicalError"></span>
                    </div>
                    <div class="mb-2">
                        <label class="form-label me-2">Profile Image</label>
                        <div class="d-flex align-items-center">
                            <img id="imagePreview" src="" alt="Preview" class="ms-2" style="width: 86px; height: 86px; margin-right: 14px; display: none; object-fit: cover;">
                            <input type="file" id="profileImage" class="form-control form-control-sm" accept="image/*" style="max-width: 70%;">
                        </div>
                        <span class="text-danger validation-message" id="imageError"></span>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-secondary me-2" id="cancelProfileBtn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        `,
    position: "right",
    mode: "push",
    width: "400px",
    minHeight: "100vh",
    swipeToOpen: false,
    autoCollapse: false,
}).data("kendoDrawer");

// Initialize Kendo UI Components with Validations
$("#userName").kendoTextBox({
    placeholder: "Enter your name"
});

$("#phone").kendoMaskedTextBox({
    mask: "0000000000",
    placeholder: "__________"
});

$("#height").kendoNumericTextBox({
    min: 100, max: 250, step: 1, format: "# cm"
});

$("#weight").kendoNumericTextBox({
    min: 30, max: 200, step: 1, format: "#.00 kg"
});

$("#goal").kendoMultiSelect({
    dataSource: ["Weight Loss", "Muscle Gain", "General Fitness", "Endurance Training", "Flexibility Improvement", "Sports Specific", "Weight Management"],
    placeholder: "Select goals..."
});

$("#medicalCondition").kendoMultiSelect({
    dataSource: ["Diabetes", "High Blood Pressure", "Heart Disease", "Asthma", "Arthritis", "Back Pain", "None", "Hypertension"],
    placeholder: "Select medical conditions..."
});



// Function to Show Profile Drawer and Fetch Data
window.showProfileDrawer = function () {

    if (userId) {
        console.log("Extracted User ID:", userId);
    }

    drawer.show();

    $.ajax({
        url: `${uri}/api/User/GetUserById/${userId}`,
        type: "GET",
        success: function (response) {
            $("#userName").val(response.userName);
            $("#email").val(response.email);
            $("#phone").val(response.mobile);
            $("#height").data("kendoNumericTextBox").value(response.height);
            $("#weight").data("kendoNumericTextBox").value(response.weight);

            var goalValues = response.goal.split(", ").map(g => g.trim());
            $("#goal").data("kendoMultiSelect").value(goalValues);

            var medicalValues = response.medicalCondition.split(", ").map(mc => mc.trim());
            $("#medicalCondition").data("kendoMultiSelect").value(medicalValues);

            if (response.profileImage) {
                $("#imagePreview").attr("src", `../User_Images/${response.profileImage}`).show();
            }
        },
        error: function (xhr) {
            alert("Error fetching user details: " + xhr.responseText);
        }
    });
};
})

// In Myclasses.js, check if uri already exists before declaring it
if (typeof uri === 'undefined') {
    let uri = "http://localhost:8080";
}

// Function to format date and time
var userId;

userId = getUserIdFromToken();
function getUserIdFromToken() {
    const token = localStorage.getItem("authToken");
    if (!token) {
        console.warn("No auth token found in localStorage.");
        return null;
    }
    const decoded = parseJwt(token);
    if (decoded) {
        console.log("using parsing " + decoded + " " + decoded.UserObject);
        console.log("using parsing " + JSON.parse(decoded.UserObject).userId);
        console.log("using parsing printing its type " + typeof (JSON.parse(decoded.UserObject).userId));
        let userId = JSON.parse(decoded.UserObject).userId;
        console.log("user id is +" + userId);

        return JSON.parse(decoded.UserObject).userId;
    }
    console.warn("Invalid or malformed token.");
    return null;
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}
const waitlistData = {
    "SpinRide": 10,
    "Power Yoga": 0
};

document.querySelectorAll(".class-card").forEach(card => {
    const status = card.getAttribute("data-status");
    const className = card.querySelector("h3").innerText;
    const cancelButton = card.querySelector(".cancel-btn");

    const wlCount = waitlistData[className] || 0;

    if (status === "completed") {
        cancelButton.style.display = "none";

        const feedbackBtn = document.createElement("button");
        feedbackBtn.classList.add("cancel-btn");
        feedbackBtn.textContent = "Give Feedback";
        feedbackBtn.style.backgroundColor = "#facc15";
        feedbackBtn.style.color = "#0f0f0f";
        feedbackBtn.style.border = "none";
        feedbackBtn.style.marginTop = "10px";

        feedbackBtn.onclick = () => {
            alert(`📝 Opening feedback form for '${className}'`);
        };

        card.appendChild(feedbackBtn);
    } else if (status === "upcoming") {
        if (wlCount > 0) {
        }

        cancelButton.onclick = () => {
            if (confirm(`Cancel booking for '${className}'?`)) {
                alert(`✅ Booking for '${className}' cancelled.`);
            }
        };
    }
});

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
    document.getElementById("feedbackModal").style.display = "none";
    resetFeedback();
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

            let errorMessage = 'Failed to submit feedback. Please try again.';

            try {
                // Parse the response text to get the actual message
                const errorResponse = JSON.parse(xhr.responseText);
                if (errorResponse && errorResponse.message) {
                    errorMessage = errorResponse.message;
                }
            } catch (e) {
                console.error('Error parsing error response:', e);
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage
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

function myclasses() {
    // Redirect to the class details page with the class ID
    window.location.href = `/User/MyClasses?id=${userId}`;
}

function home() {
    // Redirect to the class details page with the class ID
    window.location.href = `/User/home`;
}
function classes() {
    // Redirect to the class details page with the class ID
    window.location.href = `/User/index`;
}

function performLogout() {
    Swal.fire({
        title: 'Logging Out',
        text: 'Please wait...',
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            // Clear the authentication token
            localStorage.removeItem("authToken");
        }
    }).then(() => {
        // Redirect to login page 
        window.location.href = "/Auth/Login";
    });
}

// Add a showLogoutConfirmation function
function showLogoutConfirmation() {
    Swal.fire({
        title: 'Logout Confirmation',
        text: 'Are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ff4d4d',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, Logout',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            performLogout();
        }
    });
}



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
            'background-color: #FF6363 ; color: #000000;' :
            (status === 'completed' ? 'background-color:rgb(114, 215, 67) ; color: #0f0f0f;' : '');

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



// Handle Image Preview
$(document).on("change", "#profileImage", function () {
    var file = this.files[0];
    if (file && file.type.startsWith("image/")) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#imagePreview").attr("src", e.target.result).show();
        };
        reader.readAsDataURL(file);
    } else {
        $("#imageError").text("Please select a valid image file.");
    }
});

// Close Drawer on Cancel Button Click
$(document).on("click", "#cancelProfileBtn", function () {
    drawer.hide();
    $(".profile-dropdown").hide();
});

// Live validation for userName
$("#userName").on("input blur", function () {
    let value = $(this).val().trim();
    if (value === "") {
        $("#nameError").text("Name is required.");
    } else {
        $("#nameError").text("");
    }
});

// Live validation for phone
$("#phone").on("input blur", function () {
    let value = $(this).val().trim();
    let phoneRegex = /^[6-9]\d{9}$/;

    if (value === "") {
        $("#phoneError").text("Phone number is required.");
    } else if (!phoneRegex.test(value)) {
        $("#phoneError").text("Phone number must be 10 digits and start with 6, 7, 8, or 9.");
    } else {
        $("#phoneError").text("");
    }
});

// Live validation for height
$("#height").data("kendoNumericTextBox").bind("change", function () {
    let value = this.value();
    if (value === null || isNaN(value)) {
        $("#heightError").text("Please enter your height.");
    } else {
        $("#heightError").text("");
    }
});

// Live validation for weight
$("#weight").data("kendoNumericTextBox").bind("change", function () {
    let value = this.value();
    if (value === null || isNaN(value)) {
        $("#weightError").text("Please enter your weight.");
    } else {
        $("#weightError").text("");
    }
});

// Live validation for goal
$("#goal").data("kendoMultiSelect").bind("change", function () {
    let value = this.value();
    if (!value.length) {
        $("#goalError").text("Select at least one goal.");
    } else {
        $("#goalError").text("");
    }
});

// Live validation for medical condition
$("#medicalCondition").data("kendoMultiSelect").bind("change", function () {
    let value = this.value();
    if (!value.length) {
        $("#medicalError").text("Select at least one medical condition.");
    } else {
        $("#medicalError").text("");
    }
});

// Form Submission with Validation
$(document).on("submit", "#profileForm", function (e) {
    e.preventDefault();

    $(".validation-message").text("");

    let valid = true;
    if ($("#userName").val().trim() === "") {
        $("#nameError").text("Name is required.");
        valid = false;
    }

    let phoneValue = $("#phone").val().trim();
    let phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneValue)) {
        $("#phoneError").text("Phone number must be 10 digits and start with 6, 7, 8, or 9.");
        valid = false;
    }

    if ($("#height").data("kendoNumericTextBox").value() === null || isNaN($("#height").data("kendoNumericTextBox").value())) {
        $("#heightError").text("Please enter your height.");
        valid = false;
    }
    if ($("#weight").data("kendoNumericTextBox").value() === null || isNaN($("#weight").data("kendoNumericTextBox").value())) {
        $("#weightError").text("Please enter your weight.");
        valid = false;
    }
    if (!$("#goal").data("kendoMultiSelect").value().length) {
        $("#goalError").text("Select at least one goal.");
        valid = false;
    }
    if (!$("#medicalCondition").data("kendoMultiSelect").value().length) {
        $("#medicalError").text("Select at least one medical condition.");
        valid = false;
    }

    //         @* $("#profileDrawer").hide(); // Hide the drawer
    //   $(".user-profile-container").removeClass("no-hover"); // Enable hover again *@

    if (!valid) return;

    var formData = new FormData();
    formData.append("userId", userId);
    formData.append("userName", $("#userName").val());
    formData.append("mobile", $("#phone").val());
    formData.append("height", $("#height").data("kendoNumericTextBox").value());
    formData.append("weight", $("#weight").data("kendoNumericTextBox").value());
    formData.append("goal", $("#goal").data("kendoMultiSelect").value().join(", "));
    formData.append("medicalCondition", $("#medicalCondition").data("kendoMultiSelect").value().join(", "));
    formData.append("gender", "Male");
    formData.append("email", "email@email.com");
    formData.append("password", "Password@1234");
    formData.append("confirmPassword", "Password@1234");
    formData.append("profileImage", "default.jpg");
    formData.append("activationToken", "token_449827858");

    var imageFile = $("#profileImage")[0]?.files?.[0];
    if (imageFile) {
        console.log("Image file:", imageFile);
        formData.append("profileImageFile", imageFile);
    }

    $.ajax({
        url: `${uri}/api/User/UserUpdateProfile`,
        type: "PUT",
        processData: false,
        contentType: false,
        data: formData,
        success: function () {
            Swal.fire(
                'Success!',
                'Your profile has been successfully updated.',
                'success'
            );
            drawer.hide();
            $(".profile-dropdown").hide(); // Hide the dropdown after successful update
        },
        error: function (xhr) {
            Swal.fire(
                'Error!',
                'There was an issue updating your profile. Please try again later.',
                'error'
            );
            $(".profile-dropdown").hide();
        }
    });

});



/* Do Not Remove */
/* Notification JavaScript Starts*/
/* Includes All the JS Functions for Notification Badge, Icons, Buttons and List */

// var userId = "29"; // Change this dynamically based on logged-in user
// userId_ = getUserIdFromToken();
userId = userId.toString();
var role = "user    "; // instrctor or user
var counter = 0;
var fetcherConn = "";
if (role == "admin") {
  var fetcherConn = "NewAdminNotification";
} else if (role == "instructor") {
  var fetcherConn = "NewInstructorNotification";
} else {
  var fetcherConn = "NewUserNotification";
}

// Convert timestamp to seconds/minutes/hours ago
function timeAgo(timestamp) {
  let currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  let timeDiff = currentTime - timestamp;

  if (timeDiff < 60) return `${timeDiff} seconds ago`;
  if (timeDiff < 3600) return `${Math.floor(timeDiff / 60)} minutes ago`;
  if (timeDiff < 86400) return `${Math.floor(timeDiff / 3600)} hours ago`;
  return `${Math.floor(timeDiff / 86400)} days ago`;
}

const connection = new signalR.HubConnectionBuilder()
  .withUrl(
    `${uri}/notificationHub?userId=${userId}&role=${role}`
  )
  .withAutomaticReconnect()
  .build();

connection.start().then(() => {
  console.log("Connected to SignalR! with userid: "+userId);
  connection.invoke("FetchNotifications", userId, role);
});

// Receive new notification
connection.on(fetcherConn, (message) => {
  console.log("New Notification:", message);
  addNotification(message);
});

// Load unread notifications
connection.on("ReceiveNotifications", (notifications) => {
  console.log("Unread Notifications:", notifications);
  updateNotificationList(notifications);
});

// Open Notifications Dropdown
function openNotifications() {
  console.log("Fetching Notification on Toggle...");
  connection.invoke("FetchNotifications", userId, role);
  let dropdown = document.getElementById("notificationDropdown");
  dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
}

// Add Notification to List (New notifications appear on top)
function addNotification(message) {
  let list = document.getElementById("notificationList");

  // Remove "No new notifications" message if it exists
  let noNotificationItem = list.querySelector(".text-muted");
  if (noNotificationItem) {
    list.removeChild(noNotificationItem);
  }

  let item = document.createElement("li");
  item.className = "list-group-item d-flex align-items-start";

  let parts = message.split("::");

  let title = parts[0];
  let body = parts[1];

  let timestamp = parseInt(parts[2]);
  let timeAgoText = timeAgo(timestamp);

  item.innerHTML = `
        <span class="bg-danger rounded-circle me-2 mt-2"></span>
        <div>
            <strong>${title}</strong><br>
            <small>${body}</small><br>
            <small>${timeAgoText}</small>
        </div>
    `;

  // Insert at the top instead of the bottom
  list.prepend(item);

  counter++;
  updateBellIcon();
}

// Update Notification List
function updateNotificationList(notifications) {
  let list = document.getElementById("notificationList");
  list.innerHTML = "";
  counter = 0; // Reset counter before processing new notifications

  if (notifications.length === 0) {
    list.innerHTML =
      '<li class="list-group-item text-center text-muted">No new notifications</li>';
  } else {
    notifications.forEach((message) => {
      let item = document.createElement("li");
      item.className = "list-group-item d-flex align-items-start";

      let parts = message.split("::");

      let title = parts[0];
      let body = parts[1];

      let timestamp = parseInt(parts[2]);
      let timeAgoText = timeAgo(timestamp);

      item.innerHTML = `
                <span class="bg-danger rounded-circle me-2 mt-2"></span>
                <div>
                    <strong>${title}</strong><br>
                    <small>${body}</small><br>
                    <small>${timeAgoText}</small>
                </div>
            `;

      // Insert at the top instead of the bottom
      list.prepend(item);

      counter++; // Increase counter for each unread notification
    });
  }
  updateBellIcon();
}

// Update Bell Icon Count
function updateBellIcon() {
  let badge = document.getElementById("notificationCount");
  badge.textContent = counter > 0 ? counter : 0;
  badge.style.display = counter > 0 ? "inline" : "none";
}

// Mark All as Read
function markAllAsRead() {
  counter = 0;
  connection.invoke("MarkAllAsRead", userId, role).then(() => {
    updateNotificationList([]); // Clear notifications
  });
}

/* Do Not Remove */
/* Notification JavaScript Ends */