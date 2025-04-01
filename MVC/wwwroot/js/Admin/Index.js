var uri = "http://localhost:8080";

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
      const dates = data.data.map(item => item.key);  
      const activityCounts = data.data.map(item => item.value); 

      // Update the chart labels
      activityChart.data.labels = dates;
      activityChart.data.datasets[0].data = activityCounts;

      activityChart.update(); // Refresh the chart
    } else {
      console.error('Failed to fetch user activity data.');
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
            <div class="k-card">
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
        },
      },
    ],
    visible: false,
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
        }
    });
});

  // Class data
  var contactData = [];

  $.ajax({
    url: "http://localhost:8080/api/Class/GetAllClasses",
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

  // Function to format duration
  function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

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
                                <div class="card-body">
                                    <h5 class="card-title">${c.className}</h5>
                                    <div class="mb-2">
                                        <span class="badge badge-level me-1">${
                                          c.description
                                        }</span>
                                        <span class="badge badge-type">${
                                          c.type
                                        }</span>
                                    </div>
                                    <p class="card-text">${c.description}</p>
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
                                        <strong>Max Capacity:</strong> ${
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
                                        <strong>Price:</strong> $${c.fee.toFixed(
                                          2
                                        )}
                                    </div>
                                    <div class="class-detail">
                                        <strong>Status:</strong> <span class="badge ${
                                          c.status === "Active"
                                            ? "bg-success"
                                            : "bg-warning"
                                        }">${c.status}</span>
                                    </div>
                                </div>
                                <div class="card-footer bg-transparent">
                                    <button class="btn btn-success w-100 book-btn" data-id="${
                                      c.classId
                                    }" ${
          c.availableCapacity === 0 || c.status !== "Active" ? "disabled" : ""
        }>
                                        ${
                                          c.availableCapacity === 0
                                            ? "Class Full"
                                            : c.status !== "Active"
                                            ? "Not Available"
                                            : "Book Now"
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>`;
      });
    }
    $("#classList").html(html);
  }

  // Search function (runs on input)
  function performSearch() {
    var searchText = $("#searchText").val().toLowerCase();

    if (searchText === "") {
      applyFilters();
      return;
    }

    var searchedData = contactData.filter(function (c) {
      return (
        c.className.toLowerCase().includes(searchText) ||
        c.city.toLowerCase().includes(searchText)
      );
    });

    var type = $("#type").val();
    var level = $("#level").val();

    var filteredData = searchedData.filter(function (c) {
      return (
        (type === "" || c.type === type) &&
        (level === "" || c.description.level === level)
      );
    });

    renderClasses(filteredData);
  }

  // Filter function (runs on button click)
  function applyFilters() {
    var searchText = $("#searchText").val().toLowerCase();
    var type = $("#type").val();
    var level = $("#level").val();

    var filteredData = contactData.filter(function (c) {
      var matchesSearch =
        searchText === "" ||
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
    var selectedClass = contactData.find((c) => c.classId === classId);

    if (selectedClass && selectedClass.availableCapacity > 0) {
      selectedClass.availableCapacity--;
      renderClasses(contactData);
      alert(
        `Booking confirmed for ${
          selectedClass.className
        }!\nDate: ${formatDateTime(
          selectedClass.startDate,
          selectedClass.startTime
        )}\nPrice: $${selectedClass.fee.toFixed(2)}`
      );
    } else {
      alert("Sorry, no seats available for " + selectedClass.className);
    }
  });
});

$(document).ready(function () {
  localStorage.setItem(
    "authToken",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKV1RTZXJ2aWNlc0FjY2Vzc1Rva2VuIiwianRpIjoiMjlkZWE4YzUtMGE1Ny00NDRhLWJkMjgtMWVmYzAwMzEzYjEyIiwiVXNlck9iamVjdCI6IntcImluc3RydWN0b3JJZFwiOjEwLFwiaW5zdHJ1Y3Rvck5hbWVcIjpcIktodXNoaVwiLFwiZW1haWxcIjpcImtodXNoaTFAZ21haWwuY29tXCIsXCJwYXNzd29yZFwiOm51bGwsXCJjb25maXJtUGFzc3dvcmRcIjpudWxsLFwibW9iaWxlXCI6XCIxMjM0NTY3ODkwXCIsXCJnZW5kZXJcIjpcIkZlbWFsZVwiLFwiZG9iXCI6XCIyMDAzLTEwLTA1VDAwOjAwOjAwXCIsXCJzcGVjaWFsaXphdGlvblwiOlwiWW9nYVwiLFwiY2VydGlmaWNhdGVzXCI6e1wiWW9nYVwiOlwia2h1c2hpMUBnbWFpbC5jb21fWW9nYV82OTNhYmE5MS0zZmQyLTRjMGQtYjAxMS01YjAzYjhjMzhkYmUuanBnXCJ9LFwicHJvZmlsZUltYWdlXCI6XCJraHVzaGkxQGdtYWlsLmNvbV9wcm9maWxlLnBuZ1wiLFwiYXNzb2NpYXRpb25cIjpcIkZpdFByb1wiLFwiY3JlYXRlZEF0XCI6XCIyMDI1LTAzLTI2VDEzOjEyOjU3LjkyMjc5NFwiLFwic3RhdHVzXCI6XCJBY3RpdmVcIixcImlkUHJvb2ZcIjpcImtodXNoaTFAZ21haWwuY29tX2lkcHJvb2YucG5nXCIsXCJhY3RpdmF0aW9uVG9rZW5cIjpcImQ2ZjcwYjUwLTIyZDQtNDNiNi04OWEzLWI1ZjFjMmYzOWU1YVwiLFwiYWN0aXZhdGVkT25cIjpcIjIwMjUtMDMtMjVUMTY6MjQ6MzguMDU3MDY5XCIsXCJpZFByb29mRmlsZVwiOm51bGwsXCJjZXJ0aWZpY2F0ZUZpbGVzXCI6bnVsbCxcInByb2ZpbGVJbWFnZUZpbGVcIjpudWxsfSIsImV4cCI6MTc0MzE0NzMyNSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MCIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjgwODEifQ.jjl4jKtkwF-AqBQdzos4E0LwpU39GsxwDd19F-snFjA"
  );

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

// Show logout confirmation
function showLogoutConfirmation() {
  $("#logoutDialog").data("kendoDialog").open();
}

// Perform logout
function performLogout() {
  alert("You have been logged out. Redirecting to login page...");
}



/* Do Not Remove */
/* Notification JavaScript Starts*/
/* Includes All the JS Functions for Notification Badge, Icons, Buttons and List */

var userId = "U2"; // Change this dynamically based on logged-in user
var isAdmin = true; // Set this dynamically based on role
var role = "user" // instructor or user
var counter = 0;
var fetcherConn = "";
if(role == "admin") {
    var fetcherConn = "NewAdminNotification";
} else if(role == "instructor") {
    var fetcherConn = "NewInstructorNotification"
} else {
  var fetcherConn = "NewUserNotification"
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
    .withUrl(`http://localhost:8080/notificationHub?userId=${userId}&role=${role}`)
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
        list.innerHTML = '<li class="list-group-item text-center text-muted">No new notifications</li>';
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