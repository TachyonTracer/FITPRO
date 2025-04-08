// Initialize Kendo UI Components with Validations
$("#userName").kendoTextBox({ placeholder: "Enter your name" });
$("#phone").kendoMaskedTextBox({ mask: "0000000000", placeholder: "__________" });
$("#height").kendoNumericTextBox({ min: 100, max: 250, step: 1, format: "# cm" });
$("#weight").kendoNumericTextBox({ min: 30, max: 200, step: 1, format: "#.00 kg" });
$("#goal").kendoMultiSelect({ dataSource: ["Weight Loss", "Muscle Gain", "General Fitness", "Endurance Training", "Flexibility Improvement", "Sports Specific", "Weight Management"], placeholder: "Select goals..." });
$("#medicalCondition").kendoMultiSelect({ dataSource: ["Diabetes", "High Blood Pressure", "Heart Disease", "Asthma", "Arthritis", "Back Pain", "None", "Hypertension"], placeholder: "Select medical conditions..." });

// Function to Show Profile Drawer and Fetch Data
window.showProfileDrawer = function () {
    if (userId) {
        console.log("Extracted User ID for Profile:", userId);
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
            var goalValues = response.goal ? response.goal.split(", ").map(g => g.trim()) : [];
            $("#goal").data("kendoMultiSelect").value(goalValues);
            var medicalValues = response.medicalCondition ? response.medicalCondition.split(", ").map(mc => mc.trim()) : [];
            $("#medicalCondition").data("kendoMultiSelect").value(medicalValues);
            if (response.profileImage) {
                $("#imagePreview").attr("src", `../User_Images/${response.profileImage}`).show();
            } else {
                $("#imagePreview").hide();
            }
        },
        error: function (xhr) {
            Swal.fire('Error!', 'Error fetching user details.', 'error');
        }
    });
};

// Handle Image Preview
$(document).on("change", "#profileImage", function () {
    var file = this.files?.[0];
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
    $("#nameError").text(value === "" ? "Name is required." : "");
});

// Live validation for phone
$("#phone").on("input blur", function () {
    let value = $(this).val().trim();
    let phoneRegex = /^[6-9]\d{9}$/;
    $("#phoneError").text(value === "" ? "Phone number is required." : (!phoneRegex.test(value) ? "Phone number must be 10 digits and start with 6, 7, 8, or 9." : ""));
});

// Live validation for height
$("#height").data("kendoNumericTextBox").bind("change", function () {
    let value = this.value();
    $("#heightError").text(value === null || isNaN(value) ? "Please enter your height." : "");
});

// Live validation for weight
$("#weight").data("kendoNumericTextBox").bind("change", function () {
    let value = this.value();
    $("#weightError").text(value === null || isNaN(value) ? "Please enter your weight." : "");
});

// Live validation for goal
$("#goal").data("kendoMultiSelect").bind("change", function () {
    let value = this.value();
    $("#goalError").text(!value.length ? "Select at least one goal." : "");
});

// Live validation for medical condition
$("#medicalCondition").data("kendoMultiSelect").bind("change", function () {
    let value = this.value();
    $("#medicalError").text(!value.length ? "Select at least one medical condition." : "");
});

// Form Submission with Validation
$(document).on("submit", "#profileForm", function (e) {
    e.preventDefault();

    $(".validation-message").text("");

    let valid = true;
    valid = valid && ($("#userName").val().trim() !== "" || ($("#nameError").text("Name is required."), false));
    let phoneValue = $("#phone").val().trim();
    let phoneRegex = /^[6-9]\d{9}$/;
    valid = valid && (phoneRegex.test(phoneValue) || ($("#phoneError").text("Invalid phone number."), false));
    valid = valid && (!isNaN($("#height").data("kendoNumericTextBox").value()) || ($("#heightError").text("Please enter your height."), false));
    valid = valid && (!isNaN($("#weight").data("kendoNumericTextBox").value()) || ($("#weightError").text("Please enter your weight."), false));
    valid = valid && ($("#goal").data("kendoMultiSelect").value().length > 0 || ($("#goalError").text("Select at least one goal."), false));
    valid = valid && ($("#medicalCondition").data("kendoMultiSelect").value().length > 0 || ($("#medicalError").text("Select at least one medical condition."), false));

    if (!valid) return;

    var formData = new FormData();
    formData.append("userId", userId);
    formData.append("userName", $("#userName").val());
    formData.append("mobile", $("#phone").val());
    formData.append("height", $("#height").data("kendoNumericTextBox").value());
    formData.append("weight", $("#weight").data("kendoNumericTextBox").value());
    formData.append("goal", $("#goal").data("kendoMultiSelect").value().join(", "));
    formData.append("medicalCondition", $("#medicalCondition").data("kendoMultiSelect").value().join(", "));
    formData.append("gender", "Male"); // Assuming default
    formData.append("email", $("#email").val());
    formData.append("password", "Password@1234"); // Consider how you handle passwords
    formData.append("confirmPassword", "Password@1234");
    var imageFile = $("#profileImage")[0]?.files?.[0];
    if (imageFile) {
        formData.append("profileImageFile", imageFile, imageFile.name);
    } else {
        formData.append("profileImage", $("#imagePreview").attr('src')?.split('/').pop() || 'default.jpg'); // Send existing name if no new file
    }
    formData.append("activationToken", "token_449827858"); // Assuming default

    $.ajax({
        url: `${uri}/api/User/UserUpdateProfile`,
        type: "PUT",
        processData: false,
        contentType: false,
        data: formData,
        success: function () {
            Swal.fire('Success!', 'Your profile has been successfully updated.', 'success').then(() => {
                // Optionally reload dashboard data after profile update
                if (typeof loadDashboardData === 'function') {
                    loadDashboardData();
                }
                drawer.hide();
            });
        },
        error: function (xhr) {
            Swal.fire('Error!', 'There was an issue updating your profile. Please try again later.', 'error');
        }
    });
});