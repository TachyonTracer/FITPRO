var uri = "http://localhost:8080";

// Function to format date and time
function formatDateTime(dateStr, timeStr) {
  const date = new Date(dateStr);
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return (
    date.toLocaleDateString("en-US", options) +
    " at " +
    timeStr.substring(0, 5)
  );
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

  function renderRefreshClasses(data) {
      var html = "";
      if (data.length === 0) {
          html = '<div class="col-12"><div class="alert alert-warning text-center">No classes match your search criteria.</div></div>';
      } else {
          data.forEach(function (c) {
              html += `<div class="col-md-4 mb-4">
                  <div class="card h-100" id="classcard">
                      <div id="carousel-${c.classId}" class="carousel slide" data-bs-ride="carousel">
                          <div class="carousel-inner">
                              ${Object.entries(c.assets || {})
                                  .filter(([key]) => key.startsWith("picture"))
                                  .map(
                                      ([key, value], index) => `
                                      <div class="carousel-item ${index === 0 ? "active" : ""}">
                                          <img src="../ClassAssets/${value}" style="height: 200px; object-fit: cover;">
                                      </div>
                                  `
                                  )
                                  .join("")}
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
                              <span class="badge ${c.status === "Active" ? "bg-success" : "bg-warning"}">${c.status}</span>
                          </div>
                          <p class="card-text">${c.description?.purpose || "No description available"}</p>
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
                              <strong>Total Seats:</strong> ${c.maxCapacity}
                          </div>
                          <div class="class-detail">
                              <strong>Available Seats:</strong> ${c.availableCapacity}
                          </div>
                          <div class="class-detail">
                              <strong>Equipment:</strong> ${c.requiredEquipments}
                          </div>
                          <div class="class-detail">
                              <strong>Price:</strong> ₹${c.fee.toFixed(2)}
                          </div>
                      </div>
                      <div class="card-footer bg-transparent">
                          <button class="btn btn-danger w-100 cancel-btn" 
                              onclick="suspendClass(${c.classId}, '${c.status}')"
                              ${c.status !== "Active" ? "Suspended" : ""}>
                              ${c.status !== "Active" ? "Activate Class" : "Suspend Class"}
                          </button>
                      </div>
                  </div>
              </div>`;
          });
      }
      $("#classList").html(html);
  }

$(document).ready(function () {
  var userId;
  userId = getUserIdFromToken();

  // Initialize Main Navigation TabStrip with select event
  $("#mainTabstrip").kendoTabStrip({
    animation: {
      open: {
        effects: "fadeIn",
      },
    },
  });

  const dropdownItems = $(".dropdown-item");
  const subContents = $(".sub-content");

  dropdownItems.each(function () {
    $(this).on("click", function () {
      // Hide all sub-content sections
      subContents.each(function () {
        $(this).hide();
      });

      // Show the selected sub-content section
      const section = $(this).data("section");
      $(`#${section}-instructors`).show();
    });
  });

  //Dashboard Content

  // Function to fetch the count from API and update the respective card
  function fetchAndUpdateCount(url, elementId) {
    $.ajax({
      url: url,
      method: "GET",
      success: function (data) {
        if (data.success) {
          if (elementId == "#revenue") {
            $(elementId).html("₹" + data.count);
          } else {
            $(elementId).text(data.count);
          }
        } else {
          $(elementId).text("Error retrieving data");
        }
      },
      error: function () {
        $(elementId).text("Error fetching data");
      },
    });
  }

  // Fetch counts for users, classes, and instructors
  fetchAndUpdateCount(`${uri}/api/Admin/count-users`, "#total-users");
  fetchAndUpdateCount(`${uri}/api/Admin/count-classes`, "#total-classes");
  fetchAndUpdateCount(
    `${uri}/api/Admin/count-instructors`,
    "#active-instructors"
  );
  fetchAndUpdateCount(`${uri}/api/Admin/total-revenue`, "#revenue");

  // User Activity Chart (Line)
  const activityCtx = document.getElementById("activityChart").getContext("2d");
  const activityChart = new Chart(activityCtx, {
    type: "line",
    data: {
      labels: [], // Dates will be populated dynamically
      datasets: [
        {
          label: "Active Users",
          data: [], // User counts will be populated dynamically
          borderColor: "#ff4d4d",
          backgroundColor: "rgba(255, 77, 77, 0.2)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#ff4d4d",
          pointBorderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(255, 255, 255, 0.1)" },
          ticks: { color: "#fff" },
        },
        x: {
          grid: { color: "rgba(255, 255, 255, 0.1)" },
          ticks: { color: "#fff" },
        },
      },
      plugins: { legend: { labels: { color: "#fff" } } },
    },
  });

  // Fetch user activity data (active users for the last 7 days)
  async function fetchUserActivityData() {
    try {
      // Fetch the data from the backend API
      const response = await fetch(`${uri}/api/Admin/user-activity`);
      const data = await response.json();

      if (data.success) {
        // Extract the dates and user counts from the API response
        const dates = data.data.map((item) => item.key);
        const activityCounts = data.data.map((item) => item.value);

        // Update the chart labels
        activityChart.data.labels = dates;
        activityChart.data.datasets[0].data = activityCounts;

        activityChart.update(); // Refresh the chart
      } else {
        console.error("Failed to fetch user activity data.");
      }
    } catch (error) {
      console.error("Error fetching user activity data:", error);
    }
  }

  // Call the function to fetch and update the chart
  fetchUserActivityData();

  // User Engagement Chart (Doughnut)
  const engagementCtx = document
    .getElementById("engagementChart")
    .getContext("2d");

  // Initial chart setup (with placeholder data)
  const engagementChart = new Chart(engagementCtx, {
    type: "doughnut",
    data: {
      labels: ["Active", "Inactive"],
      datasets: [
        {
          data: [0, 0],
          backgroundColor: ["#ff4d4d", "#666"],
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom", labels: { color: "#fff", padding: 15 } },
        title: { display: false },
      },
      cutout: "60%", // Makes it more compact
    },
  });

  // Fetch user engagement data (active & inactive users)
  async function fetchUserEngagementData() {
    try {
      const response = await fetch(`${uri}/api/Admin/user-engagement`);
      const data = await response.json();

      const activeUsers = data.activeUsers;
      const inactiveUsers = data.inactiveUsers;

      // Update the chart with the new data
      engagementChart.data.datasets[0].data = [activeUsers, inactiveUsers];
      engagementChart.update();
    } catch (error) {
      console.error("Error fetching user engagement data:", error);
    }
  }

  // Call the function to fetch and update the chart
  fetchUserEngagementData();

  // Top 10 Specializations Chart (Bar) with API Data
  const specializationCtx = document
    .getElementById("specializationChart")
    .getContext("2d");
  let specializationChart;

  async function fetchSpecializationData() {
    try {
      const response = await fetch(`${uri}/api/Admin/top-specialization`);
      const result = await response.json();

      if (result.success && result.data) {
        const labels = result.data.map((item) => item.specialization);
        const counts = result.data.map((item) => item.specializationGoalCount);

        // Update or create the chart
        if (specializationChart) {
          specializationChart.data.labels = labels;
          specializationChart.data.datasets[0].data = counts;
          specializationChart.update();
        } else {
          specializationChart = new Chart(specializationCtx, {
            type: "bar",
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Class Count",
                  data: counts,
                  backgroundColor: "rgba(255, 77, 77, 0.5)",
                  borderColor: "#ff4d4d",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: "rgba(255, 255, 255, 0.1)" },
                  ticks: { color: "#fff" },
                },
                x: {
                  grid: { color: "rgba(255, 255, 255, 0.1)" },
                  ticks: { color: "#fff" },
                },
              },
              plugins: { legend: { labels: { color: "#fff" } } },
            },
          });
        }
      } else {
        console.error("No specialization data found:", result.message);
      }
    } catch (error) {
      console.error("Error fetching specialization data:", error);
    }
  }

  // Initial fetch
  fetchSpecializationData();

  // Class Management
  const classes = [
    {
      name: "Yoga Flow",
      type: "Online",
      level: "Beginner",
      instructor: "Jane Doe",
    },
    {
      name: "HIIT Blast",
      type: "In-Person",
      level: "Advanced",
      instructor: "John Smith",
    },
    {
      name: "Pilates Core",
      type: "Online",
      level: "Intermediate",
      instructor: "Emily Brown",
    },
  ];

  function renderClasses(filteredClasses) {
    const classList = document.getElementById("classList");
    classList.innerHTML = "";
    filteredClasses.forEach((cls) => {
      const card = `
            <div class="k-card" id="card>
                <div class="k-card-header">${cls.name}</div>
                <div class="k-card-body">
                    <p>Type: ${cls.type}</p>
                    <p>Level: ${cls.level}</p>
                    <p>Instructor: ${cls.instructor}</p>
                </div>
                <div class="k-card-footer">
                    <button class="k-button">Edit</button>
                </div>
            </div>
        `;
      classList.innerHTML += card;
    });
  }

  // Old content

  function getUserIdFromToken() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("No auth token found in localStorage.");
      return null;
    }
    const decoded = parseJwt(token);
    if (decoded) {
      console.log(decoded);
      return "9";
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

  // Initialize Main Navigation TabStrip
  $("#mainTabstrip").kendoTabStrip({
    animation: {
      open: {
        effects: "fadeIn",
      },
    },
  });

  //instructor data
  $("#loadInstructorContent").on("click", function () {
    $.ajax({
      url: "http://localhost:8081/instructor/verifiedinstructor", // Path to the other HTML page
      type: "GET",
      success: function (data) {
        // Inject only the body content into the target div
        $("#verified-instructors").html($(data).find("body").html());
      },
      error: function (error) {
        console.log("Error loading content:", error);
      },
    });
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
    },
  });

  

  // Function to format duration
 

  // Render classes
  function renderClasses(data) {
    var html = "";
    if (data.length === 0) {
      html =
        '<div class="col-12"><div class="alert alert-warning text-center">No classes match your search criteria.</div></div>';
    } else {
      data.forEach(function (c) {
        html += `<div class="col-md-4 mb-4">
                              <div class="card h-100">
                                  <div id="carousel-${
                                    c.classId
                                  }" class="carousel slide" data-bs-ride="carousel">
                                      <div class="carousel-inner">
                                          ${Object.entries(c.assets)
                                            .filter(([key]) =>
                                              key.startsWith("picture")
                                            )
                                            .map(
                                              ([key, value], index) => `
                                              <div class="carousel-item ${
                                                index === 0 ? "active" : ""
                                              }">
                                                  <img src="../ClassAssets/${value}" style="height: 200px; object-fit: cover;">
                                              </div>
                                          `
                                            )
                                            .join("")}
                                      </div>
                                      <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${
                                        c.classId
                                      }" data-bs-slide="prev">
                                          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                          <span class="visually-hidden">Previous</span>
                                      </button>
                                      <button class="carousel-control-next" type="button" data-bs-target="#carousel-${
                                        c.classId
                                      }" data-bs-slide="next">
                                          <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                          <span class="visually-hidden">Next</span>
                                      </button>
                                  </div>
                                  <div class="card-body">
                                      <h5 class="card-title">${c.className}</h5>
                                      <div class="mb-2">
                                          <span class="badge badge-level me-1">${
                                            c.type
                                          }</span>
                                          <span class="badge ${
                                            c.status === "Active"
                                              ? "bg-success"
                                              : "bg-warning"
                                          }">${c.status}</span>
                                      </div>
                                      <p class="card-text">${
                                        c.description.purpose
                                      }</p>
                                      <div class="class-detail">
                                          <strong>Start:</strong> ${formatDateTime(
                                            c.startDate,
                                            c.startTime
                                          )}
                                      </div>
                                      <div class="class-detail">
                                          <strong>End:</strong> ${formatDateTime(
                                            c.endDate,
                                            c.endTime
                                          )}
                                      </div>
                                      <div class="class-detail">
                                          <strong>Duration:</strong> ${formatDuration(
                                            c.duration
                                          )}
                                      </div>
                                      <div class="class-detail">
                                          <strong>Location:</strong> ${c.city}
                                      </div>
                                      <div class="class-detail">
                                          <strong>Address:</strong> ${c.address}
                                      </div>
                                      <div class="class-detail">
                                          <strong>Instructor Name:</strong> ${
                                            c.instructorName
                                          }
                                      </div>
                                      <div class="class-detail">
                                          <strong>Total Seats:</strong> ${
                                            c.maxCapacity
                                          }
                                      </div>
                                      <div class="class-detail">
                                          <strong>Available Seats:</strong> ${
                                            c.availableCapacity
                                          }
                                      </div>
                                      <div class="class-detail">
                                          <strong>Equipment:</strong> ${
                                            c.requiredEquipments
                                          }
                                      </div>
                                      <div class="class-detail">
                                          <strong>Price:</strong> ₹${c.fee.toFixed(
                                            2
                                          )}
                                      </div>
                                  </div>
                                  <div class="card-footer bg-transparent">
                                        
                                        <button class="btn btn-danger w-100 cancel-btn" 
                                          onclick="suspendClass(${c.classId}, '${c.status}')"
                                          ${c.status !== 'Active' ? 'Suspended' : ''}>
                                          ${c.status !== 'Active' ? 'Activate Class' : 'Suspend Class'}
                                      </button>
                                    </div>
                              </div>
                          </div>`;
      });
    }
    $("#classList").html(html);
  }


  function performSearch() {
    var searchText = $("#searchText").val().toLowerCase().trim();

    if (searchText === "") {
        applyFilters();
        return;
    }

    var searchedData = contactData.filter(function (c) {
        // Search in class name, city, and type
        return c.className.toLowerCase().includes(searchText) ||
               c.city.toLowerCase().includes(searchText) ||
               c.type.toLowerCase().includes(searchText);
    });

    var location = $("#location").val();
    var type = $("#types").val();

    var filteredData = searchedData.filter(function (c) {
        return (type === "" || c.type === type) &&
               (location === "" || c.city === location);
    });

    console.log("Search results:", {
        searchText: searchText,
        totalResults: filteredData.length,
        results: filteredData.map(c => ({
            className: c.className,
            city: c.city,
            type: c.type
        }))
    });

    renderClasses(filteredData);
}

  // Filter function (runs on button click)
  function applyFilters() {
    var searchText = $("#searchText").val().toLowerCase();
    var location = $("#location").val();
    var type = $("#types").val();

    var filteredData = contactData.filter(function (c) {
        var matchesSearch = searchText === "" ||
            c.className.toLowerCase().includes(searchText) ||
            c.city.toLowerCase().includes(searchText);
        var matchesLocation = location === "" || c.city === location;
        var matchesLevel = type === "" || c.type === type;

        return matchesSearch && matchesLocation && matchesLevel;
    });

    renderClasses(filteredData);
}


  // Search on input
  $("#searchText").on("input", performSearch);

  // Filter on button click
  $("#filterBtn").click(applyFilters);

});

$(document).ready(function () {

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
      console.log(decoded);
      return "9";
    }
    console.warn("Invalid or malformed token.");
    return null;
  }
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

var userId = "12"; // Change this dynamically based on logged-in user
var role = "admin"; // instructor or user
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
  console.log("Connected to SignalR!");
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

function suspendClass(classId, currentStatus) {
  const action = currentStatus === 'Active' ? 'suspend' : 'activate';
  const confirmationText = currentStatus === 'Active' 
      ? 'Do you want to suspend this class?' 
      : 'Do you want to activate this class?';

  Swal.fire({
      title: 'Are you sure?',
      text: confirmationText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action}`
  }).then((result) => {
      if (result.isConfirmed) {
          const apiUrl = currentStatus === 'Active' 
              ? `${uri}/api/Class/soft-delete/${classId}` 
              : `${uri}/api/Class/activate-class/${classId}`;

          $.ajax({
              url: apiUrl,
              type: currentStatus === 'Active' ? "DELETE" : "POST",
              success: function (response) {
                  if (response.success) {
                      Swal.fire(
                          'Success!',
                          `Class ${action}d successfully`,
                          'success'
                      );
                      // $("#Class").load(location.href + " #Class > *");
                      
                  
                      refreshClasses();
                      // Update the button and status dynamically
                      const button = $(`#class-${classId} .cancel-btn`);
                      button.text(currentStatus === 'Active' ? 'Activate Class' : 'Suspend Class');
                      button.toggleClass('btn-danger btn-success');
                      button.attr('onclick', `suspendClass(${classId}, '${currentStatus === 'Active' ? 'Inactive' : 'Active'}')`);
                      button.prop('disabled', false);
                  } else {
                      Swal.fire(
                          'Error!',
                          response.message || `Failed to ${action} class.`,
                          'error'
                      );
                  }
              },
              error: function () {
                  Swal.fire(
                      'Error!',
                      `Failed to ${action} class. Please try again.`,
                      'error'
                  );
              }
          });
      }
  });

  function refreshClasses() {
    $.ajax({
        url: `${uri}/api/Class/GetAllClasses`,
        type: "GET",
        success: function (response) {
            renderRefreshClasses(response.data);
        },
        error: function (error) {
            $("#classList").html('<div class="col-12"><div class="alert alert-warning text-center">Error refreshing classes.</div></div>');
        },
    });
}

refreshClasses(); // Call refreshClasses after defining renderClasses

}




