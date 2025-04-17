var instructorId = getUserIdFromToken();
var uri = "http://localhost:8080";

function formatDateTime(dateStr, timeStr) {
  const date = new Date(dateStr);
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return (
    date.toLocaleDateString("en-US", options) + " at " + timeStr.substring(0, 5)
  );
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timeString) {
  if (!timeString) return "";
  return timeString.substring(0, 5);
}

// show class details
function showClassDetails(classId) {
  $.ajax({
    url: `${uri}/api/Instructor/UpcomingClassDetailsByInstructor/${instructorId}`,
    type: "GET",
    success: function (response) {
      if (response.success) {
        const classData = response.data.find((c) => c.classId === classId);
        if (classData) {
          renderClassDetails(classData);
        }
      }
    },
    error: function () {
      Swal.fire({
        title: "Error!",
        text: "Could not load class details",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });
}

//render class details
function renderClassDetails(classData) {
  const html = `
        <div class="detail-item">
            <div class="detail-label">Class Name</div>
            <div class="detail-value">${classData.className}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Date & Time</div>
            <div class="detail-value">${formatDateTime(
    classData.startDate,
    classData.startTime
  )}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Duration</div>
            <div class="detail-value">${formatDuration(
    classData.duration
  )}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Location</div>
            <div class="detail-value">${classData.city}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Address</div>
            <div class="detail-value">${classData.address}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Capacity</div>
            <div class="detail-value">${classData.maxCapacity - classData.availableCapacity
    }/${classData.maxCapacity} Students</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Status</div>
            <div class="detail-value">
                <span class="badge ${classData.status === "Active" ? "bg-success" : "bg-warning"
    }">
                    ${classData.status}
                </span>
            </div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Required Equipment</div>
            <div class="detail-value">${classData.requiredEquipments || "None"
    }</div>
        </div>
    `;

  $("#classDetailsContent").html(html);
  $("#classDetailsPopup").fadeIn(300);
}


function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
function getUserIdFromToken() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.warn("No auth token found in localStorage.");
    return null;
  }
  const decoded = parseJwt(token);
  if (decoded) {
    console.log("decoded:" + JSON.parse(decoded.UserObject).instructorName);
    return JSON.parse(decoded.UserObject).instructorId; // Updated to return instructorId from decoded token
  }
  console.warn("Invalid or malformed token.");
  return null;
}




document.addEventListener("DOMContentLoaded", function () {
  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "white" },
      },
      x: {
        ticks: { color: "white" },
      },
    },
    plugins: {
      legend: {
        labels: { color: "white" },
      },
      tooltip: {
        bodyColor: "white",
        titleColor: "white",
        backgroundColor: "#333", // optional: dark tooltip background
      },
    },
  };

  // Chart setup
const classTypeCtx = document.getElementById("classTypeChart").getContext("2d");

// Default Chart (without data)
const classTypeChart = new Chart(classTypeCtx, {
  type: "doughnut",
  data: {
    labels: [{
      text: "Loading...", // Placeholder text
      color:["#ffff"]// Style for the placeholder
    }],  // Labels will be populated dynamically
    datasets: [
      {
        data: [],  // Data will be populated dynamically
        backgroundColor: ["#ff4d4d", "#4d4dff", "#a38305", "#0d0d0d"], // You can change the color logic if needed
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    height: 400,
    width: 300,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff"  // Legend label color set to white
        }
      }
    }
  }
});

// Function to fetch data from API and update the chart
async function updateChartData(instructorId) {
  try {
    // Fetch the data from your API
    const response = await fetch(`${uri}/api/Instructor/typewise-class-count/${instructorId}`);

    // Ensure the response is OK (status code 200)
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const apiData = await response.json();

    // Check if the API response is successful
    if (apiData.success) {
      const classData = apiData.data;

      // Map the response to chart labels and data
      classTypeChart.data.labels = classData.map(item => item.key);  
      classTypeChart.data.datasets[0].data = classData.map(item => item.value);
      
      classTypeChart.data.datasets[0].backgroundColor = classData.map((_, index) => {
        const colors = ["#facc15", "#4d4dff", "#71a305", "#d64fcf", "#994fd6", "#51e6e8", "#eb8c54"];
        return colors[index % colors.length];
      });

      // After updating the data, call update to render the changes
      classTypeChart.update();
    } else {
      console.error("API returned error:", apiData.message);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Call the update function to fetch data and update the chart
// const instructorId = 'your-instructor-id';  // Replace this with actual instructor ID
updateChartData(instructorId);


  const studentEngagementCtx = document
    .getElementById("studentEngagementChart")
    .getContext("2d");
  new Chart(studentEngagementCtx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr"],
      datasets: [
        {
          label: "Student Engagement",
          data: [65, 75, 82, 87],
          borderColor: "#facc15",
          backgroundColor: "rgba(160, 158, 61, 0.2)",
        },
      ],
    },
    options: chartOptions,
  });

  const revenueCtx = document.getElementById("revenueChart").getContext("2d");
  new Chart(revenueCtx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr"],
      datasets: [
        {
          label: "Monthly Revenue",
          data: [3500, 3800, 4000, 4250],
          backgroundColor: "#facc15",
        },
      ],
    },
    options: chartOptions,
  });

  // Profile functionality
  const userProfile = document.querySelector(".user-profile");
  const profileDropdown = document.querySelector(".profile-dropdown");

  userProfile.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!userProfile.contains(e.target)) {
      profileDropdown.classList.remove("active");
    }
  });

  // Initialize Main Navigation TabStrip
  $("#mainTabstrip").kendoTabStrip({
    animation: {
      open: {
        effects: "fadeIn",
      },
    },
  });


  $.ajax({
    url: `${uri}/api/Instructor/GetOneInstructorById/${instructorId}`,
    type: "GET",
    success: function (response) {
      console.log("Instructor Data:", response);

      if (response) {
        $("#userName").text("Welcome, " + response.instructorName );

        // Profile Image Handling
        if (response.profileImage) {
          $("#userImage")
            .attr("src", "/Instructor_Images/" + response.profileImage)
            .show();
          $("#userInitials").hide(); // Hide initials when an image is available
        } else {
          let initials = response.instructorName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
          $("#userInitials").text(initials).show();
          $("#userImage").hide(); // Hide image if no profile picture
        }
      }
    },
    error: function (xhr) {
      alert("Error fetching instructor details: " + xhr.responseText);
    },
  });


  var drawer = $("#profileDrawer")
    .kendoDrawer({
      template: `
          <div class="k-drawer-content">
            <div class="k-drawer-title">Update Instructor Profile</div>
            <form id="profileForm" class="profile-form">
             <div class="mb-2">
                <label for="instructorName2" class="form-label">Instructor Name</label>
                <input id="instructorName2" class="form-control k-no-click" readonly
                      style="padding: 4px 8px; pointer-events: none; cursor: default;"/>
                <span class="text-danger validation-message" id="nameError"></span>
              </div>

              <div class="mb-2">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" readonly  style="padding: 4px 8px; pointer-events: none; cursor: default;">
              </div>
              <div class="mb-2">
                <label for="mobile" class="form-label">Mobile Number</label>
                <input id="mobile" />
                <span class="text-danger validation-message" id="mobileError"></span>
              </div>
              <div class="mb-2">
                <label for="gender" class="form-label">Gender</label>
                <select id="gender"></select>
                <span class="text-danger validation-message" id="genderError"></span>
              </div>
              <div class="mb-2">
                <label for="dob" class="form-label">Date of Birth</label>
                <input id="dob"/>
                <span class="text-danger validation-message" id="dobError"></span>
              </div>
              <div class="mb-2">
                <label class="form-label me-2">Profile Image</label>
                <div class="d-flex align-items-center">
                  <!-- Image Preview (Initially Hidden) -->
                  <img id="imagePreviewInstructor" class="instructor-image-preview ms-2" src="" alt="Preview" class="ms-2"
                    style="width: 86px; height: auto; margin-right: 14px;  object-fit: cover;">
                  <!-- Custom File Upload Button -->
                  <div class="custom-file-upload">
                    <label for="profileImage" class="btn btn-primary btn-sm">Upload Image</label>
                    <input type="file" id="profileImage" accept="image/*">
                  </div>
                </div>
                <span class="text-danger validation-message" id="imageError"></span>
              </div>
              <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-secondary me-2" id="cancelProfileBtn">Cancel</button>
                <button type="submit" class="btn btn-primary" id="saveProfileBtn" disabled>Save Changes</button>
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
    })
    .data("kendoDrawer");

  // Initialize Kendo UI Components with Validations
  // $("#instructorName2").kendoTextBox({
  //   placeholder: "Enter instructor name",
  // });
  $("#mobile").kendoMaskedTextBox({
    mask: "0000000000",
    placeholder: "__________",
  });
  $("#gender").kendoDropDownList({
    dataSource: ["Male", "Female", "Other"],
    placeholder: "Select gender...",
  });
  $("#dob").kendoDatePicker({
    format: "yyyy-MM-dd",
    value: new Date(2000, 0, 1),
    max: new Date(), // Cannot select future dates
    min: new Date(1920, 0, 1), // Reasonable minimum date
  });

  // Store original form values to detect changes
  let originalFormValues = {
    mobile: "",
    gender: "",
    dob: null,
    profileImage: null,
  };

  // Function to check if form has changed
  function checkFormChanged() {
    const currentMobile = $("#mobile").val();
    const currentGender = $("#gender").data("kendoDropDownList").value();
    const currentDob = $("#dob").data("kendoDatePicker").value();
    const hasNewImage = $("#profileImage")[0].files.length > 0;

    // Compare current values with original values
    const hasChanges =
      currentMobile !== originalFormValues.mobile ||
      currentGender !== originalFormValues.gender ||
      (currentDob &&
        originalFormValues.dob &&
        currentDob.getTime() !== originalFormValues.dob.getTime()) ||
      hasNewImage;

    // Enable/disable save button based on changes
    $("#saveProfileBtn").prop("disabled", !hasChanges);
  }

  // Function to Show Profile Drawer and Fetch Data
  window.showProfileDrawer = function () {
    $("#profileDrawer").show(); // Show the drawer (Kendo or your custom implementation)
    $(".user-profile-container").addClass("no-hover");
    $(".validation-message").html("");
    if (instructorId) {
      console.log("Extracted Instructor ID:", instructorId);
    }
    drawer.show();
    $.ajax({
      url: `${uri}/api/Instructor/GetOneInstructorById/${instructorId}`,
      type: "GET",
      success: function (response) {
        console.log(response.profileImage);
        $("#instructorName2").val(response.instructorName);
        $("#email").val(response.email);
        $("#mobile").val(response.mobile);
        $("#gender").data("kendoDropDownList").value(response.gender);

        // Parse date and set in date picker
        if (response.dob) {
          const dobDate = new Date(response.dob);
          $("#dob").data("kendoDatePicker").value(dobDate);
        }

        if (response.profileImage) {
          $("#imagePreviewInstructor")
            .attr("src", "/Instructor_Images/" + response.profileImage)
            .show();
        }

        // Store original values after fetching
        originalFormValues = {
          mobile: response.mobile,
          gender: response.gender,
          dob: response.dob ? new Date(response.dob) : null,
          profileImage: response.profileImage,
        };

        // Disable save button initially
        $("#saveProfileBtn").prop("disabled", true);
      },
      error: function (xhr) {
        alert("Error fetching instructor details: " + xhr.responseText);
      },
    });
  };

  // Handle Image Preview and track changes
  $(document).on("change", "#profileImage", function () {
    var file = this.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        if (file.size <= 5 * 1024 * 1024) {
          // 5MB max file size
          var reader = new FileReader();
          reader.onload = function (e) {
            $("#imagePreviewInstructor").attr("src", e.target.result).show();
          };
          reader.readAsDataURL(file);
          $("#imageError").text("");

          // Check for form changes since we have a new image
          checkFormChanged();
        } else {
          $("#imageError").text("Image size should be less than 5MB.");
          this.value = "";
        }
      } else {
        $("#imageError").text("Please select a valid image file.");
        this.value = "";
      }
    }
  });

  // Close Drawer on Cancel Button Click
  $(document).on("click", "#cancelProfileBtn", function () {
    $("#profileDrawer").hide(); // Hide the drawer
    $(".user-profile-container").removeClass("no-hover"); // Enable hover again
    drawer.hide();
  });

  // Track changes for mobile input
  $("#mobile").on("input blur", function () {
    let value = $(this).val().replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length !== 10) {
      $("#mobileError").text("Enter a valid 10-digit mobile number.");
    } else if (value.startsWith("0")) {
      $("#mobileError").text("Mobile number cannot start with 0.");
    } else {
      $("#mobileError").text("");
    }

    // Check for form changes
    checkFormChanged();
  });

  // Track changes for gender dropdown
  $("#gender")
    .data("kendoDropDownList")
    .bind("change", function () {
      let value = this.value();
      if (!value) {
        $("#genderError").text("Please select gender.");
      } else {
        $("#genderError").text("");
      }

      // Check for form changes
      checkFormChanged();
    });

  // Track changes for date of birth
  $("#dob")
    .data("kendoDatePicker")
    .bind("change", function () {
      let value = this.value();
      if (!value) {
        $("#dobError").text("Please select date of birth.");
      } else {
        // Calculate age
        let today = new Date();
        let birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          $("#dobError").text("Instructor must be at least 18 years old.");
        } else if (age > 80) {
          $("#dobError").text("Please verify the date of birth.");
        } else {
          $("#dobError").text("");
        }
      }

      // Check for form changes
      checkFormChanged();
    });

  // Form Submission with Validation
  $(document).on("submit", "#profileForm", function (e) {
    e.preventDefault();
    $(".validation-message").text("");
    let valid = true;
    const instructorName = $("#instructorName2").val().trim();
    const mobile = $("#mobile").val().replace(/\D/g, "");
    const gender = $("#gender").data("kendoDropDownList").value();
    const dob = $("#dob").data("kendoDatePicker").value();

    // Validate instructor name
    if (instructorName === "") {
      $("#nameError").text("Instructor name is required.");
      valid = false;
    } else if (instructorName.length < 3) {
      $("#nameError").text("Name must be at least 3 characters.");
      valid = false;
    }

    // Validate mobile
    if (mobile.length !== 10) {
      $("#mobileError").text("Enter a valid 10-digit mobile number.");
      valid = false;
    } else if (mobile.startsWith("0")) {
      $("#mobileError").text("Mobile number cannot start with 0.");
      valid = false;
    } else {
      $("#mobileError").text("");
    }

    // Validate gender
    if (!gender) {
      $("#genderError").text("Please select gender.");
      valid = false;
    }

    // Validate DOB and calculate age
    if (!dob) {
      $("#dobError").text("Please select date of birth.");
      valid = false;
    } else {
      let today = new Date();
      let birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        $("#dobError").text("Instructor must be at least 18 years old.");
        valid = false;
      } else if (age > 80) {
        $("#dobError").text("Please verify the date of birth.");
        valid = false;
      }
    }

    if (!valid) return;

    var formData = new FormData();
    formData.append("instructorId", instructorId);
    formData.append("instructorName", instructorName);
    formData.append("mobile", mobile);
    formData.append("gender", gender);
    formData.append("dob", dob ? dob.toISOString() : "");
    formData.append("status", "null"); // Explicitly send "null" as a string
    formData.append("password", "1234567890Qq!");
    formData.append("confirmPassword", "1234567890Qq!");
    formData.append("association", "null");
    formData.append("specialization", "null");

    // Keep existing email field but don't allow modification
    formData.append("email", $("#email").val());

    var imageFile = $("#profileImage")[0].files[0];
    if (imageFile) {
      formData.append("profileImageFile", imageFile);
    }

    console.log($("#profileImage")[0].files[0]);

    $.ajax({
      url: `${uri}/api/Instructor/edit-profile-basic`,
      type: "POST",
      processData: false,
      contentType: false,
      data: formData,
      success: function () {
        Swal.fire({
          title: "Success!",
          text: "Instructor profile updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          drawer.hide();
          $("#profileDrawer").hide();
          $(".user-profile-container").removeClass("no-hover");

          // Get the uploaded image file
          var imageFile = $("#profileImage")[0].files[0];
          if (imageFile) {
            var imageUrl = URL.createObjectURL(imageFile);
            // Update profile image dynamically
            $("#userImage").attr("src", imageUrl).show();
            $("#userInitials").hide(); // Hide initials if image is updated
          }
        });
      },
      error: function (xhr) {
        Swal.fire({
          title: "Error!",
          text: "Error updating profile " + xhr.responseText,
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });
  });

  $(document).mouseup(function (e) {
    var drawerContainer = $("#profileDrawer"); // Drawer container
    var drawerWidget = $(".k-widget.k-drawer"); // Kendo Drawer wrapper
    var genderDropdown = $(".k-animation-container"); // Dropdown list container

    // Check if the clicked area is NOT inside the drawer or the dropdown list
    if (
      !drawerContainer.is(e.target) &&
      drawerContainer.has(e.target).length === 0 &&
      !drawerWidget.is(e.target) &&
      drawerWidget.has(e.target).length === 0 &&
      !genderDropdown.is(e.target) &&
      genderDropdown.has(e.target).length === 0
    ) {
      drawer.hide();
      drawerContainer.hide();
      $(".user-profile-container").removeClass("no-hover");
    }
  });
});



// Load dashboard data
loadDashboardData();

// Function to load all dashboard data
function loadDashboardData() {
  // Load class counts
  $.ajax({
    url: `${uri}/api/Instructor/ClassCountByInstructor/${instructorId}`,
    type: "GET",
    success: function (response) {
      if (response.success) {
        $("#totalClassesCount").text(response.count);
      }
    },
    error: function () {
      // Fallback to static data
      $("#totalClassesCount").text("12");
    },
  });

  // Load upcoming class count
  $.ajax({
    url: `${uri}/api/Instructor/UpcomingClassCountByInstructor/${instructorId}`,
    type: "GET",
    success: function (response) {
      if (response.count >=0) {
        $("#upcomingClassesCount").text(response.count);
      }
    },
    error: function () {
      // Fallback to static data
      $("#upcomingClassesCount").text("8");
    },
  });

  // Load upcoming classes table
  $.ajax({
    url: `${uri}/api/Instructor/UpcomingClassDetailsByInstructor/${instructorId}`,
    type: "GET",
    success: function (response) {
      if (response.success) {
        renderUpcomingClassesTable(response.data );
      }
    },
    error: function () {
      // Keep showing static data
      console.log("Error loading upcoming classes");
    },
  });

  // Load total student count
  $.ajax({
    url: `${uri}/api/Instructor/UserCountByInstructor/${instructorId}`,
    type: "GET",
    success: function (response) {
      if (response.success) {
        $("#totalStudentsCount").text(response.count);
        // Update the student engagement card
        updateStudentStats(response.count);
      }
    },
    error: function () {
      // Fallback to static data
      $("#totalStudentsCount").text("142");
      updateStudentStats(142);
    },
  });
}

// Function to render upcoming classes table
function renderUpcomingClassesTable(classes) {
  if (!classes || classes.length === 0) {return "Class Not found"};

  let tableHtml = "";
  classes.forEach(function (c) {
    tableHtml += `
                <tr>
                    <td>${c.className}</td>
                    <td>${formatDate(c.startDate)}</td>
                    <td>${formatTime(c.startTime)}</td>
                    <td>${c.maxCapacity - c.availableCapacity}/${c.maxCapacity
      }</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="showClassDetails(${c.classId
      })">Details</button>
                    </td>
                </tr>
            `;
  });

  $("#upcomingClassesTableBody").html(tableHtml);
}

// Helper functions
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timeString) {
  if (!timeString) return "";
  return timeString.substring(0, 5);
}

// Add this helper function to update student stats
function updateStudentStats(totalStudents) {
  const retentionRate = "87%"; // This could come from another API

  // Update the student engagement card
  $("#totalStudentsCount").text(totalStudents);
  $("#retentionRate").text(retentionRate);
}

// Close popup when clicking close button or outside
$(".close-popup, .class-details-popup").on("click", function (e) {
  if (e.target === this) {
    $("#classDetailsPopup").fadeOut(300);
  }
});

// Prevent popup from closing when clicking inside content
$(".class-details-content").on("click", function (e) {
  e.stopPropagation();
});

// Modify the existing performLogout function
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


/* Do Not Remove */
/* Notification JavaScript Starts*/
/* Includes All the JS Functions for Notification Badge, Icons, Buttons and List */

// var userId = "29"; // Change this dynamically based on logged-in user
let userId_ = getUserIdFromToken();
let userId = userId_.toString();
var role = "instructor"; // instructor or user
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