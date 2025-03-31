$(document).ready(function () {
  var uri = "http://localhost:8080";
  var userId;

  userId = getUserIdFromToken();

  // Initialize Main Navigation TabStrip with select event
  $("#mainTabstrip").kendoTabStrip({
    animation: {
      open: {
        effects: "fadeIn",
      },
    }
  });

  //Dashboard Content

  // Function to fetch the count from API and update the respective card
  function fetchAndUpdateCount(url, elementId) {
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            if (data.success) {
                $(elementId).text(data.count);
            } else {
                $(elementId).text('Error retrieving data');
            }
        },
        error: function () {
            $(elementId).text('Error fetching data');
        }
    });
}

// Fetch counts for users, classes, and instructors
fetchAndUpdateCount(`${uri}/api/Admin/count-users`, '#userCount');
fetchAndUpdateCount(`${uri}/api/Admin/count-classes`, '#classCount');
fetchAndUpdateCount(`${uri}/api/Admin/count-instructors`, '#instructorCount');


// Fetch Top Goals Data and Create Top Goals Chart
$.get(`${uri}/api/Admin/top-goals`, function (response) {
    if (response.success && response.data) {
        const goalsData = response.data;
        const goalCategories = goalsData.map(goal => goal.goal); 
        const goalValues = goalsData.map(goal => goal.goalCount);
 
        // Initialize Kendo Chart for Top Goals
        $("#topGoalsChart").kendoChart({
            chartArea: {
                background: "rgba(0, 0, 0, 0.05)"
            },
            title: {
                text: "Top User Goals",
                color: "#FFFFFF",
                font: "24px Arial"
            },
            legend: {
                visible: true,
                position: "top",
                labels: {
                    color: "#FFFFFF"  
                }
            },
            seriesDefaults: {
                type: "column",
                labels: {
                    visible: true,
                    background: "transparent",
                    color: "#FFFFFF"
                },
                border: {
                    width: 0
                },
                shadow: {
                    visible: false 
                }
            },
            series: [{
                type: "column",
                name: "Goals",
                data: goalValues,
                color: "#ff4d4d",
            }],
            categoryAxis: {
                categories: goalCategories,
                labels: {
                    color: "#FFFFFF" 
                },
                title: {
                    color: "#FFFFFF",
                    text: "Goals"
                },
                majorGridLines: {
                    visible: false // Hides the grid lines on the category axis
                }
            },
            valueAxis: {
                labels: {
                    color: "#FFFFFF" 
                },
                title: {
                    color: "#FFFFFF",
                    text: "Count"
                },
                majorGridLines: {
                    visible: false // Hides the grid lines on the category axis
                }
            }
        });
    } else {
        $('#topGoalsChart').text('Error fetching data');
    }
});


// Fetch Top Specialization Data and Create Top Specialization Chart
// $.get(`${uri}/api/Admin/top-specialization`, function (response) {
//     if (response.success && response.data) {
//         const specializationData = response.data;
//         const specializationCategories = specializationData.map(spec => spec.specialization); // Assuming 'name' is a key
//         const specializationValues = specializationData.map(spec => spec.specializationGoalCount); // Assuming 'count' is a key

//         // Initialize Kendo Chart for Top Specialization
//         $("#topSpecializationChart").kendoChart({
//             title: {
//                 text: "Top Specializations"
//             },
//             series: [{
//                 type: "column",
//                 name: "Specializations",
//                 data: specializationValues
//             }],
//             categoryAxis: {
//                 categories: specializationCategories,
//                 title: {
//                     text: "Specializations"
//                 }
//             },
//             valueAxis: {
//                 title: {
//                     text: "Count"
//                 }
//             }
//         });
//     } else {
//         $('#topSpecializationChart').text('Error fetching data');
//     }
// });



$.get(`${uri}/api/Admin/top-specialization`, function (response) {
    if (response.success && response.data) {
        const specializationData = response.data;
        const specializationCategories = specializationData.map(spec => spec.specialization); // Assuming 'specialization' is a key
        const specializationValues = specializationData.map(spec => spec.specializationGoalCount); // Assuming 'specializationGoalCount' is a key

        // Define custom colors for each slice of the pie
        const pieColors = [
            "#2C7A7B", // Primary Teal
            "#FF7043", // Warm Coral
            "#B39DDB", // Soft Lavender
            "#28a745",
            "#FFB74D"  // Muted Gold
        ];

        // Initialize Kendo Chart for Top Specialization (Pie Chart)
        $("#topSpecializationChart").kendoChart({
            chartArea: {
                background: "rgba(0, 0, 0, 0.05)" // Set a light background for the chart area
            },
            title: {
                text: "Top Specializations",
                color: "#FFFFFF", // White color for the title
                font: "bold 24px Arial" // Increase font size
            },
            legend: {
                visible: true, // Keep the legend visible
                position: "bottom", // Place the legend at the bottom
                labels: {
                    color: "#FFFFFF" // Set legend text color to white
                }
            },
            seriesDefaults: {
                type: "donut", // Change to pie chart
                labels: {
                    visible: true,
                    position: "inside", // Labels positioned inside the pie slices
                    background: "transparent",
                    color: "#FFFFFF", // White labels for high contrast
                    font: "bold 14px Arial"
                },
            },
            series: [{
                type: "donut", // Pie chart
                name: "Specializations",
                data: specializationValues.map((value, index) => ({
                    category: specializationCategories[index],
                    value: value,
                    color: pieColors[index] // Assign custom color to each slice
                }))
            }],
            tooltip: {
                visible: true,
                template: "#= category #: #= value #" // Tooltip format showing category and value
            }
        });
    } else {
        $('#topSpecializationChart').text('Error fetching data');
    }
});


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
