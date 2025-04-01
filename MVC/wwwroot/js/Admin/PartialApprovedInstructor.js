let currentInstructorId = null;

// Function to handle image load error
function handleImageError(img) {
    img.src = '/Instructor_Images/placeholder.jpg'; // Local fallback image
    img.onerror = null; // Prevent infinite loop
}

// Load Instructor List
function loadInstructorList() {
    $.ajax({
        url: `${uri}/api/Instructor/GetApprovedInstructors`,
        method: "GET",
        success: function (response) {
            let html = response.data.map(instructor => `
                <li class="list-group-item" data-id="${instructor.instructorId}" onclick="selectInstructor(${instructor.instructorId})">
                    ${instructor.instructorName}
                </li>
            `).join('');
            $('#approved-instructor-names').html(html);
        },
        error: function () {
            console.error("Error loading instructors.");
        }
    });
}

// Select Instructor and Show Details
function selectInstructor(instructorId) {
    $.ajax({
        url: `${uri}/api/Instructor/GetOneInstructor/${instructorId}`,
        method: "GET",
        success: function (response) {
            const instructor = response.data;
            currentInstructorId = instructorId;

            $('#approved-instructor-names .list-group-item').removeClass('active');
            $(`#approved-instructor-names .list-group-item[data-id='${instructorId}']`).addClass('active');

            $('#approved-default-message').addClass('d-none');
            $('#approved-details').removeClass('d-none');

            // Populate instructor details
            $('#approved-name').text(instructor.instructorName || 'N/A');
            $('#approved-email').text(instructor.email || 'N/A');
            $('#approved-phone').text(instructor.mobile || 'N/A');
            $('#approved-gender').text(instructor.gender || 'N/A');
            $('#approved-dob').text(instructor.dob ? new Date(instructor.dob).toLocaleDateString() : 'N/A');
            $('#approved-association').text(instructor.association || 'N/A');
            $('#approved-status').text(instructor.status || 'N/A');
            $('#approved-specialization').text(instructor.specialization || 'N/A');

            // Set profile image
            const profileImage = $('#approved-profile-image');
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
            $('#approved-certifications').text(certifications);

            // Populate documents grid dynamically
            const documentsGrid = $('#approved-documents-grid');
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
            console.error("Error fetching instructor details.");
        }
    });
}

function suspendInstructor() {
    if (!currentInstructorId) {
        Swal.fire("Error", "Please select an instructor first.", "error");
        return;
    }

    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to suspend this instructor?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Suspend",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${uri}/api/Instructor/InstructorSuspend/${currentInstructorId}`,
                type: "POST",
                success: function (response) {
                    Swal.fire({
                        title: "Success",
                        text: "Instructor Suspended successfully!",
                        icon: "success",
                        confirmButtonText: "OK"
                    }).then(() => {
                       loadInstructorList();
                       $("#approved-details").hide();
                    });
                },
                error: function () {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to Suspend instructor.",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                }
            });
        }
    });
}


// View PDF in Modal
function viewPDF(pdfUrl, title) {
    $('#approved-document-title').text(title);
    $('#approved-pdf-viewer-modal iframe').attr('src', pdfUrl);
    new bootstrap.Modal('#approved-pdf-preview-modal').show();
}

// Load instructor list on page load
$(document).ready(function () {
    loadInstructorList();
});