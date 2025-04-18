let currentUserId = null;

// Function to handle image load error
function handleImageError(img) {
  img.src = "/images/placeholder.jpg"; // Local fallback image
  img.onerror = null; // Prevent infinite loop
}

// Load User List
function loadUserList() {
  $.ajax({
    url: `${uri}/api/User/GetAllUsers`,
    method: "GET",
    success: function (response) {
      let html = response.data
        .map(
          (user) => `
                <li class="list-group-item" data-id="${user.userId}" onclick="selectUser(${user.userId})">
                    ${user.userName}
                </li>
            `
        )
        .join("");
      $("#names").html(html);
    },
    error: function () {
      console.error("Error loading users.");
    },
  });
}

// Select User and Show Details
// function selectUser(userId) {
//     $.ajax({
//         url: `${uri}/api/User/GetOneUser/${userId}`,
//         method: "GET",
//         success: function (response) {
//             const user = response.data;
//             currentUserId = userId;

//             $('#names .list-group-item').removeClass('active');
//             $(`#names .list-group-item[data-id='${userId}']`).addClass('active');

//             $('#default-message').addClass('d-none');
//             $('#details').removeClass('d-none');

//             // Populate user details
//             $('#userName').text(user.userName || 'N/A');
//             $('#email').text(user.email || 'N/A');
//             $('#mobile').text(user.mobile || 'N/A');
//             $('#gender').text(user.gender || 'N/A');
//             $('#dob').text(user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A');
//             $('#status').text(user.status ? 'Active' : 'Inactive');
//             $('#activatedOn').text(user.activatedOn ? new Date(user.activatedOn).toLocaleString() : 'N/A');
//             $('#height').text(user.height ? `${user.height} cm` : 'N/A');
//             $('#weight').text(user.weight ? `${user.weight} kg` : 'N/A');
//             $('#goal').text(user.goal || 'N/A');
//             $('#medicalCondition').text(user.medicalCondition || 'N/A');

//             // Set profile image
//             const profileImage = $('#profile-image');
//             if (user.profileImage) {
//                 profileImage.attr('src', `/User_Images/${user.profileImage}`);
//             } else {
//                 profileImage.attr('src', '/Instructor_Images/placeholder.jpg');
//                 profileImage[0].onerror = null;
//             }
//         },
//         error: function () {
//             console.error("Error fetching user details.");
//         }
//     });
// }

function selectUser(userId) {
  $.ajax({
    url: `${uri}/api/User/GetOneUser/${userId}`,
    method: "GET",
    success: function (response) {
      const user = response.data;
      currentUserId = userId;

      $("#names .list-group-item").removeClass("active");
      $(`#names .list-group-item[data-id='${userId}']`).addClass("active");

      $("#default-message").addClass("d-none");
      $("#details").removeClass("d-none");

      // Populate user details
      $("#userName").text(user.userName || "N/A");
      $("#email").text(user.email || "N/A");
      $("#mobile").text(user.mobile || "N/A");
      $("#gender").text(user.gender || "N/A");
      $("#dob").text(
        user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"
      );
      $("#status").text(user.status ? "Active" : "Inactive");
      $("#activatedOn").text(
        user.activatedOn ? new Date(user.activatedOn).toLocaleString() : "N/A"
      );
      $("#height").text(user.height ? `${user.height} cm` : "N/A");
      $("#weight").text(user.weight ? `${user.weight} kg` : "N/A");
      $("#goal").text(user.goal || "N/A");
      $("#medicalCondition").text(user.medicalCondition || "N/A");

      // Set profile image
      const profileImage = $("#profile-image");
      if (user.profileImage) {
        profileImage.attr("src", `/User_Images/${user.profileImage}`);
      } else {
        profileImage.attr("src", "/Instructor_Images/placeholder.jpg");
        profileImage[0].onerror = null;
      }

      // Setup Suspend/Activate button
      const $statusBtn = $("#user-approve-btn");
      console.log("Status:", user.status, "Button Text:", $statusBtn.text());
      if (user.status === true || user.status === "true" || user.status === 1) {
        $statusBtn.text("Suspend");
        $statusBtn.removeClass("btn-success").addClass("btn-warning");
        $statusBtn.off("click").on("click", suspendUser);
      } else {
        $statusBtn.text("Activate");
        $statusBtn.removeClass("btn-warning").addClass("btn-success");
        $statusBtn.off("click").on("click", activateUser);
      }
    },
    error: function () {
      console.error("Error fetching user details.");
    },
  });
}

function suspendUser() {
  if (!currentUserId) {
    Swal.fire("Error", "Please select an User first.", "error");
    return;
  }

  Swal.fire({
    title: "Reason for Disapproval",
    input: "textarea",
    inputLabel: "Please provide a reason :",
    inputPlaceholder: "Enter reason here...",
    inputAttributes: {
      "aria-label": "Type your reason here",
    },
    showCancelButton: true,
    confirmButtonText: "Submit",
    cancelButtonText: "Cancel",
    preConfirm: (reason) => {
      if (!reason || reason.trim() === "") {
        Swal.showValidationMessage("You must provide a reason.");
        return false;
      }
      return reason.trim();
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const reason = result.value;

      const formData = new FormData();
      formData.append("reason", reason);

      $.ajax({
        url: `${uri}/api/User/UserSuspend/${currentUserId}`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          Swal.fire({
            title: "Success",
            text: response.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            currentUserId = null;
            $("#details").addClass("d-none");
            $("#default-message").removeClass("d-none");
            loadUserList();
          });
        },
        error: function (xhr) {
          Swal.fire({
            title: "Error",
            text: xhr.responseJSON?.message || "Failed to suspend User.",
            icon: "error",
            confirmButtonText: "OK",
          });
        },
      });
    }
  });
}

function activateUser() {
  if (!currentUserId) {
    Swal.fire("Error", "Please select a user first.", "error");
    return;
  }
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to Activate this User?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Activate",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `${uri}/api/User/UserActivate/${currentUserId}`,
        type: "POST",
        success: function (response) {
          Swal.fire({
            title: "Success",
            text: response.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            currentUserId = null;
            $("#details").addClass("d-none");
            $("#default-message").removeClass("d-none");
            loadUserList();
          });
        },
        error: function (xhr) {
          Swal.fire({
            title: "Error",
            text: xhr.responseJSON?.message || "Failed to activate user.",
            icon: "error",
            confirmButtonText: "OK",
          });
        },
      });
    }
  });
}

// Load user list on page load
$(document).ready(function () {
  loadUserList();
});
