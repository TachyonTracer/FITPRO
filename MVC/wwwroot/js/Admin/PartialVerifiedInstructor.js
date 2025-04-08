let currentVerifiedInstructorId = null;

// Function to handle image load error
function handleImageError(img) {
    img.src = '/Instructor_Images/placeholder.jpg'; // Local fallback image
    img.onerror = null; // Prevent infinite loop
}

// Load Verified Instructor List
function loadVerifiedInstructorList() {
    $.ajax({
        url: `${uri}/api/Instructor/GetVerifiedInstructors`,
        method: "GET",
        success: function (response) {
            let html = response.data.map(instructor => `
                <li class="list-group-item" data-id="${instructor.instructorId}" onclick="selectVerifiedInstructor(${instructor.instructorId})">
                    ${instructor.instructorName}
                </li>
            `).join('');
            $('#verified-instructor-names').html(html);
        },
        error: function () {
            console.error("Error loading verified instructors.");
        }
    });
}

// Select Verified Instructor and Show Details
function selectVerifiedInstructor(instructorId) {
    $.ajax({
        url: `${uri}/api/Instructor/GetOneInstructor/${instructorId}`,
        method: "GET",
        success: function (response) {
            const instructor = response.data;
            currentVerifiedInstructorId = instructorId;

            $('#verified-instructor-names .list-group-item').removeClass('active');
            $(`#verified-instructor-names .list-group-item[data-id='${instructorId}']`).addClass('active');

            $('#verified-default-message').addClass('d-none');
            $('#verified-details').removeClass('d-none');

            // Populate instructor details
            $('#verified-name').text(instructor.instructorName || 'N/A');
            $('#verified-email').text(instructor.email || 'N/A');
            $('#verified-phone').text(instructor.mobile || 'N/A');
            $('#verified-gender').text(instructor.gender || 'N/A');
            $('#verified-dob').text(instructor.dob ? new Date(instructor.dob).toLocaleDateString() : 'N/A');
            $('#verified-association').text(instructor.association || 'N/A');
            $('#verified-status').text(instructor.status || 'N/A');
            $('#verified-specialization').text(instructor.specialization || 'N/A');

            // Set profile image
            const profileImage = $('#verified-profile-image');
            if (instructor.profileImage) {
                profileImage.attr('src', `/Instructor_Images/${instructor.profileImage}`);
            } else {
                profileImage.attr('src', '/Instructor_Images/placeholder.jpg');
                profileImage[0].onerror = null;
            }

            // Handle certifications safely
            let certifications = 'N/A';
            if (instructor.certificates) {
                if (instructor.certificates.certifications) {
                    certifications = instructor.certificates.certifications.join(', ');
                } else {
                    certifications = Object.keys(instructor.certificates).join(', ');
                }
            }
            $('#verified-certifications').text(certifications);

            // Populate documents grid dynamically
            const documentsGrid = $('#verified-documents-grid');
            documentsGrid.empty(); // Clear previous content

            // ID Proof
            if (instructor.idProof) {
                documentsGrid.append(`
                    <div class="document-card" onclick="viewPDF('/Id_Proof/${instructor.idProof}', 'ID Proof')" >
                        <i class="bi bi-credit-card"></i>
                        <h6 class="mb-0">ID Proof</h6>
                    </div>
                `);
            }

            // Certificates
            if (instructor.certificates) {
                const certs = instructor.certificates.certifications || Object.values(instructor.certificates);
                const certKeys = instructor.certificates.certifications || Object.keys(instructor.certificates);
                certs.forEach((cert, index) => {
                    if (typeof cert === 'string' && (cert.includes('.pdf') || cert.includes('.jpg') || cert.includes('.png'))) {
                        const certKey = certKeys[index] || `Certificate ${index + 1}`;
                        documentsGrid.append(`
                            <div class="document-card" onclick="viewPDF('/Certificates/${cert}', '${certKey}')">
                                <i class="bi bi-award"></i>
                                <h6 class="mb-0">${certKey}</h6>
                            </div>
                        `);
                    }
                });
            }
        },
        error: function () {
            console.error("Error fetching verified instructor details.");
        }
    });
}

function approveInstructor() {
    if (!currentVerifiedInstructorId) {
        Swal.fire("Error", "Please select an instructor first.", "error");
        return;
    }

    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to approve this instructor?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Approve",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${uri}/api/Instructor/InstructorApprove/${currentVerifiedInstructorId}`,
                type: "POST",
                success: function (response) {
                    Swal.fire({
                        title: "Success",
                        text: "Instructor approved, Approval mail send successfull!",
                        icon: "success",
                        confirmButtonText: "OK"
                    }).then(() => {
                        currentVerifiedInstructorId = null;
                        $("#verified-details").addClass('d-none');
                        $("#verified-default-message").removeClass('d-none');
                        // Reload both lists
                        loadVerifiedInstructorList();
                        loadInstructorList();
                        
                    });
                },
                error: function () {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to Approve instructor.",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                }
            });
        }
    });
}

// Disapprove Instructor with Swal.fire
// function disapproveInstructor() {
//     if (!currentVerifiedInstructorId) {
//         Swal.fire("Error", "Please select an instructor first.", "error");
//         return;
//     }

//     Swal.fire({
//         title: "Are you sure?",
//         text: "Do you want to disapprove this instructor?",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, Disapprove",
//         cancelButtonText: "Cancel"
//     }).then((result) => {
//         if (result.isConfirmed) {
//             $.ajax({
//                 url: `${uri}/api/Instructor/InstructorDisapprove/${currentVerifiedInstructorId}`,
//                 type: "POST",
//                 success: function (response) {
//                     Swal.fire({
//                         title: "Success",
//                         text: "Instructor disapproved, Disapprove mail send successfull!",
//                         icon: "success",
//                         confirmButtonText: "OK"
//                     }).then(() => {
//                         currentVerifiedInstructorId = null;
                        
//                         $("#verified-details").addClass('d-none');
//                         $("#verified-default-message").removeClass('d-none');
//                         // Reload both lists
//                         loadVerifiedInstructorList();
//                         loadInstructorList();
//                     });
//                 },
//                 error: function () {
//                     Swal.fire({
//                         title: "Error",
//                         text: "Failed to disapprove instructor.",
//                         icon: "error",
//                         confirmButtonText: "OK"
//                     });
//                 }
//             });
//         }
//     });
// }

function disapproveInstructor() {
    if (!currentVerifiedInstructorId) {
        Swal.fire("Error", "Please select an instructor first.", "error");
        return;
    }

    Swal.fire({
        title: "Reason for Disapproval",
        input: "textarea",
        inputLabel: "Please provide a reason :",
        inputPlaceholder: "Enter reason here...",
        inputAttributes: {
            "aria-label": "Type your reason here"
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
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const reason = result.value;

            const formData = new FormData();
            formData.append("reason", reason);

            $.ajax({
                url: `${uri}/api/Instructor/InstructorDisapprove/${currentVerifiedInstructorId}`,
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    Swal.fire({
                        title: "Success",
                        text: response.message,
                        icon: "success",
                        confirmButtonText: "OK"
                    }).then(() => {
                        currentVerifiedInstructorId = null;
                        $("#verified-details").addClass('d-none');
                        $("#verified-default-message").removeClass('d-none');
                        loadVerifiedInstructorList();
                        loadInstructorList();
                    });
                },
                error: function (xhr) {
                    Swal.fire({
                        title: "Error",
                        text: xhr.responseJSON?.message || "Failed to disapprove instructor.",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                }
            });
        }
    });
}



function viewPDF(pdfUrl, title) {
    $('#verified-document-title').text(title);
    $('#verified-pdf-viewer-modal iframe').attr('src', pdfUrl);
    new bootstrap.Modal('#verified-pdf-preview-modal').show();
}
// Load verified instructor list on page load
$(document).ready(function () {
    loadVerifiedInstructorList();
    loadInstructorList();
});