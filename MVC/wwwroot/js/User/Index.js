let uri = "http://localhost:8080";
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

async function getBookedClasses() {
    try {
        const response = await $.ajax({
            url: `${uri}/api/Class/GetBookedClassesByUser/${userId}`,
            method: 'GET'
        });
        
        if (response.success && response.data) {
            return response.data.map(c => c.classId);
            console.log("Booked Class IDs:", response.data.map(c => c.classId)); // Log the booked class IDs
        }
        return [];
    } catch (error) {
        console.error('Error fetching booked classes:', error);
        return [];
    }
}
// Update the loadClasses function
async function loadClasses() {
  const classGrid = document.getElementById('classes');
  const loading = document.getElementById('loading');

  try {
    const bookedClassIds = await getBookedClasses();
    console.log('Booked Class IDs:', bookedClassIds); // Log the booked class IDs
    const response = await fetch('http://localhost:8080/api/Class/GetAllActiveClasses');
    const result = await response.json();

    loading.style.display = 'none';

    if (!result.data || !Array.isArray(result.data)) {
      throw new Error('Invalid data format received from API');
    }
    classGrid.innerHTML = '';
    result.data.forEach(classItem => {
        const isBooked = bookedClassIds.includes(classItem.classId);
      // Function to extract description text
      const getDescription = (desc) => {
        if (!desc) return 'No description available';
        if (typeof desc === 'string') return desc;
        if (typeof desc === 'object') {
          // Handle nested description object
          return desc.description || desc.text || Object.values(desc)[0] || 'No description available';
        }
        return 'No description available';
      };
      const buttonHtml = isBooked 
      ? `<button class="booked-btn" disabled>Booked</button>`
      : `<button onclick="viewClassDetails(${classItem.classId})">Book Now</button>`;

      const card = `
        <div class="class-card">
          <img src="/ClassAssets/${classItem.assets.banner}" alt="${classItem.className}" />
          <div class="card-content">
            <h2>${classItem.className}</h2>
            <p>${getDescription(classItem.description)}</p>
            <p><strong>Instructor:</strong> ${classItem.instructorName || 'Not assigned'}</p>
            <p><strong>Duration:</strong> ${classItem.duration || 'N/A'} Hours</p>
            <p><strong>Capacity:</strong> ${classItem.maxCapacity || classItem.capacity || 'N/A'} spots</p>
             ${buttonHtml}
          </div>
        </div>
      `;
      classGrid.insertAdjacentHTML('beforeend', card);
    });
  } catch (error) {
    loading.innerHTML = 'Error loading classes. Please try again later.';
    loading.classList.add('error-message');
    console.error('Error:', error);
  }
}

// Function to view class details
function viewClassDetails(classId) {
  // Redirect to the class details page with the class ID
  window.location.href = `/User/Classdetails?id=${classId}`;
}

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

// Load classes when the page loads
document.addEventListener('DOMContentLoaded', loadClasses);

// Profile dropdown toggle
document.querySelector('.profile-img').addEventListener('click', function () {
  document.querySelector('.profile-dropdown').style.display =
    document.querySelector('.profile-dropdown').style.display === 'block' ? 'none' : 'block';
});

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
            $(".profile-dropdown").hide();
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