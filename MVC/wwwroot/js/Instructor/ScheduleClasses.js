$("#mainTabstrip").kendoTabStrip({
  animation: {
    open: {
      effects: "fadeIn",
    },
  },
  select: function (e) {
    if (e.item.textContent.trim() === "Manage Classes") {
      loadClasses();
    }
  },
});

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

function populateTypeDropdown(data) {
  const types = [...new Set(data.map((c) => c.type))];
  const typeSelect = $("#type");
  typeSelect.empty();
  typeSelect.append('<option value="">All Types</option>');
  types.forEach((type) => {
    typeSelect.append(
      `<option value="${type}">${
        type.charAt(0).toUpperCase() + type.slice(1)
      }</option>`
    );
  });
}

function populateEditTypeDropdown(selectedType) {
  const types = [
    "Yoga",
    "Gym",
    "Calisthenics",
    "Zumba",
    "Cycling",
    "Weight training",
    "Boxing",
  ];
  const typeSelect = $("#editType");
  typeSelect.empty();
  types.forEach((type) => {
    const isSelected = type === selectedType ? "selected" : "";
    typeSelect.append(
      `<option value="${type}" ${isSelected}>${
        type.charAt(0).toUpperCase() + type.slice(1)
      }</option>`
    );
  });
}

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
                                    ${
                                      Object.entries(c.assets || {})
                                        .filter(([key]) =>
                                          key.startsWith("picture")
                                        )
                                        .map(
                                          ([key, value], index) => `
                                            <div class="carousel-item ${
                                              index === 0 ? "active" : ""
                                            }">
                                                <img src="@Url.Content("~/ClassAssets/")${value}" style="height: 200px; object-fit: cover;" onerror="this.src='@Url.Content("~/images/fallback.jpg")';">
                                            </div>
                                        `
                                        )
                                        .join("") ||
                                      `
                                            <div class="carousel-item active">
                                                <img src="@Url.Content("~/images/fallback.jpg")" style="height: 200px; object-fit: cover;">
                                            </div>
                                        `
                                    }
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
                                <p class="card-text"><strong>Purpose:</strong> ${
                                  c.description?.purpose || "N/A"
                                }</p>
                                <p class="card-text"><strong>Benefits:</strong> ${
                                  c.description?.benefits || "N/A"
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
                                      c.requiredEquipments || "None"
                                    }
                                </div>
                                <div class="class-detail">
                                    <strong>Price:</strong> $${c.fee.toFixed(2)}
                                </div>
                            </div>
                            <div class="card-footer bg-transparent d-flex gap-2">
                                <button class="btn btn-primary w-50 edit-btn" data-id="${
                                  c.classId
                                }">Edit Class</button>
                                <button class="btn btn-danger w-50 delete-btn" data-id="${
                                  c.classId
                                }">Delete Class</button>
                            </div>
                        </div>
                    </div>`;
    });
  }
  $("#classList").html(html);

  $(".carousel").each(function () {
    new bootstrap.Carousel(this, {
      interval: 5000,
      ride: true,
    });
  });
}

var classData = [];

const equipmentByClassType = {
  "Yoga": [
    { value: 'Yoga Mat', icon: '🧘', description: 'Essential for yoga and floor exercises' },
    { value: 'Yoga Blocks', icon: '🟫', description: 'Support for deeper poses' },
    { value: 'Resistance Bands', icon: '🔄', description: 'For strength and flexibility training' },
    { value: 'Exercise Ball', icon: '⚽', description: 'For balance and core exercises' },
    { value: 'Dumbbells', icon: '🏋️', description: 'Strength training weights' },
    { value: 'Barbells', icon: '💪', description: 'Heavyweight lifting' },
    { value: 'Kettlebells', icon: '🏋️‍♂️', description: 'Functional strength training' },
    { value: 'Treadmill', icon: '🏃', description: 'For cardiovascular exercise' }
  ],
  "Gym": [
    { value: 'Dumbbells', icon: '🏋️', description: 'Strength training weights' },
    { value: 'Barbells', icon: '💪', description: 'Heavyweight lifting' },
    { value: 'Kettlebells', icon: '🏋️‍♂️', description: 'Functional strength training' },
    { value: 'Treadmill', icon: '🏃', description: 'For cardiovascular exercise' }
  ],
  "Zumba": [
    { value: 'Dance Sneakers', icon: '👟', description: 'Comfortable footwear for Zumba' },
    { value: 'Light Dumbbells', icon: '🎽', description: 'For adding intensity' },
    { value: 'Resistance Bands', icon: '🌀', description: 'For muscle toning' },
    { value: 'Aerobic Step', icon: '📶', description: 'For high-energy moves' }
  ],
  "Boxing": [
    { value: 'Boxing Gloves', icon: '🥊', description: 'Essential for boxing training' },
    { value: 'Punching Bag', icon: '🎯', description: 'For practicing punches' },
    { value: 'Hand Wraps', icon: '🩹', description: 'Protects hands and wrists' },
    { value: 'Speed Rope', icon: '⏳', description: 'Improves footwork and agility' }
  ],
  "Cycling": [
    { value: 'Stationary Bike', icon: '🚴', description: 'For indoor cycling' },
    { value: 'Cycling Shoes', icon: '👟', description: 'Enhances pedal efficiency' },
    { value: 'Heart Rate Monitor', icon: '❤️', description: 'Tracks workout intensity' },
    { value: 'Resistance Bands', icon: '🌀', description: 'For off-bike workouts' }
  ],
  "Calisthenics": [
    { value: 'Pull-Up Bar', icon: '🏋️', description: 'For upper body strength' },
    { value: 'Resistance Bands', icon: '🔄', description: 'For added resistance' }
  ],
  "Weight training": [
    { value: 'Dumbbells', icon: '🏋️', description: 'Strength training weights' },
    { value: 'Barbells', icon: '💪', description: 'Heavyweight lifting' },
    { value: 'Weight Plates', icon: '🏋️‍♂️', description: 'For adjustable weights' }
  ]
};

function loadClasses() {
  $.ajax({
    url: `${uri}/api/Class/GetClassesByInstructorId?id=${instructorId}`,
    type: "GET",
    success: function (response) {
      console.log(response.data);
      classData = response.data;
      populateTypeDropdown(classData);
      renderClasses(classData);
    },
    error: function (error) {
      console.log(error);
      $("#classList").html(
        '<div class="col-12"><div class="alert alert-warning text-center">Error loading classes.</div></div>'
      );
    },
  });
}

function performSearch() {
  var searchText = $("#searchText").val().toLowerCase();

  if (searchText === "") {
    applyFilters();
    return;
  }

  var searchedData = classData.filter(function (c) {
    return (
      c.className.toLowerCase().includes(searchText) ||
      c.city.toLowerCase().includes(searchText)
    );
  });

  var type = $("#type").val();

  var filteredData = searchedData.filter(function (c) {
    return type === "" || c.type === type;
  });

  renderClasses(filteredData);
}

function applyFilters() {
  var searchText = $("#searchText").val().toLowerCase();
  var type = $("#type").val();

  var filteredData = classData.filter(function (c) {
    var matchesSearch =
      searchText === "" ||
      c.className.toLowerCase().includes(searchText) ||
      c.city.toLowerCase().includes(searchText);
    var matchesType = type === "" || c.type === type;

    return matchesSearch && matchesType;
  });

  renderClasses(filteredData);
}

$("#searchText").on("input", performSearch);
$("#filterBtn").click(applyFilters);

function showEditClassForm(classData) {
  const desc = classData.description || {};

  Swal.fire({
    title: "Edit Class",
    html: `
      <form id="editClassForm">
        <div class="mb-3">
          <input type="text" id="editClassName" class="form-control" value="${classData.className}" placeholder="Class Name" required>
        </div>
        <div class="mb-3">
          <select id="editType" class="form-control transparent-select" required>
            <!-- Options will be populated dynamically -->
          </select>
        </div>
        <div class="mb-3">
          <input type="text" id="editCity" class="form-control" value="${classData.city}" placeholder="City" required>
        </div>
        <div class="mb-3">
          <input type="text" id="editAddress" class="form-control" value="${classData.address}" placeholder="Address" required>
        </div>
        <div class="mb-3">
          <label for="editStartDate">Start Date</label>
          <input type="date" id="editStartDate" class="form-control" value="${classData.startDate.split("T")[0]}" required>
        </div>
        <div class="mb-3">
          <label for="editStartTime">Start Time</label>
          <input type="time" id="editStartTime" class="form-control" value="${classData.startTime}" required>
        </div>
        <div class="mb-3">
          <label for="editEndDate">End Date</label>
          <input type="date" id="editEndDate" class="form-control" value="${classData.endDate.split("T")[0]}" required>
        </div>
        <div class="mb-3">
          <label for="editEndTime">End Time</label>
          <input type="time" id="editEndTime" class="form-control" value="${classData.endTime}" required>
        </div>
        <div class="mb-3">
          <input type="number" id="editDuration" class="form-control" value="${classData.duration || ""}" placeholder="Duration (minutes)" min="0" max="1440" required>
        </div>
        <div class="mb-3">
          <input type="number" id="editMaxCapacity" class="form-control" value="${classData.maxCapacity}" placeholder="Max Capacity" required>
        </div>
        <div class="mb-3">
          <input type="number" id="editAvailableCapacity" class="form-control" value="${classData.availableCapacity}" placeholder="Available Seats" min="0" required>
        </div>
        <div class="mb-3">
          <input type="number" id="editFee" class="form-control" value="${classData.fee}" placeholder="Fee" step="0.01" required>
        </div>
        <div class="mb-3 equipment-dropdown">
          <label for="editEquipmentDropdown">Required Equipment</label>
          <button class="btn btn-secondary dropdown-toggle w-100" type="button" id="editEquipmentDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <span id="editEquipmentDropdownText">Select equipment...</span>
          </button>
          <ul class="dropdown-menu" aria-labelledby="editEquipmentDropdown" style="max-height: 200px; overflow-y: auto;">
            <!-- Equipment options will be populated dynamically -->
          </ul>
          <div id="editSelectedEquipment" class="mt-2"></div>
          <div class="invalid-feedback" style="display: none;">Please select at least one equipment item</div>
        </div>
        <div class="mb-3">
          <select id="editStatus" class="form-control transparent-select" required>
            <option value="Active" ${classData.status === "Active" ? "selected" : ""}>Active</option>
            <option value="Inactive" ${classData.status === "Inactive" ? "selected" : ""}>Inactive</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="editPurpose">Purpose</label>
          <textarea id="editPurpose" class="form-control" placeholder="Class Purpose">${desc.purpose || ""}</textarea>
        </div>
        <div class="mb-3">
          <label for="editBenefits">Benefits</label>
          <textarea id="editBenefits" class="form-control" placeholder="Class Benefits">${desc.benefits || ""}</textarea>
        </div>
        <div class="mb-3">
          <input type="file" id="editAssetFiles" class="form-control" multiple accept="image/*">
        </div>
      </form>
    `,
    showCancelButton: true,
    confirmButtonText: "Update",
    didOpen: () => {
      populateEditTypeDropdown(classData.type);
      populateEditEquipmentDropdown(classData.type, classData.requiredEquipments);

      $("#editType").on("change", function () {
        const selectedType = $(this).val();
        populateEditEquipmentDropdown(selectedType, "");
      });

      $("#editClassForm .equipment-dropdown .dropdown-menu input[type='checkbox']").on("change", function () {
        updateEditSelectedEquipment();
      });
    },
    preConfirm: () => {
      const durationValue = $("#editDuration").val();
      const parsedDuration = parseInt(durationValue);
      const maxCapacity = parseInt($("#editMaxCapacity").val());
      const availableCapacity = parseInt($("#editAvailableCapacity").val());

      if (isNaN(parsedDuration) || parsedDuration < 0 || parsedDuration > 1440) {
        Swal.showValidationMessage("Duration must be between 0 and 1440 minutes");
        return false;
      }
      if (availableCapacity > maxCapacity) {
        Swal.showValidationMessage("Available seats cannot exceed max capacity");
        return false;
      }
      if (availableCapacity < 0) {
        Swal.showValidationMessage("Available seats cannot be negative");
        return false;
      }

      const selectedEquipment = [];
      $("#editClassForm .equipment-dropdown .dropdown-menu input[type='checkbox']:checked").each(function () {
        selectedEquipment.push($(this).val());
      });

      const updatedClass = {
        classId: classData.classId,
        className: $("#editClassName").val(),
        instructorId: classData.instructorId,
        type: $("#editType").val(),
        city: $("#editCity").val(),
        address: $("#editAddress").val(),
        startDate: $("#editStartDate").val(),
        startTime: $("#editStartTime").val(),
        endDate: $("#editEndDate").val(),
        endTime: $("#editEndTime").val(),
        duration: parsedDuration,
        maxCapacity: maxCapacity,
        availableCapacity: availableCapacity,
        fee: parseFloat($("#editFee").val()),
        requiredEquipments: selectedEquipment.join(", "),
        status: $("#editStatus").val(),
      };

      const description = {
        purpose: $("#editPurpose").val(),
        benefits: $("#editBenefits").val(),
        moreInfo: desc.moreInfo || "",
        medicalCondition: desc.medicalCondition || "",
      };

      const formData = new FormData();
      for (const [key, value] of Object.entries(updatedClass)) {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      }
      formData.append("description", JSON.stringify(description));

      const files = $("#editAssetFiles")[0].files;
      for (let i = 0; i < files.length; i++) {
        formData.append("assetFiles", files[i]);
      }

      return formData;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      updateClass(result.value);
    }
  });
}

function populateEditEquipmentDropdown(classType, requiredEquipments) {
  const $equipmentMenu = $("#editClassForm .equipment-dropdown .dropdown-menu");
  const $dropdownText = $("#editEquipmentDropdownText");
  $equipmentMenu.empty();

  let selectedEquipment = requiredEquipments ? requiredEquipments.split(", ").map(item => item.trim()) : [];

  if (!classType || !equipmentByClassType[classType]) {
    $dropdownText.text("Select a class type first");
    updateEditSelectedEquipment();
    return;
  }

  equipmentByClassType[classType].forEach(item => {
    const isChecked = selectedEquipment.includes(item.value) ? "checked" : "";
    const $listItem = $(`
      <li>
        <label class="dropdown-item d-flex align-items-center">
          <input type="checkbox" value="${item.value}" ${isChecked} class="form-check-input me-2">
          ${item.icon} ${item.value}
        </label>
      </li>
    `);
    $equipmentMenu.append($listItem);
  });

  updateEditSelectedEquipment();
}

function updateEditSelectedEquipment() {
  const $selectedEquipmentContainer = $("#editSelectedEquipment");
  const selectedEquipment = [];
  $("#editClassForm .equipment-dropdown .dropdown-menu input[type='checkbox']:checked").each(function () {
    selectedEquipment.push($(this).val());
  });

  const $dropdownText = $("#editEquipmentDropdownText");
  if (selectedEquipment.length === 0) {
    $dropdownText.text("Select equipment...");
    $selectedEquipmentContainer.html('<span class="text-muted">No equipment selected</span>');
  } else {
    $dropdownText.text(selectedEquipment.length === 1 ? selectedEquipment[0] : `${selectedEquipment.length} items selected`);
    const $list = $('<ul>').addClass("selected-equipment-list");
    selectedEquipment.forEach(item => {
      const $listItem = $('<li>').addClass("selected-equipment-item").text(item);
      const $removeBtn = $('<button>').addClass("equipment-remove-btn").html("×");
      $removeBtn.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(`#editClassForm .equipment-dropdown .dropdown-menu input[value="${item}"]`).prop("checked", false);
        updateEditSelectedEquipment();
      });
      $listItem.prepend($removeBtn);
      $list.append($listItem);
    });
    $selectedEquipmentContainer.empty().append($list);
  }
}

function updateClass(formData) {
  $.ajax({
    url: `${uri}/api/Class/UpdateClass`,
    type: "PUT",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      if (response.success) {
        Swal.fire("Success", "Class updated successfully", "success").then(
          () => {
            loadClasses();
          }
        );
      } else {
        Swal.fire("Error", response.message, "error");
      }
    },
    error: function (error) {
      Swal.fire(
        "Error",
        "Failed to update class: " +
          (error.responseJSON?.message || "Unknown error"),
        "error"
      );
      console.log(error);
    },
  });
}

function deleteClass(classId) {
  Swal.fire({
    title: "Are you sure?",
    text: "This will soft delete the class!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `http://localhost:8080/api/Class/soft-delete/${classId}`,
        type: "DELETE",
        success: function (response) {
          if (response.success) {
            Swal.fire(
              "Deleted!",
              "Class has been soft deleted.",
              "success"
            ).then(() => {
              loadClasses();
            });
          } else {
            Swal.fire("Error", response.message, "error");
          }
        },
        error: function (error) {
          Swal.fire("Error", "Failed to delete class", "error");
          console.log(error);
        },
      });
    }
  });
}

$("#classList").on("click", ".edit-btn", function () {
  var classId = $(this).data("id");
  var selectedClass = classData.find((c) => c.classId === classId);
  showEditClassForm(selectedClass);
});

$("#classList").on("click", ".delete-btn", function () {
  var classId = $(this).data("id");
  deleteClass(classId);
});

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

window.showProfileDrawer = function () {
  $("#profileDrawer").data("kendoDrawer").show();
};

window.showLogoutConfirmation = function () {
  $("#logoutDialog").data("kendoDialog").open();
};

function performLogout() {
  alert("You have been logged out. Redirecting to login page...");
}