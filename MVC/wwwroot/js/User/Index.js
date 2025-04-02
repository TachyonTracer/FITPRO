let uri = "http://localhost:8080";
// Function to format date and time
var userId;

userId = getUserIdFromToken();
console.log("user id after loadig is +" + userId);

// Initialize Main Navigation TabStrip with select event
$("#mainTabstrip").kendoTabStrip({
    animation: {
        open: {
            effects: "fadeIn"
        }
    },
    select: function (e) {
        if (e.item.textContent.trim() === "My Classes") {
            loadBookedClasses();
        }
    }
});

function getUserIdFromToken() {
    const token = localStorage.getItem("authToken");
    if (!token) {
        console.warn("No auth token found in localStorage.");
        return null;
    }
    const decoded = parseJwt(token);
    if (decoded) {
        console.log("using parsing " + decoded + " " + decoded.UserObject);
        console.log("using parsing " + JSON.parse(decoded.UserObject).instructorId);
        console.log("using parsing printing its type " + typeof (JSON.parse(decoded.UserObject).instructorId));
        let userId = JSON.parse(decoded.UserObject).instructorId;
        console.log("user id is +" + userId);

        return "10";
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

function formatDateTime(dateStr, timeStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options) + ' at ' + timeStr.substring(0, 5);
}

// Function to format duration
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// Function to render classes
function renderClasses(data) {
    var html = "";
    if (data.length === 0) {
        html = '<div class="col-12"><div class="alert alert-warning text-center">No classes match your search criteria.</div></div>';
    } else {
        data.forEach(function (c) {
            html += `<div class="col-md-4 mb-4">
                                <div class="card h-100">
                                    <div id="carousel-${c.classId}" class="carousel slide" data-bs-ride="carousel">
                                        <div class="carousel-inner">
                                            ${Object.entries(c.assets)
                    .filter(([key]) => key.startsWith('picture'))
                    .map(([key, value], index) => `
                                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                                    <img src="../ClassAssets/${value}" style="height: 200px; object-fit: cover;">
                                                </div>
                                            `).join('')}
                                        </div>
                                        <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${c.classId}" data-bs-slide="prev">
                                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span class="visually-hidden">Previous</span>
                                        </button>
                                        <button class="carousel-control-next" type="button" data-bs-target="#carousel-${c.classId}" data-bs-slide="next">
                                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span class="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">${c.className}</h5>
                                        <div class="mb-2">
                                            <span class="badge badge-level me-1">${c.type}</span>
                                            <span class="badge ${c.status === 'Active' ? 'bg-success' : 'bg-warning'}">${c.status}</span>
                                        </div>
                                        <p class="card-text">${c.description.purpose}</p>
                                        <div class="class-detail">
                                            <strong>Start:</strong> ${formatDateTime(c.startDate, c.startTime)}
                                        </div>
                                        <div class="class-detail">
                                            <strong>End:</strong> ${formatDateTime(c.endDate, c.endTime)}
                                        </div>
                                        <div class="class-detail">
                                            <strong>Duration:</strong> ${formatDuration(c.duration)}
                                        </div>
                                        <div class="class-detail">
                                            <strong>Location:</strong> ${c.city}
                                        </div>
                                        <div class="class-detail">
                                            <strong>Address:</strong> ${c.address}
                                        </div>
                                        <div class="class-detail">
                                            <strong>Instructor Name:</strong> ${c.instructorName}
                                        </div>
                                        <div class="class-detail">
                                            <strong>Available Seats:</strong> ${c.availableCapacity}
                                        </div>
                                        <div class="class-detail">
                                            <strong>Equipment:</strong> ${c.requiredEquipments}
                                        </div>
                                        <div class="class-detail">
                                            <strong>Price:</strong> $${c.fee.toFixed(2)}
                                        </div>
                                    </div>
                                    <div class="card-footer bg-transparent">
                                        <button class="btn btn-success w-100 book-btn" data-id="${c.classId}" ${c.availableCapacity === 0 || c.status !== 'Active' ? 'disabled' : ''}>
                                            ${c.availableCapacity === 0 ? 'Class Full' : c.status !== 'Active' ? 'Not Available' : 'Book Now'}
                                        </button>
                                    </div>
                                </div>
                            </div>`;
        });
    }
    $("#classList").html(html);
}

// Function to render booked classes
function renderBookedClasses(data) {
    var html = '<div class="container mt-4"><h2 class="mb-4">My Booked Classes</h2><div class="row" id="myClassList">';
    if (data.length === 0) {
        html += '<div class="col-12"><div class="alert alert-info text-center">You have no booked classes yet.</div></div>';
    } else {
        data.forEach(function (c) {
            html += `<div class="col-md-4 mb-4">
                                <div class="card h-100">
                                    <div id="carousel-booked-${c.classId}" class="carousel slide" data-bs-ride="carousel">
                                        <div class="carousel-inner">
                                            ${Object.entries(c.assets)
                    .filter(([key]) => key.startsWith('picture'))
                    .map(([key, value], index) => `
                                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                                    <img src="../ClassAssets/${value}" class="d-block w-100" alt="${key}" style="height: 200px; object-fit: cover;">
                                                </div>
                                            `).join('')}
                                        </div>
                                        <button class="carousel-control-prev" type="button" data-bs-target="#carousel-booked-${c.classId}" data-bs-slide="prev">
                                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span class="visually-hidden">Previous</span>
                                        </button>
                                        <button class="carousel-control-next" type="button" data-bs-target="#carousel-booked-${c.classId}" data-bs-slide="next">
                                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span class="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">${c.className}</h5>
                                        <div class="mb-2">
                                            <span class="badge badge-level me-1">${c.type}</span>
                                            <span class="badge ${c.status === 'Active' ? 'bg-success' : 'bg-warning'} float-end">${c.status}</span>
                                        </div>
                                        <p class="card-text">${c.description.purpose}</p>
                                        <div class="class-detail">
                                            <strong>Start:</strong> ${formatDateTime(c.startDate, c.startTime)}
                                        </div>
                                        <div class="class-detail">
                                            <strong>End:</strong> ${formatDateTime(c.endDate, c.endTime)}
                                        </div>
                                        <div class="class-detail">
                                            <strong>Duration:</strong> ${formatDuration(c.duration)}
                                        </div>
                                        <div class="class-detail">
                                            <strong>Location:</strong> ${c.city}
                                        </div>
                                        <div class="class-detail">
                                            <strong>Address:</strong> ${c.address}
                                        </div>
                                        <div class="class-detail">
                                            <strong>Instructor Name:</strong> ${c.instructorName}
                                        </div>
                                        <div class="class-detail">
                                            <strong>Equipment:</strong> ${c.requiredEquipments}
                                        </div>
                                        <div class="class-detail">
                                            <strong>Price:</strong> $${c.fee.toFixed(2)}
                                        </div>
                                    </div>
                                    <div class="card-footer bg-transparent">
                                        <button class="btn btn-danger w-100 cancel-btn" onclick="cancelBooking(${userId}, ${c.classId})" ${c.status !== 'Active' ? 'disabled' : ''}>
                                            ${c.status !== 'Active' ? 'Cannot Cancel' : 'Cancel Booking'}
                                        </button>
                                    </div>
                                </div>
                            </div>`;
        });
    }
    html += '</div></div>';
    $("#myClasses").html(html);
}

// Function to load booked classes
function loadBookedClasses() {
    $.ajax({
        url: `${uri}/api/Class/GetBookedClassesByUser/${userId}`,
        type: "GET",
        success: function (response) {
            console.log("Booked classes:", response.data);
            renderBookedClasses(response.data);
        },
        error: function (error) {
            console.log(error);
            $("#myClasses").html('<div class="col-12"><div class="alert alert-warning text-center">Error loading booked classes.</div></div>');
        }
    });
}

$(document).ready(function () {




    $.ajax({
        url: `${uri}/api/User/GetUserById/${userId}`,
        type: "GET",
        success: function (response) {
            console.log("User Data: in res ", response);
            userData = response;
            console.log("User Data: in user data ", userData);
            console.log("Setting user name");
            $('#userImage').attr('src', `../User_Images/${userData.profileImage}`);
            $('.user-name').text(userData.userName);

        },
        error: function (xhr) {
        }
    });

    // Function to render booked classes
    function renderBookedClasses(data) {
        var html = '<div class="container mt-4"><h2 class="mb-4">My Booked Classes</h2><div class="row" id="myClassList">';
        if (data.length === 0) {
            html += '<div class="col-12"><div class="alert alert-info text-center">You have no booked classes yet.</div></div>';
        } else {
            data.forEach(function (c) {
                html += `<div class="col-md-4 mb-4">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <h5 class="card-title">${c.className}</h5>
                                            <div class="mb-2">
                                                <span class="badge badge-level me-1">${c.description.level}</span>
                                                <span class="badge badge-type">${c.type}</span>
                                                <span class="badge ${c.status === 'Active' ? 'bg-success' : 'bg-warning'} float-end">${c.status}</span>
                                            </div>
                                            <p class="card-text">${c.description.overview}</p>
                                            <div class="class-detail">
                                                <strong>Start:</strong> ${formatDateTime(c.startDate, c.startTime)}
                                            </div>
                                            <div class="class-detail">
                                                <strong>End:</strong> ${formatDateTime(c.endDate, c.endTime)}
                                            </div>
                                            <div class="class-detail">
                                                <strong>Duration:</strong> ${formatDuration(c.duration)}
                                            </div>
                                            <div class="class-detail">
                                                <strong>Location:</strong> ${c.city}
                                            </div>
                                            <div class="class-detail">
                                                <strong>Address:</strong> ${c.address}
                                            </div>
                                            <div class="class-detail">
                                                <strong>Instructor ID:</strong> ${c.instructorName}
                                            </div>
                                            <div class="class-detail">
                                                <strong>Equipment:</strong> ${c.requiredEquipments}
                                            </div>
                                            <div class="class-detail">
                                                <strong>Price:</strong> $${c.fee.toFixed(2)}
                                            </div>
                                        </div>
                                        <div class="card-footer bg-transparent">
                                            <button class="btn btn-danger w-100 cancel-btn" onclick="cancelBooking(9, ${c.classId})" ${c.status !== 'Active' ? 'disabled' : ''}>
                                                ${c.status !== 'Active' ? 'Cannot Cancel' : 'Cancel Booking'}
                                            </button>
                                        </div>
                                    </div>
                                </div>`;
            });
        }
        html += '</div></div>';
        $("#myClasses").html(html);
    }


    // Initialize Main Navigation TabStrip
    $("#mainTabstrip").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        }
    });

    // Initialize Profile Drawer
    $("#profileDrawer").kendoDrawer({
        template: `
        <div class="k-drawer-content">
            <div class="k-drawer-title" style="color: #FF4A57; font-size: 18px; font-weight: bold;">Update Profile</div>
            <form id="profileForm" class="profile-form" style="padding: 15px; border-radius: 10px; border: 2px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.05);">
                <div class="mb-3">
                    <label for="firstName" class="form-label" style="color: #ccc;">First Name</label>
                    <input type="text" class="form-control" id="firstName" value="John" style="background: #f6f2ef; border: 1px solid #444; color: #222;">
                </div>
                <div class="mb-3">
                    <label for="lastName" class="form-label" style="color: #ccc;">Last Name</label>
                    <input type="text" class="form-control" id="lastName" value="Doe" style="background: #f6f2ef; border: 1px solid #444; color: #222;">
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label" style="color: #ccc;">Email</label>
                    <input type="email" class="form-control" id="email" value="john.doe@example.com" style="background: #f6f2ef; border: 1px solid #444; color: #222;">
                </div>
                <div class="mb-3">
                    <label for="phone" class="form-label" style="color: #ccc;">Phone</label>
                    <input type="tel" class="form-control" id="phone" value="+1 (555) 123-4567" style="background: #f6f2ef; border: 1px solid #444; color: #222;">
                </div>
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-secondary me-2" onclick="$('#profileDrawer').data('kendoDrawer').hide()" style="background: #444; color: #fff; border: 1px solid #666;">Cancel</button>
                    <button type="submit" class="btn btn-primary" style="background: #FF4A57; border: none;">Save Changes</button>
                </div>
            </form>
        </div>
    `,
        position: "right",

        mode: "push",
        width: "450px",
        minHeight: "100vh",
        swipeToOpen: false,
        autoCollapse: false,
    });

    // Initialize Logout Dialog
    $("#logoutDialog").kendoDialog({
        title: "Logout Confirmation",
        content: "<p>Are you sure you want to logout?</p>",
        actions: [
            { text: "Cancel" },
            {
                text: "Logout",
                primary: true,
                action: function (e) {
                    performLogout();
                }
            }
        ],
        visible: false
    });

    // Class data
    var contactData = [];

    $.ajax({
        url: `${uri}/api/Class/GetAllClasses`,
        type: "GET",
        success: function (response) {
            console.log(response.data);
            contactData = response.data;
            renderClasses(contactData);
        },
        error: function (error) {
            console.log(error);
        }
    });

    // Search function (runs on input)
    function performSearch() {
        var searchText = $("#searchText").val().toLowerCase();

        if (searchText === "") {
            applyFilters();
            return;
        }

        var searchedData = contactData.filter(function (c) {
            return c.className.toLowerCase().includes(searchText) ||
                c.city.toLowerCase().includes(searchText);
        });

        var type = $("#type").val();
        var level = $("#level").val();

        var filteredData = searchedData.filter(function (c) {
            return (type === "" || c.type === type) &&
                (level === "" || c.description.level === level);
        });

        renderClasses(filteredData);
    }

    // Filter function (runs on button click)
    function applyFilters() {
        var searchText = $("#searchText").val().toLowerCase();
        var type = $("#type").val();
        var level = $("#level").val();

        var filteredData = contactData.filter(function (c) {
            var matchesSearch = searchText === "" ||
                c.className.toLowerCase().includes(searchText) ||
                c.city.toLowerCase().includes(searchText);
            var matchesType = type === "" || c.type === type;
            var matchesLevel = level === "" || c.description.level === level;

            return matchesSearch && matchesType && matchesLevel;
        });

        renderClasses(filteredData);
    }

    // Search on input
    $("#searchText").on("input", performSearch);

    // Filter on button click
    $("#filterBtn").click(applyFilters);

    // Booking functionality
    $("#classList").on("click", ".book-btn", function () {
        var classId = $(this).data("id");
        var selectedClass = contactData.find(c => c.classId === classId);

        if (selectedClass && selectedClass.availableCapacity > 0) {
            selectedClass.availableCapacity--;
            renderClasses(contactData);
            alert(`Booking confirmed for ${selectedClass.className}!\nDate: ${formatDateTime(selectedClass.startDate, selectedClass.startTime)}\nPrice: $${selectedClass.fee.toFixed(2)}`);
        } else {
            alert("Sorry, no seats available for " + selectedClass.className);
        }
    });

    // Profile form submission
    // @* $(document).on("submit", "#profileForm", function(e) {
    //     e.preventDefault();
    //     alert("Profile updated successfully!");
    //     $("#profileDrawer").data("kendoDrawer").hide();
    //     }); *@
});

$(document).ready(function () {
    localStorage.setItem("authToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKV1RTZXJ2aWNlc0FjY2Vzc1Rva2VuIiwianRpIjoiMjlkZWE4YzUtMGE1Ny00NDRhLWJkMjgtMWVmYzAwMzEzYjEyIiwiVXNlck9iamVjdCI6IntcImluc3RydWN0b3JJZFwiOjEwLFwiaW5zdHJ1Y3Rvck5hbWVcIjpcIktodXNoaVwiLFwiZW1haWxcIjpcImtodXNoaTFAZ21haWwuY29tXCIsXCJwYXNzd29yZFwiOm51bGwsXCJjb25maXJtUGFzc3dvcmRcIjpudWxsLFwibW9iaWxlXCI6XCIxMjM0NTY3ODkwXCIsXCJnZW5kZXJcIjpcIkZlbWFsZVwiLFwiZG9iXCI6XCIyMDAzLTEwLTA1VDAwOjAwOjAwXCIsXCJzcGVjaWFsaXphdGlvblwiOlwiWW9nYVwiLFwiY2VydGlmaWNhdGVzXCI6e1wiWW9nYVwiOlwia2h1c2hpMUBnbWFpbC5jb21fWW9nYV82OTNhYmE5MS0zZmQyLTRjMGQtYjAxMS01YjAzYjhjMzhkYmUuanBnXCJ9LFwicHJvZmlsZUltYWdlXCI6XCJraHVzaGkxQGdtYWlsLmNvbV9wcm9maWxlLnBuZ1wiLFwiYXNzb2NpYXRpb25cIjpcIkZpdFByb1wiLFwiY3JlYXRlZEF0XCI6XCIyMDI1LTAzLTI2VDEzOjEyOjU3LjkyMjc5NFwiLFwic3RhdHVzXCI6XCJBY3RpdmVcIixcImlkUHJvb2ZcIjpcImtodXNoaTFAZ21haWwuY29tX2lkcHJvb2YucG5nXCIsXCJhY3RpdmF0aW9uVG9rZW5cIjpcImQ2ZjcwYjUwLTIyZDQtNDNiNi04OWEzLWI1ZjFjMmYzOWU1YVwiLFwiYWN0aXZhdGVkT25cIjpcIjIwMjUtMDMtMjVUMTY6MjQ6MzguMDU3MDY5XCIsXCJpZFByb29mRmlsZVwiOm51bGwsXCJjZXJ0aWZpY2F0ZUZpbGVzXCI6bnVsbCxcInByb2ZpbGVJbWFnZUZpbGVcIjpudWxsfSIsImV4cCI6MTc0MzE0NzMyNSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MCIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjgwODEifQ.jjl4jKtkwF-AqBQdzos4E0LwpU39GsxwDd19F-snFjA");

    // @* function parseJwt(token) {
    //     try {
    //         const base64Url = token.split('.')[1];
    //         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    //         return JSON.parse(atob(base64));
    //     } catch (error) {
    //         console.error("Invalid token:", error);
    //         return null;
    //     }
    // }

    // function getUserIdFromToken() {
    //     const token = localStorage.getItem("authToken");
    //     if (!token) {
    //         console.warn("No auth token found in localStorage.");
    //         return null;
    //     }
    //     const decoded = parseJwt(token);
    //     if (decoded) {
    //         console.log(decoded);
    //         console.log(JSON.parse(decoded.UserObject).instructorId + " 1st time");

    //         return JSON.parse(decoded.UserObject).instructorId;
    //     }
    //     console.warn("Invalid or malformed token.");
    //     return null;
    // } *@

    var drawer = $("#profileDrawer").kendoDrawer({
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
            },
            error: function (xhr) {
                Swal.fire(
                    'Error!',
                    'There was an issue updating your profile. Please try again later.',
                    'error'
                );
            }
        });


    });



});

// Show logout confirmation
function showLogoutConfirmation() {
    $("#logoutDialog").data("kendoDialog").open();
}

// Perform logout
function performLogout() {
    alert("You have been logged out. Redirecting to login page...");
}

// Function to cancel booking
function cancelBooking(userId, classId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this cancellation!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${uri}/api/Class/CancelBooking/${userId}/${classId}`,
                type: "DELETE",
                success: function (response) {
                    if (response.success) {
                        Swal.fire(
                            'Cancelled!',
                            'Your booking has been cancelled.',
                            'success'
                        );
                        loadBookedClasses();
                    } else {
                        Swal.fire(
                            'Error!',
                            response.message || 'Failed to cancel booking.',
                            'error'
                        );
                    }
                },
                error: function (error) {
                    Swal.fire(
                        'Error!',
                        'Failed to cancel booking. Please try again.',
                        'error'
                    );
                    console.log(error);
                }
            });
        }
    });
}
