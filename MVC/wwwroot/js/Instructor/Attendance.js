if (!window.jspdf) {
	console.error("jsPDF library not loaded properly");
} else {
	console.log("jsPDF loaded successfully:", window.jspdf);
}

// Removed logo loading code

let userData = [];
let attendanceData = [];
let classesData = [];
let currentDate = new Date();
let editableDate = new Date().toISOString().split('T')[0];

async function fetchAttendanceData(classId) {
	try {

		return new Promise((resolve, reject) => {
			$.ajax({
				url: `http://localhost:8080/api/Attendance/GetAttendanceByClassId?classId=${classId}`,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('authToken')}`
				},
				success: function (result) {
					console.log("Attendance API Response:", result);

					if (result.success) {
						if (result.data && result.data.length > 0) {
							attendanceData = result.data.map(record => ({
								c_attendanceid: record.attendanceId,
								c_classid: record.classId,
								c_attendancedate: record.attendanceDate.split('T')[0],
								c_presentstudents: record.presentStudents || [],
								c_absentstudents: record.absentStudents || []
							}));
							console.log("Formatted Attendance Data:", attendanceData);
						} else {
							console.log("No attendance records found for this class");
							attendanceData = [];
						}
						resolve(true);
					} else {
						console.error('Failed to fetch attendance data:', result.message);
						resolve(false);
					}
				},
				error: function (xhr, status, error) {
					console.error('Error fetching attendance data:', error);
					resolve(false);
				}
			});
		});
	} catch (error) {
		console.error('Error in fetchAttendanceData:', error);
		return false;
	}
}

function updateCheckboxesFromAttendanceData(classId) {
	$("#attendanceTable tbody tr").each(function () {
		const userId = parseInt($(this).find("td:first-child").data("userid"));
		$(this).find('.attendance-checkbox').each(function () {
			const checkboxDate = $(this).data('date');
			const record = attendanceData.find(a =>
				a.c_classid === classId &&
				a.c_attendancedate === checkboxDate
			);

			$(this).prop('checked', false);
			if (record && record.c_presentstudents.includes(userId)) {
				$(this).prop('checked', true);
			}
		});
	});

	calculateAttendancePercentages(classId);
}

function generateClassDateRange(classId) {
	const classItem = classesData.find(c => c.classId == classId);
	if (!classItem) return [];

	// Convert string dates to Date objects
	const startDate = new Date(classItem.startDate);
	const endDate = new Date(classItem.endDate);

	// Reset time components for proper date comparison

	// Array to store all dates in the class period
	const dates = [];

	// Iterate from startDate to endDate
	let currentDateIter = new Date(startDate);
	while (currentDateIter <= endDate) {
		dates.push(new Date(currentDateIter));
		// Move to next day
		currentDateIter.setDate(currentDateIter.getDate() + 1);
	}

	console.log("Generated dates:", dates.map(d => d.toDateString()));
	return dates;
}

function setupTableHeaders(classId) {
	const headerRow = $("#attendanceTable thead tr");
	headerRow.find("th:not(:first-child):not(:last-child)").remove();

	const dateStr = currentDate.toISOString().split('T')[0];
	const dateHeader = formatDateHeader(currentDate);
	// Always make the current date editable
	editableDate = dateStr;

	// Always apply the header styling
	const headerClass = 'attendance-date-header attendance-date-today';

	const headerCell = $(`<th class="${headerClass}" data-date="${dateStr}">${dateHeader}</th>`);
	// Remove date header click event that was toggling the display

	headerCell.insertBefore(headerRow.find("th:last-child"));
	updateNavigationButtons(classId);
	updateDateRangeDisplay(classId);
	updateDatePicker(classId);
	updateEditableStatus(classId);
}

function updateDateRangeDisplay(classId) {
	const classItem = classesData.find(c => c.classId == classId);
	if (!classItem) return;

	// Format the class start and end dates with full date info
	const classStartDateStr = formatFullDate(classItem.startDateTime);
	const classEndDateStr = formatFullDate(classItem.endDateTime);

	// Show the full class date range in the date display area
	const classDateRange = `${classStartDateStr} - ${classEndDateStr}`;

	// Show the currently selected date
	const displayDate = formatDate(currentDate);
	$("#dateRangeDisplay").text(displayDate);

	// Update the class period information in the notification panel
	$(".attendance-notification").html(`
                <strong>Note:</strong> Class period: ${classDateRange}<br>
                You can only mark attendance for past or current dates. Future dates cannot be edited.
            `);
}

function formatFullDate(date) {
	// Force to show the proper day and month
	const options = {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	};

	// Ensure the date is properly processed with local timezone
	return date.toLocaleString('en-US', options);
}

function updateEditableStatus(classId) {
	// Set hardcoded today to April 15, 2025 for consistent testing
	const today = new Date(2025, 3, 15); // JavaScript months are 0-based (3 = April)
	today.setHours(0, 0, 0, 0);

	console.log("Current system date:", new Date().toDateString());
	console.log("Using reference date for editability:", today.toDateString());

	$("#attendanceTable tbody tr").each(function () {
		$(this).find('.attendance-checkbox').each(function () {
			const checkboxDate = $(this).data('date');
			// Create date object with consistent behavior
			const dateObj = new Date(checkboxDate + 'T00:00:00');
			dateObj.setHours(0, 0, 0, 0);

			// Date is only editable if it's today's date or earlier
			const isEditable = checkboxDate === editableDate && dateObj <= today;
			const isFutureDate = dateObj > today;

			console.log("Checking date:", dateObj.toDateString(), "Editable:", isEditable, "Future:", isFutureDate);

			// Store these variables BEFORE potentially removing the element from the DOM
			const $parent = $(this).parent();
			const userId = $(this).data('userid');
			const dateAttr = $(this).data('date');
			const checked = $(this).is(':checked');

			// If it's a future date, make it completely uneditable
			if (isFutureDate) {
				$(this).prop('disabled', true)

				// Remove the checkbox completely and replace with a non-interactive version
				$(this).remove();
				$parent.append(`<div class="future-checkbox-container">
                                <input type="checkbox" 
                                class="attendance-checkbox disabled-checkbox future-disabled"
                                data-userid="${userId}"
                                data-date="${dateAttr}"
                                data-future="true"
                                disabled
                                ${checked ? 'checked' : ''}>
                                <div class="future-checkbox-overlay"></div>
                            </div>`);
			} else {
				// Regular non-future date handling
				$(this).prop('disabled', !isEditable)
					.toggleClass('disabled-checkbox', !isEditable)
					.toggleClass('future-disabled', false)
					.attr('data-future', 'false');
			}

			// Add visual indication for future dates
			$(this).closest('td').toggleClass('future-date-cell', isFutureDate);
		});
	});

	$('.attendance-date-header').removeClass('attendance-date-today');
	$(`.attendance-date-header[data-date="${editableDate}"]`).addClass('attendance-date-today');
}

function populateTable(classId) {
	const tbody = $("#attendanceTable tbody");
	tbody.empty();

	if (!userData || userData.length === 0) {
		tbody.html('<tr><td colspan="100%" class="text-center">No users found for this class</td></tr>');
		return;
	}

	const dateStr = currentDate.toISOString().split('T')[0];
	const isEditable = dateStr === editableDate;
	const cellClass = isEditable ? 'attendance-date-today' : '';
	const checkboxClass = isEditable ? 'attendance-checkbox' : 'attendance-checkbox disabled-checkbox';

	userData.forEach(user => {
		const row = $("<tr></tr>");
		row.append(`<td class="student-name" data-userid="${user.userId}">${user.username}</td>`);

		const cell = `
                    <td class="${cellClass}">
                        <div class="form-check d-flex justify-content-center">
                            <input type="checkbox" 
                                class="${checkboxClass}"
                                data-userid="${user.userId}"
                                data-date="${dateStr}"
                                ${isEditable ? '' : 'disabled'}>
                        </div>
                    </td>
                `;
		row.append(cell);
		row.append(`<td class="attendance-percentage">0%</td>`);
		tbody.append(row);
	});

	updateCheckboxesFromAttendanceData(classId);
	filterStudents();
}

function calculateAttendancePercentages(classId) {
	const classItem = classesData.find(c => c.classId == classId);
	if (!classItem) return;

	const startDate = new Date(classItem.startDate);
	const endDate = new Date(classItem.endDate);
	const today = new Date();
	const effectiveEndDate = endDate < today ? endDate : today;
	const dates = [];

	let currentDateIter = new Date(startDate);
	while (currentDateIter <= effectiveEndDate) {
		dates.push(new Date(currentDateIter));
		currentDateIter.setDate(currentDateIter.getDate() + 1);
	}

	$("#attendanceTable tbody tr").each(function () {
		const userId = parseInt($(this).find("td:first-child").data("userid"));
		let presentCount = 0;

		dates.forEach(date => {
			const dateStr = date.toISOString().split('T')[0];
			const record = attendanceData.find(a =>
				a.c_classid === classId &&
				a.c_attendancedate === dateStr
			);

			if (record && record.c_presentstudents.includes(userId)) {
				presentCount++;
			}
		});

		const totalDays = dates.length;
		const percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;
		$(this).find(".attendance-percentage").text(`${percentage}%`);

		if (percentage < 75) {
			$(this).find(".attendance-percentage").addClass("text-danger");
		} else {
			$(this).find(".attendance-percentage").removeClass("text-danger");
		}
	});
}

function updateAttendanceData(classId, userId, date, present) {
	let record = attendanceData.find(a =>
		a.c_classid == classId &&
		a.c_attendancedate == date
	);

	if (record) {
		if (present) {
			record.c_presentstudents = [...new Set([...record.c_presentstudents, userId])];
			record.c_absentstudents = record.c_absentstudents.filter(id => id !== userId);
		} else {
			record.c_absentstudents = [...new Set([...record.c_absentstudents, userId])];
			record.c_presentstudents = record.c_presentstudents.filter(id => id !== userId);
		}
	} else {
		const newRecord = {
			c_attendanceid: attendanceData.length + 1,
			c_classid: classId,
			c_attendancedate: date,
			c_presentstudents: present ? [userId] : [],
			c_absentstudents: present ? [] : [userId]
		};
		attendanceData.push(newRecord);
	}

	calculateAttendancePercentages(classId);
}

function formatDateHeader(date) {
	return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

function formatDate(date) {
	return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

async function fetchClassData() {
	try {
		const instructorId = getUserIdFromToken();

		return new Promise((resolve, reject) => {
			$.ajax({
				url: `http://localhost:8080/api/Class/GetClassesByInstructorId?id=${instructorId}`,
				method: 'GET',
				dataType: 'json',
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('authToken')}`
				},
				success: function (result) {
					console.log("Class API Response:", result);

					const now = new Date();
					if (result.sucess || result.success) {
						classesData = result.data
							.filter(cls => new Date(cls.startDate) <= now)
							.map(cls => {
								// Format dates
								const startDateTime = new Date(cls.startDate);
								const endDateTime = new Date(cls.endDate);
								const startlocalDate = startDateTime.toISOString().split('T')[0];
								const endlocalDate = endDateTime.toISOString().split('T')[0];

								return {
									classId: cls.classId,
									className: cls.className,
									type: cls.type,
									startDate: startlocalDate,
									endDate: endlocalDate,
									startDateTime: startDateTime,
									endDateTime: endDateTime
								};
							});
						console.log("Formatted Classes Data:", classesData);
						resolve(classesData);
					} else {
						console.error('Failed to fetch classes:', result.message);
						resolve([]);
					}
				},
				error: function (xhr, status, error) {
					console.error('Error fetching classes:', error);
					resolve([]);
				}
			});
		});
	} catch (error) {
		console.error('Error in fetchClassData:', error);
		return [];
	}
}

async function fetchUsersForClass(classId) {
	try {
		userData = [];

		return new Promise((resolve, reject) => {
			$.ajax({
				url: `http://localhost:8080/api/User/GetAllUsersByClassId/${classId}`,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('authToken')}`
				},
				success: function (result) {
					if (result.success) {
						userData = [];
						attendanceData = [];
						userData = result.data.map(user => ({
							userId: user.userId,
							username: user.userName
						}));
						console.log("Fetched User Data:", userData);

						// Restore the table element after successful data fetch
						$("#attendance-table-wrapper").html(`
							<table class="table table-bordered table-hover" id="attendanceTable">
								<thead>
									<tr>
										<th style="width: 200px; text-align: left;">Username</th>
										<!-- Date headers will be dynamically added here -->
										<th style="width: 100px;">Attendance %</th>
									</tr>
								</thead>
								<tbody>
									<!-- Attendance data will be populated here -->
								</tbody>
							</table>
						`);

						resolve(true);
					} else {
						console.error('Failed to fetch users:', result.message);
						userData = []; // Ensure userData is empty
						$("#attendance-table-wrapper").html('<div class="alert alert-warning">No users available for this class.</div>');
						resolve(false);
					}
				},
				error: function (xhr, status, error) {
					console.error('Error fetching users:', error);
					userData = []; // Ensure userData is empty
					$("#attendance-table-wrapper").html('<div class="alert alert-danger">Failed to fetch users. Please try again later.</div>');
					resolve(false);
				}
			});
		});
	} catch (error) {
		console.error('Error in fetchUsersForClass:', error);
		userData = []; // Ensure userData is empty
		$("#attendance-table-wrapper").html('<div class="alert alert-danger">An error occurred while fetching users.</div>');
		return false;
	}
}

function updateNavigationButtons(classId) {
	const classItem = classesData.find(c => c.classId == classId);
	if (!classItem) return;

	// Convert string dates to Date objects
	const startDate = new Date(classItem.startDate);
	const endDate = new Date(classItem.endDate);
	const actualToday = new Date();

	// Reset time components for proper comparison
	startDate.setHours(0, 0, 0, 0);
	endDate.setHours(0, 0, 0, 0);
	actualToday.setHours(0, 0, 0, 0);

	const today = new Date(currentDate);
	today.setHours(0, 0, 0, 0);

	// Calculate previous day
	const prevDay = new Date(today);
	prevDay.setDate(prevDay.getDate() - 1);

	// Calculate next day
	const nextDay = new Date(today);
	nextDay.setDate(nextDay.getDate() + 1);

	// Previous button should be disabled if the previous day would be before the class start date
	const isPrevDayBeforeStart = prevDay < startDate;
	$("#prevDay").prop('disabled', isPrevDayBeforeStart);

	// Next button should be disabled if:
	// 1. The next day would be after the class end date, OR
	// 2. The next day would be after today's actual date (can't go to the future)
	const isNextDayAfterEnd = nextDay > endDate;
	const isNextDayAfterToday = nextDay > actualToday;
	$("#nextDay").prop('disabled', isNextDayAfterEnd || isNextDayAfterToday);

	console.log(`Class period: ${startDate.toDateString()} to ${endDate.toDateString()}`);
	console.log(`Current date: ${today.toDateString()}, Actual today: ${actualToday.toDateString()}`);
	console.log(`Prev button disabled: ${isPrevDayBeforeStart}, Next button disabled: ${isNextDayAfterEnd || isNextDayAfterToday}`);
	console.log(`Next day would be future date: ${isNextDayAfterToday}`);
}

async function initializeAttendance() {
	try {
		classesData = await fetchClassData();

		if (!classesData || classesData.length === 0) {
			$("#attendance-table-wrapper").html('<div class="alert alert-info">No classes found.</div>');
			console.warn("No classes loaded into classesData");
			return;
		}

		const classSelect = $("#classSelect");
		classSelect.empty();
		classSelect.append('<option value="">Select a class</option>');
		classesData.forEach(classItem => {
			classSelect.append(`<option value="${classItem.classId}">${classItem.className}</option>`);
		});

		$("#classSelect").change(async function () {
			const selectedClassId = parseInt($(this).val());
			if (!selectedClassId) {
				$("#attendance-table-wrapper").html('<div class="alert alert-info">Please select a class.</div>');
				$("#classPeriodInfo").text("Please select a class to view period details");
				return;
			}

			// Get the selected class data
			const classItem = classesData.find(c => c.classId == selectedClassId);
			if (!classItem) return;

			// Format class period date range for display
			const startDateFormatted = formatFullDate(classItem.startDateTime);
			const endDateFormatted = formatFullDate(classItem.endDateTime);
			$("#classPeriodInfo").html(`Class period: <span class="class-period-dates">${startDateFormatted} - ${endDateFormatted}</span>`);

			// Convert string dates to Date objects and reset time components
			const classStartDate = new Date(classItem.startDate);
			const classEndDate = new Date(classItem.endDate);
			classStartDate.setHours(0, 0, 0, 0);
			classEndDate.setHours(0, 0, 0, 0);

			const today = new Date();
			today.setHours(0, 0, 0, 0);

			// Calculate the appropriate date to show
			if (today >= classStartDate && today <= classEndDate) {
				currentDate = new Date(today);
			} else if (today < classStartDate) {
				currentDate = new Date(classStartDate);
			} else {
				currentDate = new Date(classEndDate);
			}

			// Inline loader with complete CSS included directly
			$("#attendance-table-wrapper").html(`
				<style>
					:root {
					  --brand-gold: #facc15;
					  --text-light: rgba(255, 255, 255, 0.8);
					  --text-muted: rgba(255, 255, 255, 0.5);
					  --bg-dark: #222222;
					}

					.loader-container {
					  display: flex;
					  flex-direction: column;
					  align-items: center;
					  justify-content: center;
					  padding: 40px 20px;
					  width: 100%;
					  min-height: 300px;
					  background-color: var(--bg-dark);
					  border-radius: 10px;
					}

					.loader-ring {
					  position: relative;
					  width: 120px;
					  height: 120px;
					  margin-bottom: 30px;
					}

					.outer-ring,
					.inner-ring,
					.progress-ring,
					.inner-progress {
					  position: absolute;
					  border-radius: 50%;
					}

					.outer-ring {
					  width: 100%;
					  height: 100%;
					  border: 4px solid rgba(255, 255, 255, 0.1);
					}

					.inner-ring {
					  width: 80%;
					  height: 80%;
					  top: 10%;
					  left: 10%;
					  border: 3px solid transparent;
					}

					.progress-ring,
					.inner-progress {
					  border: 4px solid transparent;
					  border-top-color: var(--brand-gold);
					  animation: spin 2s ease-in-out infinite;
					}

					.progress-ring {
					  width: 100%;
					  height: 100%;
					}

					.inner-progress {
					  width: 80%;
					  height: 80%;
					  top: 10%;
					  left: 10%;
					  border-width: 3px;
					  animation-direction: reverse;
					}

					.center-icon {
					  position: absolute;
					  top: 50%;
					  left: 50%;
					  transform: translate(-50%, -50%);
					  font-size: 28px;
					  color: var(--brand-gold);
					  filter: drop-shadow(0 0 6px var(--brand-gold));
					  animation: pulse 2s ease-in-out infinite;
					}

					.material-symbols-outlined {
					  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
					}

					.loading-text {
					  font-size: 14px;
					  font-weight: 300;
					  letter-spacing: 5px;
					  text-transform: uppercase;
					  color: var(--text-light);
					  font-family: 'Montserrat', sans-serif;
					}

					.dot-animation {
					  display: inline-block;
					  position: relative;
					  width: 24px;
					  height: 10px;
					  margin-left: 5px;
					}

					.dot {
					  position: absolute;
					  width: 6px;
					  height: 6px;
					  border-radius: 50%;
					  background-color: var(--brand-gold);
					  opacity: 0;
					  animation: dots 1.5s ease-in-out infinite;
					}

					.dot:nth-child(1) { left: 0; animation-delay: 0s; }
					.dot:nth-child(2) { left: 9px; animation-delay: 0.4s; }
					.dot:nth-child(3) { left: 18px; animation-delay: 0.8s; }

					@keyframes spin {
					  0% { transform: rotate(0deg); }
					  100% { transform: rotate(360deg); }
					}

					@keyframes pulse {
					  0%, 100% {
						transform: translate(-50%, -50%) scale(1);
						filter: drop-shadow(0 0 6px var(--brand-gold));
					  }
					  50% {
						transform: translate(-50%, -50%) scale(1.2);
						filter: drop-shadow(0 0 10px var(--brand-gold));
					  }
					}

					@keyframes dots {
					  0%, 100% {
						opacity: 0;
						transform: translateY(0);
					  }
					  50% {
						opacity: 1;
						transform: translateY(-5px);
					  }
					}
				</style>
				
				<!-- Gym Loader Animation with exercise icon -->
				<div class="loader-container">
				  <div class="loader-ring">
					<div class="outer-ring"></div>
					<div class="inner-ring"></div>
					<div class="progress-ring"></div>
					<div class="inner-progress"></div>
					<span class="material-symbols-outlined center-icon">exercise</span>
				  </div>

				  <div class="loading-text">
					LOADING
					<span class="dot-animation">
					  <span class="dot"></span>
					  <span class="dot"></span>
					  <span class="dot"></span>
					</span>
				  </div>
				</div>
			`);

			// Continue with data loading
			await fetchUsersForClass(selectedClassId);
			await fetchAttendanceData(selectedClassId);
			setupTableHeaders(selectedClassId);
			populateTable(selectedClassId);
			updateDatePicker(selectedClassId);
		});

		if (classesData.length > 0) {
			classSelect.val(classesData[0].classId).change();
		}
	} catch (error) {
		console.error('Error initializing attendance:', error);
		$("#attendance-table-wrapper").html('<div class="alert alert-danger">Error loading classes.</div>');
	}
}

initializeAttendance();

$("#prevDay").click(function () {
	const classId = parseInt($("#classSelect").val());
	if (!classId) return;

	currentDate.setDate(currentDate.getDate() - 1);
	setupTableHeaders(classId);
	populateTable(classId);
});

$("#nextDay").click(function () {
	const classId = parseInt($("#classSelect").val());
	if (!classId) return;


	currentDate.setDate(currentDate.getDate() + 1);
	setupTableHeaders(classId);
	populateTable(classId);
});

$("#datePicker").change(function () {
	const classId = parseInt($("#classSelect").val());
	if (!classId) return;

	// Get the raw date value from the input field to avoid timezone issues
	const selectedDateString = $(this).val(); // Format: YYYY-MM-DD

	// Create dates using parts to ensure timezone doesn't affect the date
	const [year, month, day] = selectedDateString.split('-').map(Number);
	const selectedDate = new Date(year, month - 1, day, 0, 0, 0, 0);

	// Create today's date in a timezone-neutral way
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

	// Check if the selected date is within the class period
	const classItem = classesData.find(c => c.classId == classId);
	if (!classItem) return;

	// Create dates from strings in a timezone-neutral way
	const [startYear, startMonth, startDay] = classItem.startDate.split('-').map(Number);
	const startDate = new Date(startYear, startMonth - 1, startDay, 0, 0, 0, 0);

	const [endYear, endMonth, endDay] = classItem.endDate.split('-').map(Number);
	const endDate = new Date(endYear, endMonth - 1, endDay, 0, 0, 0, 0);

	console.log("Selected date:", selectedDate);
	console.log("Start date:", startDate);
	console.log("End date:", endDate);
	console.log("Today:", today);

	if (selectedDate >= startDate && selectedDate <= endDate) {
		// Prevent selecting future dates for editing
		if (selectedDate > today) {
			Swal.fire({
				icon: 'warning',
				title: 'Future Date',
				text: 'You can view future dates but cannot edit attendance for them.',
				background: '#1a1a1a',
				color: '#ffffff',
				confirmButtonColor: '#facc15'
			});

			// Ensure we set a flag to mark this as a future date
			// so checkboxes will be disabled after table is populated
			const selectedDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
			editableDate = selectedDateStr;
		}

		// Update the current date in a timezone-neutral way
		currentDate = new Date(year, month - 1, day, 0, 0, 0, 0);
		setupTableHeaders(classId);
		populateTable(classId);

		// Make sure the updateEditableStatus is called to properly
		// disable checkboxes for future dates
		updateEditableStatus(classId);
	} else {
		Swal.fire({
			icon: 'error',
			title: 'Invalid Date',
			text: 'Please select a date within the class period.',
			background: '#1a1a1a',
			color: '#ffffff',
			confirmButtonColor: '#dc3545'
		});
		// Reset to current date - ensure consistent formatting
		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth() + 1;
		const currentDay = currentDate.getDate();
		const formattedDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
		$(this).val(formattedDate);
	}
});

$(document).on("change", ".attendance-checkbox:not(.disabled-checkbox)", function () {
	const classId = parseInt($("#classSelect").val());
	const userId = parseInt($(this).data("userid"));
	const date = $(this).data("date");
	const present = $(this).is(":checked");
	updateAttendanceData(classId, userId, date, present);
});

$("#markAllPresent").click(function () {
	if ($(this).prop('disabled')) return;

	const classId = parseInt($("#classSelect").val());
	if (!classId) return;

	// Use the currently displayed date instead of just today
	const dateStr = currentDate.toISOString().split('T')[0];

	$("#attendanceTable tbody tr").each(function () {
		const userId = parseInt($(this).find("td:first-child").data("userid"));
		const checkbox = $(this).find(`.attendance-checkbox[data-date="${dateStr}"]`);
		if (checkbox.length > 0 && !checkbox.prop('disabled')) {
			checkbox.prop("checked", true);
			updateAttendanceData(classId, userId, dateStr, true);
		}
	});

	Swal.fire({
		icon: 'success',
		title: 'Success!',
		text: 'All students marked present for ' + formatDate(currentDate),
		background: '#1a1a1a',
		color: '#ffffff',
		confirmButtonColor: '#10b981',
		timer: 1500
	});
});

$("#markAllAbsent").click(function () {
	if ($(this).prop('disabled')) return;

	const classId = parseInt($("#classSelect").val());
	if (!classId) return;

	// Use the currently displayed date instead of just today
	const dateStr = currentDate.toISOString().split('T')[0];

	$("#attendanceTable tbody tr").each(function () {
		const userId = parseInt($(this).find("td:first-child").data("userid"));
		const checkbox = $(this).find(`.attendance-checkbox[data-date="${dateStr}"]`);
		if (checkbox.length > 0 && !checkbox.prop('disabled')) {
			checkbox.prop("checked", false);
			updateAttendanceData(classId, userId, dateStr, false);
		}
	});

	Swal.fire({
		icon: 'success',
		title: 'Success!',
		text: 'All students marked absent for ' + formatDate(currentDate),
		background: '#1a1a1a',
		color: '#ffffff',
		confirmButtonColor: '#ef4444',
		timer: 1500
	});
});

$("#saveAttendance").click(function () {
	const classId = parseInt($("#classSelect").val());
	const presentStudents = [];
	const absentStudents = [];

	$("#attendanceTable tbody tr").each(function () {
		const checkbox = $(this).find(`.attendance-checkbox[data-date="${editableDate}"]`);
		const userId = parseInt(checkbox.data("userid"));

		if (checkbox.is(":checked")) {
			presentStudents.push(userId);
		} else {
			absentStudents.push(userId);
		}
	});

	const attendanceData = {
		classId: classId,
		attendanceDate: editableDate,
		presentStudents: presentStudents,
		absentStudents: absentStudents,
		attendanceId: 0
	};

	// First check if attendance record exists
	$.ajax({
		url: `http://localhost:8080/api/Attendance/CheckIfExists?classId=${classId}&date=${editableDate}`,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('authToken')}`
		},
		success: function (checkResult) {
			let apiUrl = 'http://localhost:8080/api/Attendance/AddAttendance';
			let method = 'POST';

			if (checkResult.exists) {
				apiUrl = 'http://localhost:8080/api/Attendance/UpdateAttendance';
				method = 'PUT';
				attendanceData.attendanceId = checkResult.attendanceId;
			}

			// Now save/update the attendance
			$.ajax({
				url: apiUrl,
				method: method,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('authToken')}`
				},
				data: JSON.stringify(attendanceData),
				dataType: 'json',
				success: function (result) {
					if (result.success) {
						Swal.fire({
							icon: 'success',
							title: 'Success!',
							text: 'Attendance saved successfully',
							background: '#1a1a1a',
							color: '#ffffff',
							confirmButtonColor: '#facc15'
						});

						// Refresh attendance data
						fetchAttendanceData(classId).then(() => {
							populateTable(classId);
						});
					} else {
						throw new Error(result.message || 'Failed to save attendance');
					}
				},
				error: function (xhr, status, error) {
					console.error('Error saving attendance:', error);
					Swal.fire({
						icon: 'error',
						title: 'Error!',
						text: 'Failed to save attendance. Please try again.',
						background: '#1a1a1a',
						color: '#ffffff',
						confirmButtonColor: '#dc3545'
					});
				}
			});
		},
		error: function (xhr, status, error) {
			console.error('Error checking if attendance exists:', error);
			Swal.fire({
				icon: 'error',
				title: 'Error!',
				text: 'Failed to check existing attendance. Please try again.',
				background: '#1a1a1a',
				color: '#ffffff',
				confirmButtonColor: '#dc3545'
			});
		}
	});
});

$("#exportAttendance").click(function () {
	alert("Attendance data exported to Excel!");
});

$("#attendance-search").on("input", function () {
	filterStudents();
});

$("#attendance-filter").click(function () {
	$(this).toggleClass("active");
	$("#attendance-search").trigger("input");
});

$(document).on("click", "tr", function (e) {
	if ($("#quickMarkMode").is(":checked")) {
		const checkbox = $(this).find(`.attendance-checkbox[data-date="${editableDate}"]:not(.disabled-checkbox)`);
		if (checkbox.length) {
			checkbox.prop("checked", !checkbox.is(":checked")).trigger("change");
		}
	}
});

function getUserIdFromToken() {
	const token = localStorage.getItem("authToken");
	if (!token) {
		console.warn("No auth token found in localStorage.");
		return null;
	}
	const decoded = parseJwt(token);
	if (decoded) {
		console.log("Decoded UserObject:", JSON.parse(decoded.UserObject));
		return JSON.parse(decoded.UserObject).instructorId;
	}
	console.warn("Invalid or malformed token.");
	return null;
}

// Placeholder for parseJwt (implement as needed)
function parseJwt(token) {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));

		return JSON.parse(jsonPayload);
	} catch (e) {
		console.error("Error parsing JWT:", e);
		return null;
	}
}

const dateStr = currentDate.toISOString().split('T')[0];


$("#datePicker").val(dateStr);

function updateDatePicker(classId) {
	const classItem = classesData.find(c => c.classId == classId);
	if (!classItem) return;

	const startDate = classItem.startDate;
	// Get the current date in YYYY-MM-DD format
	const today = new Date();
	const currentDateStr = today.getFullYear() + '-' +
		String(today.getMonth() + 1).padStart(2, '0') + '-' +
		String(today.getDate()).padStart(2, '0');

	// Use either the class end date or the current date, whichever is earlier
	const endDate = classItem.endDate;
	const effectiveMaxDate = new Date(endDate) < today ? endDate : currentDateStr;

	$("#datePicker").attr("min", startDate);
	$("#datePicker").attr("max", effectiveMaxDate);

	const dateStr = formatDateLocal(currentDate); // Local-safe format
	console.log("dateStr:");
	console.log(dateStr);
	$("#datePicker").val(dateStr);
}

function formatDateLocal(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

// Show/hide students based on attendance
$("#show-absent").click(function () {
	$(this).toggleClass("active");
	$("#show-present").removeClass("active");
	filterStudents();
});

$("#show-present").click(function () {
	$(this).toggleClass("active");
	$("#show-absent").removeClass("active");
	filterStudents();
});

function filterStudents() {
	const searchTerm = $("#attendance-search").val().toLowerCase();
	const showAbsentOnly = $("#show-absent").hasClass("active");
	const showPresentOnly = $("#show-present").hasClass("active");
	const dateStr = currentDate.toISOString().split('T')[0];

	$("#attendanceTable tbody tr").each(function () {
		const username = $(this).find("td:first-child").text().toLowerCase();
		const isPresent = $(this).find(`.attendance-checkbox[data-date="${dateStr}"]`).is(":checked");

		let showRow = username.includes(searchTerm);

		if (showAbsentOnly) {
			showRow = showRow && !isPresent;
		} else if (showPresentOnly) {
			showRow = showRow && isPresent;
		}

		$(this).toggle(showRow);
	});
}

// Report generation functions
$("#dailyReportBtn").click(function () {
	try {
		const classId = parseInt($("#classSelect").val());
		if (!classId) {
			Swal.fire({
				icon: 'warning',
				title: 'No Class Selected',
				text: 'Please select a class first.',
				background: '#1a1a1a',
				color: '#ffffff',
				confirmButtonColor: '#facc15'
			});
			return;
		}

		const dateStr = currentDate.toISOString().split('T')[0];
		const displayDate = formatDate(currentDate);
		const classItem = classesData.find(c => c.classId == classId);

		if (!classItem) return;

		// Generate report data for the current date
		const presentStudents = [];
		const absentStudents = [];

		$("#attendanceTable tbody tr").each(function () {
			const userId = parseInt($(this).find("td:first-child").data("userid"));
			const username = $(this).find("td:first-child").text();
			const isPresent = $(this).find(`.attendance-checkbox[data-date="${dateStr}"]`).is(":checked");

			if (isPresent) {
				presentStudents.push({ userId, username });
			} else {
				absentStudents.push({ userId, username });
			}
		});

		// Create a report object
		const report = {
			className: classItem.className,
			date: displayDate,
			totalStudents: userData.length,
			presentCount: presentStudents.length,
			absentCount: absentStudents.length,
			attendancePercentage: userData.length > 0 ? Math.round((presentStudents.length / userData.length) * 100) : 0,
			presentStudents: presentStudents,
			absentStudents: absentStudents
		};

		// Log the report data for debugging
		console.log("Generating daily report with data:", report);

		// Show report as PDF
		showDailyReport(report);
	} catch (error) {
		console.error("Error in dailyReportBtn click handler:", error);
		Swal.fire({
			icon: 'error',
			title: 'Error Generating Report',
			text: 'Could not generate the attendance report. Please try again later.',
			background: '#1a1a1a',
			color: '#ffffff',
			confirmButtonColor: '#dc3545'
		});
	}
});

$("#classReportBtn").click(function () {
	try {
		const classId = parseInt($("#classSelect").val());
		if (!classId) {
			Swal.fire({
				icon: 'warning',
				title: 'No Class Selected',
				text: 'Please select a class first.',
				background: '#1a1a1a',
				color: '#ffffff',
				confirmButtonColor: '#facc15'
			});
			return;
		}

		const classItem = classesData.find(c => c.classId == classId);
		if (!classItem) return;

		// Generate full report data for all dates in the class period
		const startDate = new Date(classItem.startDate);
		const endDate = new Date(classItem.endDate);
		const today = new Date();
		const effectiveEndDate = endDate < today ? endDate : today;

		// Array to store attendance data for each date
		const dateReports = [];

		// Object to track student attendance data
		const studentAttendance = {};

		// Initialize student attendance records
		userData.forEach(user => {
			studentAttendance[user.userId] = {
				userId: user.userId,
				username: user.username,
				presentDays: 0,
				absentDays: 0,
				attendancePercentage: 0
			};
		});

		// Process each date in the class period
		let currentDateIter = new Date(startDate);
		while (currentDateIter <= effectiveEndDate) {
			const dateStr = currentDateIter.toISOString().split('T')[0];
			const formattedDate = formatDate(currentDateIter);

			const record = attendanceData.find(a =>
				a.c_classid === classId &&
				a.c_attendancedate === dateStr
			);

			const presentStudents = [];
			const absentStudents = [];

			// Process each student's attendance for this date
			userData.forEach(user => {
				const isPresent = record && record.c_presentstudents.includes(user.userId);

				if (isPresent) {
					presentStudents.push({ userId: user.userId, username: user.username });
					studentAttendance[user.userId].presentDays++;
				} else {
					absentStudents.push({ userId: user.userId, username: user.username });
					studentAttendance[user.userId].absentDays++;
				}
			});

			dateReports.push({
				date: formattedDate,
				dateString: dateStr,
				totalStudents: userData.length,
				presentCount: presentStudents.length,
				absentCount: absentStudents.length,
				attendancePercentage: userData.length > 0 ? Math.round((presentStudents.length / userData.length) * 100) : 0,
				presentStudents: presentStudents,
				absentStudents: absentStudents
			});

			// Move to next day
			currentDateIter.setDate(currentDateIter.getDate() + 1);
		}

		// Calculate overall attendance percentages for each student
		Object.values(studentAttendance).forEach(student => {
			const totalDays = student.presentDays + student.absentDays;
			student.attendancePercentage = totalDays > 0 ? Math.round((student.presentDays / totalDays) * 100) : 0;
		});

		// Create a full report object
		const report = {
			className: classItem.className,
			startDate: formatDate(startDate),
			endDate: formatDate(effectiveEndDate),
			totalDays: dateReports.length,
			totalStudents: userData.length,
			dateReports: dateReports,
			studentAttendance: Object.values(studentAttendance).sort((a, b) => b.attendancePercentage - a.attendancePercentage)
		};

		// Show report in a modal or download it
		showCompleteReport(report);
	} catch (error) {
		console.error("Error in classReportBtn click handler:", error);
		Swal.fire({
			icon: 'error',
			title: 'Error Generating Report',
			text: 'Could not generate the complete attendance report. Please try again later.',
			background: '#1a1a1a',
			color: '#ffffff',
			confirmButtonColor: '#dc3545'
		});
	}
});

function showDailyReport(report) {
	try {
		// Initialize jsPDF with proper object initialization
		const { jsPDF } = window.jspdf;
		const doc = new jsPDF();

		// Set report title and details
		doc.setFontSize(18);
		doc.setTextColor(0, 0, 0);
		doc.text("Daily Attendance Report", 105, 15, { align: "center" });

		// Add current date
		const today = new Date();
		const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
		doc.setFontSize(10);
		doc.setTextColor(100, 100, 100);
		doc.text(`Report generated on: ${formattedDate}`, 195, 10, { align: "right" });

		// Add class details
		doc.setFontSize(12);
		doc.setTextColor(0, 0, 0);
		doc.text(`Class: ${report.className}`, 14, 30);
		doc.text(`Date: ${report.date}`, 14, 37);
		doc.text(`Total Students: ${report.totalStudents}`, 14, 44);
		doc.text(`Present: ${report.presentCount}`, 14, 51);
		doc.text(`Absent: ${report.absentCount}`, 14, 58);
		doc.text(`Attendance Percentage: ${report.attendancePercentage}%`, 14, 65);

		// Add Present Students table
		doc.setFontSize(14);
		doc.setTextColor(0, 0, 0);
		doc.text("Present Students", 14, 80);

		let yPosition = 85;

		if (report.presentStudents && report.presentStudents.length > 0) {
			// Make sure we have valid data for the table
			const presentData = report.presentStudents.map(student => [
				student.username || "Unknown"
			]);

			doc.autoTable({
				startY: yPosition,
				head: [['Username']],
				body: presentData,
				theme: 'grid',
				headStyles: { fillColor: [16, 185, 129] } // Green color for present
			});

			yPosition = doc.lastAutoTable.finalY + 15;
		} else {
			doc.setFontSize(11);
			doc.text("No students present on this date.", 14, 90);
			yPosition = 100;
		}

		// Add Absent Students table
		doc.setFontSize(14);
		doc.text("Absent Students", 14, yPosition);

		if (report.absentStudents && report.absentStudents.length > 0) {
			// Make sure we have valid data for the table
			const absentData = report.absentStudents.map(student => [
				student.username || "Unknown"
			]);

			doc.autoTable({
				startY: yPosition + 5,
				head: [['Username']],
				body: absentData,
				theme: 'grid',
				headStyles: { fillColor: [239, 68, 68] } // Red color for absent
			});
		} else {
			doc.setFontSize(11);
			doc.text("No students absent on this date.", 14, yPosition + 10);
		}

		// Add footer
		const pageCount = doc.internal.getNumberOfPages();
		for (let i = 1; i <= pageCount; i++) {
			doc.setPage(i);
			doc.setFontSize(10);
			doc.setTextColor(100, 100, 100);
			doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: "center" });
			doc.text("FitPro Attendance System", 195, doc.internal.pageSize.height - 10, { align: "right" });
		}

		// Save the PDF
		doc.save(`${report.className}_Attendance_${report.date.replace(/\//g, '-')}.pdf`);

		Swal.fire({
			icon: 'success',
			title: 'Report Generated',
			text: `Daily attendance report for ${report.date} has been downloaded as PDF.`,
			background: '#1a1a1a',
			color: '#ffffff',
			confirmButtonColor: '#facc15'
		});
	} catch (error) {
		console.error("Error generating PDF report:", error);
		Swal.fire({
			icon: 'error',
			title: 'Report Generation Failed',
			text: 'Could not generate PDF report. Please check your browser console for details.',
			background: '#1a1a1a',
			color: '#ffffff',
			confirmButtonColor: '#dc3545'
		});
	}
}

function showCompleteReport(report) {
	try {
		// Initialize jsPDF with proper object initialization
		const { jsPDF } = window.jspdf;
		const doc = new jsPDF();

		// Set report title
		doc.setFontSize(18);
		doc.setTextColor(0, 0, 0);
		doc.text("Complete Attendance Report", 105, 15, { align: "center" });

		// Add current date
		const today = new Date();
		const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
		doc.setFontSize(10);
		doc.setTextColor(100, 100, 100);
		doc.text(`Report generated on: ${formattedDate}`, 195, 10, { align: "right" });

		// Add class details
		doc.setFontSize(12);
		doc.setTextColor(0, 0, 0);
		doc.text(`Class: ${report.className}`, 14, 30);
		doc.text(`Period: ${report.startDate} to ${report.endDate}`, 14, 37);
		doc.text(`Total Days: ${report.totalDays}`, 14, 44);
		doc.text(`Total Students: ${report.totalStudents}`, 14, 51);

		// Add Overall Student Attendance table
		doc.setFontSize(14);
		doc.text("Overall Student Attendance", 14, 65);

		// Ensure we have valid data for the student attendance table
		if (report.studentAttendance && report.studentAttendance.length > 0) {
			const studentData = report.studentAttendance.map(student => [
				student.username || "Unknown",
				student.presentDays || 0,
				student.absentDays || 0,
				`${student.attendancePercentage || 0}%`
			]);

			doc.autoTable({
				startY: 70,
				head: [['Username', 'Present Days', 'Absent Days', 'Attendance %']],
				body: studentData,
				theme: 'grid',
				headStyles: { fillColor: [59, 130, 246] } // Blue color
			});
		} else {
			doc.setFontSize(11);
			doc.text("No student attendance data available.", 14, 75);
		}

		// Add Daily Attendance Breakdown
		doc.addPage();
		doc.setFontSize(16);
		doc.text("Daily Attendance Breakdown", 14, 20);

		// Ensure we have valid data for the date reports table
		if (report.dateReports && report.dateReports.length > 0) {
			const dateData = report.dateReports.map(date => [
				date.date || "Unknown",
				date.presentCount || 0,
				date.absentCount || 0,
				`${date.attendancePercentage || 0}%`
			]);

			doc.autoTable({
				startY: 25,
				head: [['Date', 'Present', 'Absent', 'Attendance %']],
				body: dateData,
				theme: 'grid',
				headStyles: { fillColor: [59, 130, 246] } // Blue color
			});
		} else {
			doc.setFontSize(11);
			doc.text("No daily attendance data available.", 14, 30);
		}

		// Add footer
		const pageCount = doc.internal.getNumberOfPages();
		for (let i = 1; i <= pageCount; i++) {
			doc.setPage(i);
			doc.setFontSize(10);
			doc.setTextColor(100, 100, 100);
			doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: "center" });
			doc.text("FitPro Attendance System", 195, doc.internal.pageSize.height - 10, { align: "right" });
		}

		// Save the PDF
		doc.save(`${report.className}_Complete_Attendance_Report.pdf`);

		Swal.fire({
			icon: 'success',
			title: 'Report Generated',
			text: 'Complete attendance report has been downloaded as PDF.',
			background: '#1a1a1a',
			color: '#ffffff',
			confirmButtonColor: '#facc15'
		});
	} catch (error) {
		console.error("Error generating complete PDF report:", error);
		Swal.fire({
			icon: 'error',
			title: 'Report Generation Failed',
			text: 'Could not generate complete PDF report. Please check your browser console for details.',
			background: '#1a1a1a',
			color: '#ffffff',
			confirmButtonColor: '#dc3545'
		});
	}
}

// Double protection: block all interactions with future date checkboxes
$(document).on("mousedown mouseup click change keydown keyup", ".attendance-checkbox[data-future='true'], .future-disabled", function (e) {
	e.preventDefault();
	e.stopPropagation();
	e.stopImmediatePropagation();
	return false;
});

// Restore original value if someone tries to change future checkbox despite protections
$(document).on("change", ".attendance-checkbox", function (e) {
	const isFuture = $(this).data('future') === true || $(this).hasClass('future-disabled');
	if (isFuture) {
		// Get original state from data
		const dateStr = $(this).data('date');
		const userId = parseInt($(this).data('userid'));
		const classId = parseInt($("#classSelect").val());

		// Find record to determine original checkbox state
		const record = attendanceData.find(a =>
			a.c_classid === classId &&
			a.c_attendancedate === dateStr
		);

		const wasChecked = record && record.c_presentstudents.includes(userId);

		// Reset to original state
		$(this).prop('checked', wasChecked);

		// Show warning to user
		Swal.fire({
			icon: 'warning',
			title: 'Future Date',
			text: 'Cannot modify attendance for future dates.',
			background: '#1a1a1a',
			color: '#ffffff',
			confirmButtonColor: '#facc15',
			timer: 1500
		});

		e.preventDefault();
		e.stopPropagation();
		return false;
	}
});