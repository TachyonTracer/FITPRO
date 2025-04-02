let currentUserId = null;

// Function to handle image load error
function handleImageError(img) {
    img.src = '/images/placeholder.jpg'; // Local fallback image
    img.onerror = null; // Prevent infinite loop
}

// Load User List
function loadUserList() {
    $.ajax({
        url: `${uri}/api/User/GetAllUsers`,
        method: "GET",
        success: function (response) {
            let html = response.data.map(user => `
                <li class="list-group-item" data-id="${user.userId}" onclick="selectUser(${user.userId})">
                    ${user.userName}
                </li>
            `).join('');
            $('#names').html(html);
        },
        error: function () {
            console.error("Error loading users.");
        }
    });
}

// Select User and Show Details
function selectUser(userId) {
    $.ajax({
        url: `${uri}/api/User/GetOneUser/${userId}`,
        method: "GET",
        success: function (response) {
            const user = response.data;
            currentUserId = userId;

            $('#names .list-group-item').removeClass('active');
            $(`#names .list-group-item[data-id='${userId}']`).addClass('active');

            $('#default-message').addClass('d-none');
            $('#details').removeClass('d-none');

            // Populate user details
            $('#userName').text(user.userName || 'N/A');
            $('#email').text(user.email || 'N/A');
            $('#mobile').text(user.mobile || 'N/A');
            $('#gender').text(user.gender || 'N/A');
            $('#dob').text(user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A');
            $('#status').text(user.status ? 'Active' : 'Inactive');
            $('#activatedOn').text(user.activatedOn ? new Date(user.activatedOn).toLocaleString() : 'N/A');
            $('#height').text(user.height ? `${user.height} cm` : 'N/A');
            $('#weight').text(user.weight ? `${user.weight} kg` : 'N/A');
            $('#goal').text(user.goal || 'N/A');
            $('#medicalCondition').text(user.medicalCondition || 'N/A');

            // Set profile image
            const profileImage = $('#profile-image');
            if (user.profileImage) {
                profileImage.attr('src', `/User_Images/${user.profileImage}`);
            } else {
                profileImage.attr('src', '/Instructor_Images/placeholder.jpg');
                profileImage[0].onerror = null;
            }
        },
        error: function () {
            console.error("Error fetching user details.");
        }
    });
}

function suspendUser() {
    if (!currentUserId) {
        Swal.fire("Error", "Please select an User first.", "error");
        return;
    }

    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to suspend this User?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Suspend",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${uri}/api/User/UserSuspend/${currentUserId}`,
                type: "POST",
                success: function (response) {
                    Swal.fire({
                        title: "Success",
                        text: "User Suspended successfully!",
                        icon: "success",
                        confirmButtonText: "OK"
                    }).then(() => {
                        loadUserList();
                       $("#details").hide();
                    });
                },
                error: function () {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to suspend User.",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                }
            });
        }
    });
}



// Load user list on page load
$(document).ready(function () {
    loadUserList();
});