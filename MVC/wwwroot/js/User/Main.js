let uri = "http://localhost:8080";
// Function to format date and time
var userId;
let drawer = null;

function setUserName() {
  const token = localStorage.getItem("authToken");
  if (token) {
    const decoded = parseJwt(token);
    if (decoded && decoded.UserObject) {
      const userObj = JSON.parse(decoded.UserObject);
      const userName = userObj.name || userObj.userName || "User";
      document.getElementById("name").innerHTML = `<b>${userName}</b>`;
    }
  }
}

// Add this function to load user wallet balance
function loadUserWalletBalance() {
  const userId = getUserIdFromToken();
  console.log("Fetching wallet balance for userId:", userId); // Debug log
  if (!userId || isNaN(userId)) return;

  fetch(`${uri}/api/User/GetUserBalanceById/${userId}`)
    .then((res) => res.json())
    .then((response) => {
      if (
        response.success &&
        response.data &&
        typeof response.data.balance !== "undefined"
      ) {
        document.getElementById(
          "userWalletBalance"
        ).textContent = `₹${response.data.balance}`;
      } else {
        document.getElementById("userWalletBalance").textContent = "₹0";
        console.warn("Failed to fetch wallet balance:", response.message);
      }
    })
    .catch((err) => {
      document.getElementById("userWalletBalance").textContent = "₹0";
      console.error("Error fetching wallet balance:", err);
    });
}

// Call this function when page loads
window.onload = function () {
  setUserName();
  userId = getUserIdFromToken();
  loadUserWalletBalance(); // Add this line to load wallet balance
};

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
    console.log(
      "using parsing printing its type " +
        typeof JSON.parse(decoded.UserObject).userId
    );
    let userId = JSON.parse(decoded.UserObject).userId;
    console.log("user id is +" + userId);

    return JSON.parse(decoded.UserObject).userId;
  }
  console.warn("Invalid or malformed token.");
  return null;
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
const waitlistData = {
  SpinRide: 10,
  "Power Yoga": 0,
};

document.querySelectorAll(".class-card").forEach((card) => {
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

function openFeedback(classId, className, instructorName) {
  // Store class details for feedback submission
  document.getElementById("feedbackModal").dataset.classId = classId;
  document.getElementById("feedbackModal").dataset.className = className;
  document.getElementById("feedbackModal").dataset.instructorName =
    instructorName;
  document.getElementById("feedbackModal").style.display = "flex";
}
document.querySelector(".profile-img").addEventListener("click", function () {
  document.querySelector(".profile-dropdown").style.display =
    document.querySelector(".profile-dropdown").style.display === "block"
      ? "none"
      : "block";
});

function closeFeedback() {
  document.getElementById("feedbackModal").style.display = "none";
  resetFeedback();
}

function resetFeedback() {
  document.getElementById("feedbackText").value = "";
  selectedRating = 0;
  document
    .querySelectorAll("#starRating span")
    .forEach((s) => s.classList.remove("active"));
}

function submitFeedback() {
  const feedback = document.getElementById("feedbackText").value;
  if (selectedRating === 0) {
    alert("Please select a rating.");
    return;
  }

  // Simulate submit
  alert(`⭐ Rating: ${selectedRating}\n💬 Feedback: ${feedback}`);
  closeFeedback();
}

// Star Selection Logic
document.querySelectorAll("#starRating span").forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = parseInt(star.getAttribute("data-value"));
    document.querySelectorAll("#starRating span").forEach((s) => {
      s.classList.toggle(
        "active",
        parseInt(s.getAttribute("data-value")) <= selectedRating
      );
    });
  });
});
async function getBookedClasses() {
  try {
    const response = await $.ajax({
      url: `${uri}/api/Class/GetBookedClassesByUser/${userId}`,
      method: "GET",
    });

    if (response.success && response.data) {
      return response.data.map((c) => c.classId);
      console.log(
        "Booked Class IDs:",
        response.data.map((c) => c.classId)
      ); // Log the booked class IDs
    }
    return [];
  } catch (error) {
    console.error("Error fetching booked classes:", error);
    return [];
  }
}
// Update the loadClasses function
async function loadClasses() {
  const classGrid = document.getElementById("classes");
  const loading = document.getElementById("loading");

  try {
    const bookedClassIds = await getBookedClasses();
    console.log("Booked Class IDs:", bookedClassIds); // Log the booked class IDs
    const response = await fetch(
      "http://localhost:8080/api/Class/GetAllActiveClasses"
    );
    const result = await response.json();

    loading.style.display = "none";

    if (!result.data || !Array.isArray(result.data)) {
      throw new Error("Invalid data format received from API");
    }
    classGrid.innerHTML = "";
    result.data.forEach((classItem) => {
      const isBooked = bookedClassIds.includes(classItem.classId);
      // Function to extract description text
      const getDescription = (desc) => {
        if (!desc) return "No description available";
        if (typeof desc === "string") return desc;
        if (typeof desc === "object") {
          // Handle nested description object
          return (
            desc.description ||
            desc.text ||
            Object.values(desc)[0] ||
            "No description available"
          );
        }
        return "No description available";
      };
      const buttonHtml = isBooked
        ? `<button class="booked-btn" disabled>Booked</button>`
        : `<button onclick="viewClassDetails(${classItem.classId})">Book Now</button>`;

      const card = `
        <div class="class-card">
          <img src="/ClassAssets/${
            classItem.assets.banner || "/img/fitness.jpg"
          }" alt="${classItem.className}" />
          <div class="card-content">
            <h2>${classItem.className}</h2>
            <p>${getDescription(classItem.description)}</p>
            <p><strong>Instructor:</strong> ${
              classItem.instructorName || "Not assigned"
            }</p>
            <p><strong>Duration:</strong> ${
              classItem.duration || "N/A"
            } Hours</p>
            <p><strong>Capacity:</strong> ${
              classItem.maxCapacity || classItem.capacity || "N/A"
            } spots</p>
             ${buttonHtml}
          </div>
        </div>
      `;
      classGrid.insertAdjacentHTML("beforeend", card);
    });
  } catch (error) {
    loading.innerHTML = "Error loading classes. Please try again later.";
    loading.classList.add("error-message");
    console.error("Error:", error);
  }
}

// Function to view class details
function viewClassDetails(classId) {
  // Redirect to the class details page with the class ID
  window.location.href = `/User/Classdetails/${classId}`;
}

function myclasses() {
  // Redirect to the class details page with the class ID
  window.location.href = `/User/MyClasses`;
}

function Schedule() {
  // Redirect to the class details page with the class ID
  window.location.href = `/User/Schedule`;
}

function ExploreBlogs() {
    // Redirect to the class details page with the class ID
    window.location.href = `/User/ExploreBlogs`;
}
function BMI() {
    // Redirect to the class details page with the class ID
    window.location.href = `/User/BMICalculator`;
}

function home() {
  // Redirect to the class details page with the class ID
  window.location.href = `/User/Dashboard`;
}
function classes() {
  // Redirect to the class details page with the class ID
  window.location.href = `/User/Classes`;
}

// Profile dropdown toggle
document.querySelector(".profile-img").addEventListener("click", function () {
  document.querySelector(".profile-dropdown").style.display =
    document.querySelector(".profile-dropdown").style.display === "block"
      ? "none"
      : "block";
});

function performLogout() {
  Swal.fire({
    title: "Logging Out",
    text: "Please wait...",
    timer: 1000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      // Clear the authentication token
      localStorage.removeItem("authToken");
    },
  }).then(() => {
    // Redirect to login page
    window.location.href = "/Auth/Login";
  });
}

// Add a showLogoutConfirmation function
function showLogoutConfirmation() {
  Swal.fire({
    title: "Logout Confirmation",
    text: "Are you sure you want to logout?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#ff4d4d",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, Logout",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      performLogout();
    }
  });
}

document.addEventListener("DOMContentLoaded", loadClasses);

// Profile dropdown toggle
document.querySelector(".profile-img").addEventListener("click", function () {
  document.querySelector(".profile-dropdown").style.display =
    document.querySelector(".profile-dropdown").style.display === "block"
      ? "none"
      : "block";
});

// Auto-attach openFeedback to all feedback buttons
document.querySelectorAll(".cancel-btn").forEach((btn) => {
  if (btn.textContent.includes("Feedback")) {
    btn.onclick = openFeedback;
  }
});

document.querySelector(".profile-img").addEventListener("click", function () {
  document.querySelector(".profile-dropdown").style.display =
    document.querySelector(".profile-dropdown").style.display === "block"
      ? "none"
      : "block";
});

// Initialize drawer variable but don't set it yet
$(document).ready(function() {
    // Load user profile image and wallet balance
    loadUserProfileImage();
    loadUserWalletBalance();
    
    // Initialize Kendo drawer if element exists
    if ($("#profileDrawer").length) {
        try {
            drawer = $("#profileDrawer")
                .kendoDrawer({
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
                })
                .data("kendoDrawer");
            
            // Initialize Kendo UI Components with Validations
            $("#userName").kendoTextBox({
                placeholder: "Enter your name",
            });

            $("#phone").kendoMaskedTextBox({
                mask: "0000000000",
                placeholder: "__________",
            });

            $("#height").kendoNumericTextBox({
                min: 100,
                max: 250,
                step: 1,
                format: "# cm",
            });

            $("#weight").kendoNumericTextBox({
                min: 30,
                max: 200,
                step: 1,
                format: "#.00 kg",
            });

            $("#goal").kendoMultiSelect({
                dataSource: [
                    "Weight Loss",
                    "Muscle Gain",
                    "General Fitness",
                    "Endurance Training",
                    "Flexibility Improvement",
                    "Sports Specific",
                    "Weight Management",
                ],
                placeholder: "Select goals...",
            });

            $("#medicalCondition").kendoMultiSelect({
                dataSource: [
                    "Diabetes",
                    "High Blood Pressure",
                    "Heart Disease",
                    "Asthma",
                    "Arthritis",
                    "Back Pain",
                    "None",
                    "Hypertension",
                ],
                placeholder: "Select medical conditions...",
            });
            
            console.log("Kendo Drawer successfully initialized");
        } catch (error) {
            console.error("Failed to initialize Kendo Drawer:", error);
        }
    } else {
        console.warn("#profileDrawer element not found in the document");
    }

    // Add this after the drawer initialization in your document.ready function

    // Initialize handlers for the profile form elements
    $(document).on("change", "#profileImage", function() {
        const file = this.files[0];
        if (file && file.type.startsWith("image/")) {
            if (file.size <= 5 * 1024 * 1024) { // 5MB max
                const reader = new FileReader();
                reader.onload = function(e) {
                    $("#imagePreview").attr("src", e.target.result).show();
                };
                reader.readAsDataURL(file);
                $("#imageError").text("");
            } else {
                $("#imageError").text("Image size should be less than 5MB.");
                this.value = "";
                $("#imagePreview").hide();
            }
        } else if (file) {
            $("#imageError").text("Please select a valid image file.");
            this.value = "";
            $("#imagePreview").hide();
        }
    });

    // Handle cancel button
    $(document).on("click", "#cancelProfileBtn", function() {
        drawer.hide();
    });

    // Ensure the form submission is handled
    $("#profileForm").on("submit", function(e) {
        e.preventDefault();
        
        // Create form data for submission
        const formData = new FormData();
        formData.append("userId", getUserIdFromToken());
        formData.append("userName", $("#userName").val());
        formData.append("mobile", $("#phone").val());
        formData.append("height", $("#height").data("kendoNumericTextBox").value());
        formData.append("weight", $("#weight").data("kendoNumericTextBox").value());
        formData.append("goal", $("#goal").data("kendoMultiSelect").value().join(", "));
        formData.append("medicalCondition", $("#medicalCondition").data("kendoMultiSelect").value().join(", "));
        
        // Add the profile image if selected
        const imageFile = $("#profileImage")[0].files[0];
        if (imageFile) {
            formData.append("profileImageFile", imageFile);
        }
        
        // Fix 1: Use a gender value that's 10 characters or less
        formData.append("gender", "Other");  // "Other" is only 5 characters
        
        formData.append("email", $("#email").val());
        formData.append("password", "Password@1234");
        formData.append("confirmPassword", "Password@1234");
        
        // Fix 2: Add the required activationToken field
        formData.append("activationToken", "token_12345");
        
        $.ajax({
            url: `${uri}/api/User/UserUpdateProfile`,
            type: "PUT",
            data: formData,
            processData: false,
            contentType: false,
            success: function() {
                Swal.fire({
                    title: "Success!",
                    text: "Your profile has been updated successfully.",
                    icon: "success"
                });
                drawer.hide();
                
                // Refresh profile image in navbar
                setTimeout(loadUserProfileImage, 500);
                
                // Dispatch event that profile was updated
                document.dispatchEvent(new Event("profileUpdated"));
            },
            error: function(xhr) {
                // Enhanced error handling to show validation issues
                let errorMessage = "Failed to update your profile. Please try again.";
                
                // Try to extract specific error messages from the response
                if (xhr.responseJSON && xhr.responseJSON.errors) {
                    errorMessage = Object.entries(xhr.responseJSON.errors)
                        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
                        .join('\n');
                }
                
                Swal.fire({
                    title: "Error",
                    text: errorMessage,
                    icon: "error"
                });
                console.error("Profile update failed:", xhr);
            }
        });
    });
});

// Update the showProfileDrawer function to handle errors
window.showProfileDrawer = function() {
    const userId = getUserIdFromToken();
    if (!userId) {
        console.error("User ID not available");
        Swal.fire("Error", "Unable to load profile. Please try again later.", "error");
        return;
    }
    
    // Check if drawer is initialized
    if (!drawer) {
        console.error("Kendo drawer not initialized");
        Swal.fire("Error", "Profile drawer failed to load. Please refresh the page and try again.", "error");
        return;
    }
    
    try {
        drawer.show();
        
        // Show loading indicator
        const loadingHtml = '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><p>Loading your profile data...</p></div>';
        $("#profileForm").html(loadingHtml);
        
        // Fetch user profile data
        $.ajax({
            url: `${uri}/api/User/GetUserById/${userId}`,
            type: "GET",
            success: function(response) {
                console.log("Profile data received:", response);
                
                // Check if the response has data
                const userData = response.data || response;
                
                // Restore the form
                $("#profileForm").html(`
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
                `);
                
                // Reinitialize Kendo widgets
                $("#userName").kendoTextBox({
                    placeholder: "Enter your name",
                });

                $("#phone").kendoMaskedTextBox({
                    mask: "0000000000",
                    placeholder: "__________",
                });

                $("#height").kendoNumericTextBox({
                    min: 100,
                    max: 250,
                    step: 1,
                    format: "# cm",
                });

                $("#weight").kendoNumericTextBox({
                    min: 30,
                    max: 200,
                    step: 1,
                    format: "#.00 kg",
                });

                $("#goal").kendoMultiSelect({
                    dataSource: [
                        "Weight Loss",
                        "Muscle Gain",
                        "General Fitness",
                        "Endurance Training",
                        "Flexibility Improvement",
                        "Sports Specific",
                        "Weight Management",
                    ],
                    placeholder: "Select goals...",
                });

                $("#medicalCondition").kendoMultiSelect({
                    dataSource: [
                        "Diabetes",
                        "High Blood Pressure",
                        "Heart Disease",
                        "Asthma",
                        "Arthritis",
                        "Back Pain",
                        "None",
                        "Hypertension",
                    ],
                    placeholder: "Select medical conditions...",
                });
                
                // Set form values from response data
                $("#userName").val(userData.userName || '');
                $("#email").val(userData.email || '');
                $("#phone").val(userData.mobile || '');
                
                // Safely set numeric values
                try {
                    $("#height").data("kendoNumericTextBox").value(Number(userData.height) || null);
                    $("#weight").data("kendoNumericTextBox").value(Number(userData.weight) || null);
                } catch (e) {
                    console.error("Error setting numeric values:", e);
                }
                
                // Safely set multiselect values
                try {
                    if (userData.goal) {
                        const goalValues = userData.goal.split(",").map(g => g.trim());
                        $("#goal").data("kendoMultiSelect").value(goalValues);
                    }
                    
                    if (userData.medicalCondition) {
                        const medicalValues = userData.medicalCondition.split(",").map(mc => mc.trim());
                        $("#medicalCondition").data("kendoMultiSelect").value(medicalValues);
                    }
                } catch (e) {
                    console.error("Error setting multiselect values:", e);
                }
                
                // Set profile image if available
                if (userData.profileImage) {
                    $("#imagePreview").attr("src", `../User_Images/${userData.profileImage}`).show();
                }
                
                // Set up cancel button
                $("#cancelProfileBtn").on("click", function() {
                    drawer.hide();
                });
            },
            error: function(xhr) {
                console.error("Error fetching user details:", xhr);
                Swal.fire("Error", "Failed to load your profile information.", "error");
                drawer.hide();
            }
        });
    } catch (error) {
        console.error("Error showing profile drawer:", error);
        Swal.fire("Error", "Unable to open profile editor. Please refresh the page.", "error");
    }
};

async function fetchEnrolledClassCount(userId) {
  try {
    const response = await fetch(
      `${uri}/api/User/EnrolledClassCountByUser/${userId}`
    );
    const data = await response.json();

    if (data.success && data.data && data.data.count >= 0) {
      const label = data.data.count === 1 ? "Class" : "Classes";
      document.getElementById(
        "active-classes"
      ).textContent = `${data.data.count} Enrolled ${label}`;
    } else {
      document.getElementById("active-classes").textContent =
        "Failed to load classes";
      console.warn("API error:", data.message || "Unknown issue");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    document.getElementById("active-classes").textContent =
      "Error loading classes";
  }
}

async function fetchUpcomingClassCount(userId) {
  try {
    const response = await fetch(
      `${uri}/api/User/UpcomingClassCountByUser/${userId}`
    );
    const data = await response.json();

    if (data.success && data.data && data.data.count >= 0) {
      const label = data.data.count === 1 ? "Class" : "Classes";
      document.getElementById(
        "upcoming-classes"
      ).textContent = `${data.data.count} Upcoming ${label}`;
    } else {
      document.getElementById("upcoming-classes").textContent =
        "Failed to load classes";
      console.warn("API error:", data.message || "Unknown issue");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    document.getElementById("upcoming-classes").textContent =
      "Error loading classes";
  }
}

async function fetchCompletedClassCount(userId) {
  try {
    const response = await fetch(
      `${uri}/api/User/CompletedClassCountByUser/${userId}`
    );
    const data = await response.json();

    if (data.success && data.data && data.data.count >= 0) {
      const label = data.data.count === 1 ? "Class" : "Classes";
      document.getElementById(
        "completed-classes"
      ).textContent = `🥇 ${data.data.count} ${label} Completed`;
    } else {
      document.getElementById("completed-classes").textContent =
        "🥇 Failed to load classes";
      console.warn("API error:", data.message || "Unknown issue");
    }
  } catch (error) {
    console.error("Error fetching completed class count:", error);
    document.getElementById("completed-classes").textContent =
      "🥇 Error loading classes";
  }
}

fetchUpcomingClassCount(userId);
fetchCompletedClassCount(userId);
fetchEnrolledClassCount(userId);

function loadBookedClasses(userId) {
  if (!userId) {
    Swal.fire({
      icon: "error",
      title: "Authentication Required",
      text: "Please login to view your booked classes",
    });
    return;
  }

  $.ajax({
    url: `http://localhost:8080/api/Class/GetBookedClassesByUser/${userId}`,
    method: "GET",
    success: function (response) {
      if (response.success && response.data) {
        displayClasses(response.data);
      } else {
        console.error("Failed to load classes:", response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading classes:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load your booked classes",
      });
    },
  });
}

function getClassStatus(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return "upcoming";
  } else if (now > end) {
    return "completed";
  } else {
    return "live";
  }
}

function displayClasses(classes) {
  const classGrid = document.querySelector(".class-grid");
  classGrid.innerHTML = "";

  classes.forEach((classItem) => {
    const startDate = new Date(classItem.startDate);
    const endDate = new Date(classItem.endDate);
    const status = getClassStatus(startDate, endDate);

    // Add different styling for live status
    const statusStyle =
      status === "live"
        ? "background-color: #FF6363 ; color: #000000;"
        : status === "completed"
        ? "background-color:rgb(114, 215, 67) ; color: #0f0f0f;"
        : "";

    const classCard = `
            <div class="class-card" data-status="${status}" data-class-id="${
      classItem.classId
    }">
                <img src="/ClassAssets/${classItem.assets.banner}" alt="${
      classItem.className
    }" class="class-img" />
                <div class="class-info">
                    <h3>${classItem.className}</h3>
                    <p><strong>Instructor:</strong> ${
                      classItem.instructorName
                    }</p>
                    <p><strong>Schedule:</strong> ${formatDate(
                      startDate
                    )} - ${formatDate(
      endDate
    )} | ${classItem.startTime.substring(0, 5)} - ${classItem.endTime.substring(
      0,
      5
    )}</p>
                    <span class="status-tag" style="${statusStyle}">${
      status.charAt(0).toUpperCase() + status.slice(1)
    }</span>
                    ${
                      classItem.waitList != 0 &&
                      status != "completed" &&
                      status != "live"
                        ? `<div class="waitlist-box">WL: ${classItem.waitList}</div>`
                        : ""
                    }
                </div>
                ${
                  status === "completed"
                    ? `<button class="cancel-btn" style="background-color: #facc15; color: #0f0f0f; border: none;" 
                    onclick="openFeedback('${classItem.classId}', '${classItem.className}', '${classItem.instructorName}')">
                    Give Feedback
                </button>`
                    : `<button class="cancel-btn" onclick="cancelBooking('${classItem.classId}', '${classItem.className}')">
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
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function cancelBooking(classId, className) {
  const userId = getUserIdFromToken();

  Swal.fire({
    title: "Cancel Booking?",
    text: `Are you sure you want to cancel your booking for ${className}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, cancel it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `http://localhost:8080/api/Class/CancelBooking/${userId}/${classId}`,
        method: "DELETE",
        contentType: "application/json",
        success: function (response) {
          if (response.success) {
            Swal.fire({
              title: "Canceled!",
              text: response.message || "Your booking has been canceled",
              icon: "success",
            });
            loadBookedClasses(userId); // Refresh the list
          } else {
            Swal.fire({
              title: "Canceled!",
              text: response.message || "Your booking has not been  canceled",
              icon: "error",
            });
          }
        },
        error: function (xhr, status, error) {
          Swal.fire({
            title: "Canceled!",
            text:
              JSON.parse(xhr.responseText).message ||
              "Your booking has not been  canceled",
            icon: "error",
          });
        },
      });
    }
  });
}

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
  .withUrl(`${uri}/notificationHub?userId=${userId}&role=${role}`)
  .withAutomaticReconnect()
  .build();

connection.start().then(() => {
  console.log("Connected to SignalR! with userid: " + userId);
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

//#################################################33
//Class Recommendation
const token = localStorage.getItem("authToken");
let userDetails = {};

if (token) {
  const decoded = parseJwt(token);
  if (decoded && decoded.UserObject) {
    userDetails = JSON.parse(decoded.UserObject);
  }
}
console.log(userDetails);

// Dynamically populate requestData from the authToken
const requestData = {
  userId: userDetails.userId || 99,
  fitnessGoal: userDetails.goal || "General Fitness",
  medicalCondition: userDetails.medicalCondition || "None",
  user_age: userDetails.age || 25,
  user_weight: userDetails.weight || 70,
};

$.ajax({
  url: `${uri}/api/Class/ClassRecommendation`,
  type: "POST",
  contentType: "application/x-www-form-urlencoded",
  data: $.param(requestData),
  success: function (response) {
    if (response.success) {
      const recommendedClasses = response.data.recommended_class_ids;
      const container = document.getElementById("recommended-classes");
      container.innerHTML = "";

      recommendedClasses.forEach((classId) => {
        $.ajax({
          url: `${uri}/api/Class/GetOneClass/?id=${classId}`,
          type: "GET",
          success: function (classDetails) {
            // Render the class details
            const classCard = `
                            <div class="recommended-class-card">
                                <img src="../ClassAssets/${
                                  classDetails.data.assets.banner
                                }" alt="${classDetails.data.className}" />
                                <h4>${classDetails.data.className}</h4>
                                <p><strong>Instructor:</strong> ${
                                  classDetails.data.instructorName
                                }</p>
                                <p><strong>Start Date:</strong> ${new Date(
                                  classDetails.data.startDate
                                ).toLocaleDateString()}</p>
                                <p><strong>Location:</strong> ${
                                  classDetails.data.city
                                }</p>
                                <a href="/User/Classdetails/${
                                  classDetails.data.classId
                                }" class="btn btn-primary">Book Now</a>
                            </div>
                        `;
            container.innerHTML += classCard;
          },
          error: function (error) {
            console.error(
              `Error fetching details for class ID ${classId}:`,
              error
            );
          },
        });
      });
    } else {
      document.getElementById("recommended-classes").innerHTML = `
                <p>No recommendations available at the moment. Stay tuned!</p>
            `;
    }
  },
  error: function (error) {
    console.error("Error fetching recommended classes:", error);
    document.getElementById("recommended-classes").innerHTML = `
            <p>Failed to load recommendations. Please try again later.</p>
        `;
  },
});
//#################################################33
//End of Class Recommendation

document.addEventListener("DOMContentLoaded", function () {
  var userScheduleUserId = getUserId();

  function getUserId() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.warn("No auth token found in localStorage.");
        return 34; // Default fallback ID
      }

      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(atob(base64));

      if (decoded && decoded.UserObject) {
        const userObj = JSON.parse(decoded.UserObject);
        console.log("User object:", userObj);
        return userObj.userId || 34;
      }

      return 34; // Default fallback ID
    } catch (error) {
      console.error("Error getting user ID:", error);
      return 34; // Default fallback ID
    }
  }

  // Wait a short period to ensure jQuery and FullCalendar are fully loaded
  setTimeout(function () {
    if (
      typeof jQuery !== "undefined" &&
      typeof jQuery.fn.fullCalendar !== "undefined"
    ) {
      initializeCalendar();
    } else {
      console.error(
        "FullCalendar or jQuery not available. Trying to load fallback scripts."
      );
      loadFallbackScripts();
    }
  }, 300);

  function loadFallbackScripts() {
    // We'll load scripts only if they're not already loaded
    if (typeof jQuery === "undefined") {
      const jQueryScript = document.createElement("script");
      jQueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
      jQueryScript.onload = function () {
        // Once jQuery is loaded, load FullCalendar
        loadFullCalendar();
      };
      document.head.appendChild(jQueryScript);
    } else if (typeof jQuery.fn.fullCalendar === "undefined") {
      loadFullCalendar();
    }
  }

  function loadFullCalendar() {
    const momentScript = document.createElement("script");
    momentScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js";

    const fullCalendarScript = document.createElement("script");
    fullCalendarScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.10.2/fullcalendar.min.js";

    momentScript.onload = function () {
      document.head.appendChild(fullCalendarScript);
    };

    fullCalendarScript.onload = function () {
      initializeCalendar();
    };

    document.head.appendChild(momentScript);
  }

  function initializeCalendar() {
    $("#userScheduleCalendar").fullCalendar({
      header: {
        left: "prev,next",
        center: "title",
        right: "month,agendaWeek,agendaDay",
      },
      defaultView: "agendaWeek",
      navLinks: true,
      editable: false,
      eventLimit: true,
      slotDuration: "00:30:00",
      minTime: "06:00:00",
      maxTime: "22:00:00",
      nowIndicator: true,
      contentHeight: "auto",
      slotEventOverlap: false,
      eventRender: function (event, element) {
        element.find(".fc-time").hide();
        element.attr(
          "title",
          event.title +
            "\n" +
            event.start.format("h:mm A") +
            " - " +
            event.end.format("h:mm A")
        );
      },
      events: function (start, end, timezone, callback) {
        // Use fetch API instead of jQuery ajax for better error handling
        fetch(
          `http://localhost:8080/api/Class/GetBookedClassesByUser/${userScheduleUserId}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("API response:", data);
            if (data && (data.success || data.data)) {
              var events = userScheduleGenerateEvents(data.data || []);
              callback(events);
            } else {
              console.error(
                "Failed to fetch classes:",
                data?.message || "Unknown error"
              );
              callback([]);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            callback([]);
          });
      },
      eventClick: function (event) {
        userScheduleShowEventModal(event);
      },
    });
  }

  function userScheduleGenerateEvents(classData) {
    console.log("Processing class data:", classData);
    var events = [];

    if (!classData || !classData.length) {
      console.warn("No class data available.");
      return events;
    }

    classData.forEach(function (classItem) {
      if (!classItem) return;

      var startDate = moment(classItem.startDate);
      var endDate = moment(classItem.endDate);
      var startTime = classItem.startTime;
      var endTime = classItem.endTime;

      if (
        !startDate.isValid() ||
        !endDate.isValid() ||
        !startTime ||
        !endTime
      ) {
        console.warn("Invalid class data:", classItem);
        return;
      }

      for (
        var date = moment(startDate);
        date.isSameOrBefore(endDate);
        date.add(1, "days")
      ) {
        var eventStart = moment(date.format("YYYY-MM-DD") + " " + startTime);
        var eventEnd = moment(date.format("YYYY-MM-DD") + " " + endTime);

        // Parse description
        let description = "No description available";
        if (classItem.description) {
          try {
            if (typeof classItem.description === "object") {
              description = `
                                <strong>Purpose:</strong> ${
                                  classItem.description.purpose || "N/A"
                                }<br>
                                <strong>Benefits:</strong> ${
                                  classItem.description.benefits || "N/A"
                                }<br>
                                ${
                                  classItem.description.medicalCondition
                                    ? `<strong>Medical Condition:</strong> ${classItem.description.medicalCondition}<br>`
                                    : ""
                                }
                                ${
                                  classItem.description.moreInfo
                                    ? `<strong>More Info:</strong> ${classItem.description.moreInfo}<br>`
                                    : ""
                                }
                            `;
            } else if (typeof classItem.description === "string") {
              description = classItem.description;
            }
          } catch (e) {
            console.error("Error parsing description:", e);
          }
        }

        events.push({
          id: classItem.classId + "-" + date.format("YYYYMMDD"),
          title: classItem.className || "Unnamed Class",
          start: eventStart,
          end: eventEnd,
          description: description,
          classType: classItem.type || "Fitness",
          instructorName: classItem.instructorName || "Unknown",
          address: classItem.address || "N/A",
          fee: classItem.fee || "N/A",
          requiredEquipments: classItem.requiredEquipments || "N/A",
          backgroundColor: "#3a87ad",
          borderColor: "#3a87ad",
        });
      }
    });

    console.log("Generated events:", events);
    return events;
  }

  function userScheduleShowEventModal(event) {
    document.getElementById("userScheduleModalTitle").textContent = event.title;

    const modalContent = `
            <div style="margin-bottom: 15px; color: white;">
                <strong>Class Type:</strong> ${event.classType}<br>
                <strong>Instructor:</strong> ${event.instructorName}<br>
                <strong>Address:</strong> ${event.address}<br>
                <strong>Fee:</strong> ₹${event.fee}<br>
                <strong>Required Equipment:</strong> ${
                  event.requiredEquipments || "N/A"
                }
            </div>
            <div style="margin-bottom: 15px; color: white;">
                <strong>Date & Time:</strong><br>
                ${event.start.format("dddd, MMMM D, YYYY")}<br>
                ${event.start.format("h:mm A")} - ${event.end.format("h:mm A")}
            </div>
            <div style="margin-bottom: 15px; color: white;">
                ${event.description}
            </div>
        `;

    document.getElementById("userScheduleModalBody").innerHTML = modalContent;
    document.getElementById("userScheduleEventModal").style.display = "block";
  }

  // Event listeners for modal close buttons
  document
    .getElementById("userScheduleCloseBtn")
    .addEventListener("click", closeModal);
  document
    .getElementById("userScheduleFooterCloseBtn")
    .addEventListener("click", closeModal);

  function closeModal() {
    document.getElementById("userScheduleEventModal").style.display = "none";
  }
});

// Update the profile image loading function
function loadUserProfileImage() {
  const userId = getUserIdFromToken();
  if (!userId) return;
  
  console.log("Loading profile image for user ID:", userId);
  
  // Show loading spinner or placeholder in the meantime
  const profileImage = document.getElementById("navProfileImage");
  if (profileImage) {
    profileImage.src = "/img/profile-placeholder.jpg";
  }
  
  $.ajax({
    url: `${uri}/api/User/GetUserById/${userId}`,
    type: "GET",
    success: function (response) {
      console.log("Profile response:", response);
      
      if (!profileImage) {
        console.error("Profile image element not found");
        return;
      }
      
      // Check if the response exists and has data property (API structure)
      if (response && response.success && response.data && response.data.profileImage) {
        profileImage.src = `/User_Images/${response.data.profileImage}`;
        console.log("Set profile image to:", profileImage.src);
      } 
      // Direct response structure without data wrapper
      else if (response && response.profileImage) {
        profileImage.src = `/User_Images/${response.profileImage}`;
        console.log("Set profile image to:", profileImage.src);
      } 
      // If no profile image found, use a default user avatar
      else {
        profileImage.src = "/img/default-user.jpg";
        console.log("No profile image found, using default");
      }
    },
    error: function (xhr) {
      console.error("Error loading profile image:", xhr);
      if (profileImage) {
        profileImage.src = "/img/default-user.jpg";
      }
    }
  });
}

// Make sure this runs when the page loads
$(document).ready(function() {
  // Load the profile image with a small delay to ensure DOM is ready
  setTimeout(loadUserProfileImage, 100);
  
  // Also load wallet balance
  loadUserWalletBalance();
});

// Refresh profile image after update
document.addEventListener("profileUpdated", function () {
  loadUserProfileImage();
});
