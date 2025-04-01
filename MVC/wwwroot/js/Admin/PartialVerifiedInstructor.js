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
                        text: "Instructor Approved successfully!",
                        icon: "success",
                        confirmButtonText: "OK"
                    }).then(() => {
                        loadVerifiedInstructorList()
                        $("#verified-details").hide();
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
function disapproveInstructor() {
    if (!currentVerifiedInstructorId) {
        Swal.fire("Error", "Please select an instructor first.", "error");
        return;
    }

    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to disapprove this instructor?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Disapprove",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${uri}/api/Instructor/InstructorDisapprove/${currentVerifiedInstructorId}`,
                type: "POST",
                success: function (response) {
                    Swal.fire({
                        title: "Success",
                        text: "Instructor disapproved successfully!",
                        icon: "success",
                        confirmButtonText: "OK"
                    }).then(() => {
                        loadVerifiedInstructorList()
                       $("#verified-details").hide();
                    });
                },
                error: function () {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to disapprove instructor.",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                }
            });
        }
    });
}

function viewPDF(pdfUrl, title) {
    $('#document-title').text(title); // Set the title
    $('#pdf-viewer-modal iframe').attr('src', pdfUrl); // Set the iframe src
    $('#pdf-preview-modal').modal('show'); // Show the modal using jQuery
}

// Load verified instructor list on page load
$(document).ready(function () {
    loadVerifiedInstructorList();
});