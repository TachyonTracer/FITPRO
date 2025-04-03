document.addEventListener("DOMContentLoaded", function () {

	var equippments = "";

	localStorage.setItem(
		"authToken",
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKV1RTZXJ2aWNlc0FjY2Vzc1Rva2VuIiwianRpIjoiMzRkNTk1M2QtOTg4Mi00ZGRkLWEwZTUtMDcwMWVmMmEyYmE0IiwiVXNlck9iamVjdCI6IntcImluc3RydWN0b3JJZFwiOjEwLFwiaW5zdHJ1Y3Rvck5hbWVcIjpcIktodXNoaVwiLFwiZW1haWxcIjpcImtodXNoaTFAZ21haWwuY29tXCIsXCJwYXNzd29yZFwiOm51bGwsXCJjb25maXJtUGFzc3dvcmRcIjpudWxsLFwibW9iaWxlXCI6XCIxMTExMTExMTExXCIsXCJnZW5kZXJcIjpcIkZlbWFsZVwiLFwiZG9iXCI6XCIyMDAzLTA4LTIxVDAwOjAwOjAwXCIsXCJzcGVjaWFsaXphdGlvblwiOlwiWW9nYSxHeW0sWnVtYmEsQm94aW5nLEN5Y2xpbmdcIixcImNlcnRpZmljYXRlc1wiOntcIllvZ2FcIjpcImtodXNoaTFAZ21haWwuY29tX1lvZ2FfNjkzYWJhOTEtM2ZkMi00YzBkLWIwMTEtNWIwM2I4YzM4ZGJlLmpwZ1wifSxcInByb2ZpbGVJbWFnZVwiOlwiMDJkZmFjMzgtNDAwZC00N2I4LTk3ZWUtNDg3MjBjZTIyMGVkLnBuZ1wiLFwiYXNzb2NpYXRpb25cIjpcIkZpdFByb1wiLFwiY3JlYXRlZEF0XCI6XCIyMDI1LTAzLTI2VDEzOjEyOjU3LjkyMjc5NFwiLFwic3RhdHVzXCI6XCJBcHByb3ZlXCIsXCJpZFByb29mXCI6XCJraHVzaGkxQGdtYWlsLmNvbV9pZHByb29mLnBuZ1wiLFwiYWN0aXZhdGlvblRva2VuXCI6XCJkNmY3MGI1MC0yMmQ0LTQzYjYtODlhMy1iNWYxYzJmMzllNWFcIixcImFjdGl2YXRlZE9uXCI6XCIyMDI1LTAzLTI1VDE2OjI0OjM4LjA1NzA2OVwiLFwiaWRQcm9vZkZpbGVcIjpudWxsLFwiY2VydGlmaWNhdGVGaWxlc1wiOm51bGwsXCJwcm9maWxlSW1hZ2VGaWxlXCI6bnVsbH0iLCJleHAiOjE3NDM1NzUyMTUsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjgwODAiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo4MDgxIn0.skvlvLeHwinaCrDNsXyHr7EDC1crFYPzGB7mFrII_hQ"
	);

	function getUserIdFromToken() {
		const token = localStorage.getItem("authToken");
		if (!token) {
			console.warn("No auth token found in localStorage.");
			return null;
		}
		const decoded = parseJwt(token);
		if (decoded) {
			console.log("this is line 144 decoded:" + JSON.parse(decoded.UserObject).instructorName);
			console.log("this is line 144 decoded:" + JSON.parse(decoded.UserObject).specialization);


			return JSON.parse(decoded.UserObject).instructorId;
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

	getUserIdFromToken();


	fetchClassTypesFromAPI();

	const addressInput = document.getElementById("address");
	const openMapBtn = document.getElementById("openMapBtn");
	const mapModal = new bootstrap.Modal(document.getElementById("mapModal"));
	let map, marker;

	//Get Instructor Specialization From Token (All Specialization = Class Type)
	function getInstructorSpecializations() {
		const token = localStorage.getItem("authToken");
		if (!token) {
			console.warn("No auth token found in localStorage.");
			return [];
		}

		const decoded = parseJwt(token);
		if (decoded && decoded.UserObject) {
			const userObject = JSON.parse(decoded.UserObject);
			if (userObject.specialization) {
				return userObject.specialization.split(',').map(spec => spec.trim());
			}
		}

		console.warn("No specializations found in token.");
		return [];
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

	//Here We Create Class Types 
	function createClassTypesFromSpecializations() {
		const specializations = getInstructorSpecializations();
		console.log("Instructor specializations:", specializations);

		if (specializations.length === 0) {
			console.warn("No specializations found.");
			return [];
		}

		return specializations.map((specialization, index) => ({
			id: index + 1,
			name: specialization
		}));
	}

	//Fetch Class Types and show on DropDown
	function fetchClassTypesFromAPI() {
		const classTypes = createClassTypesFromSpecializations();

		if (classTypes.length === 0) {
			console.warn("No class types available to populate.");
			return;
		}

		const $classTypeDropdown = $('#classType');
		$classTypeDropdown.empty();

		// Add a placeholder option
		$classTypeDropdown.append(
			$('<option>', {
				value: '',
				text: 'Select class type...',
				disabled: true,
				selected: true
			})
		);

		// Populate the dropdown with class types
		classTypes.forEach(classType => {
			$classTypeDropdown.append(
				$('<option>', {
					value: classType.name, // Use class name as the value
					text: classType.name
				})
			);
		});

		console.log('Class types populated:', classTypes);
	}


	//Eqippments(static) Based On The Class Type
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
		"CrossFit": [
			{ value: 'Kettlebells', icon: '🏋️‍♀️', description: 'For functional training' },
			{ value: 'Plyo Box', icon: '📦', description: 'For explosive jump training' },
			{ value: 'Medicine Ball', icon: '⚾', description: 'For strength and conditioning' },
			{ value: 'Battle Ropes', icon: '🪢', description: 'For endurance workouts' }
		],
		"Pilates": [
			{ value: 'Pilates Reformer', icon: '🛏️', description: 'Enhances core workouts' },
			{ value: 'Stability Ball', icon: '🎱', description: 'For balance and control' },
			{ value: 'Foam Roller', icon: '🔵', description: 'For muscle recovery' },
			{ value: 'Resistance Ring', icon: '⭕', description: 'For toning exercises' }
		],

		"Kickboxing": [
			{ value: 'Kickboxing Gloves', icon: '🥋', description: 'Protects hands during training' },
			{ value: 'Thai Pads', icon: '🛡️', description: 'For kick drills' },
			{ value: 'Heavy Bag', icon: '👜', description: 'For striking practice' },
			{ value: 'Agility Ladder', icon: '🏁', description: 'For footwork training' }
		],
		"Strength Training": [
			{ value: 'Power Rack', icon: '🏗️', description: 'For barbell exercises' },
			{ value: 'Adjustable Dumbbells', icon: '⚖️', description: 'Versatile strength training' },
			{ value: 'Bench Press', icon: '🛏️', description: 'For upper body workouts' },
			{ value: 'Weighted Vest', icon: '🎽', description: 'Adds resistance to bodyweight exercises' }
		]
	};

	console.log(equipmentByClassType);


	const equipmentDropdown = document.getElementById('equipmentDropdown');
	const equipmentMenu = document.querySelector('.equipment-dropdown .dropdown-menu');
	const selectedEquipmentContainer = document.getElementById('selectedEquipment');
	let selectedEquipment = [];

	$('.equipment-dropdown .dropdown-menu input[type="checkbox"]').on('change', function () {
		const itemValue = $(this).val();
		if ($(this).is(':checked')) {
			// Find the equipment object and add it
			const classType = $('#classType').val();
			const equipmentItem = equipmentByClassType[classType].find(item => item.value === itemValue);
			if (equipmentItem) {
				selectedEquipment.push(equipmentItem);
			}
		} else {
			selectedEquipment = selectedEquipment.filter(item => item.value !== itemValue);
		}
		updateSelectedEquipmentDisplay();
		// validateEquipment(); // Add this line to validate in real-time
	});

	function validateEquipment() {
		const $equipmentDropdown = $('.equipment-dropdown');
		const $feedbackElement = $equipmentDropdown.find('.invalid-feedback');

		// Ensure feedback element exists
		if ($feedbackElement.length === 0) {
			$equipmentDropdown.append('<div class="invalid-feedback">Please select at least one equipment item</div>');
		}

		// Check if any equipment is selected
		if (selectedEquipment.length === 0) {
			$equipmentDropdown.addClass('is-invalid');
			$equipmentDropdown.find('.invalid-feedback').text('Please select at least one equipment item').show();
			return false;
		}

		// Check if equipment matches the class type
		const classType = $('#classType').val();
		if (!classType || !equipmentByClassType[classType]) {
			$equipmentDropdown.addClass('is-invalid');
			$equipmentDropdown.find('.invalid-feedback').text('Please select a valid class type first').show();
			return false;
		}

		// Validate each selected equipment belongs to the current class type
		const validEquipment = selectedEquipment.every(item =>
			equipmentByClassType[classType].some(validItem => validItem.value === item.value)
		);

		if (!validEquipment) {
			$equipmentDropdown.addClass('is-invalid');
			$equipmentDropdown.find('.invalid-feedback').text('Some selected equipment is not valid for this class type').show();
			return false;
		}

		// **Fix: Remove the error class and hide the feedback message**
		$equipmentDropdown.removeClass('is-invalid');
		$feedbackElement.hide();  // Hide error message when valid

		return true;
	}




	//Here We Update Selected Equippment
	function updateSelectedEquipmentDisplay() {
		const $dropdownText = $('#equipmentDropdownText');
		const $selectedEquipmentContainer = $('#selectedEquipment');

		if (selectedEquipment.length === 0) {
			$dropdownText.text('Select equipment...');
			$selectedEquipmentContainer.html('<span class="text-muted">No equipment selected</span>');
			return;
		}

		$dropdownText.text(selectedEquipment.length === 1 ? selectedEquipment[0].value : `${selectedEquipment.length} items selected`);

		const $list = $('<ul>').addClass('selected-equipment-list');
		selectedEquipment.forEach(item => {
			const $listItem = $('<li>').addClass('selected-equipment-item').text(item.value);
			const $removeBtn = $('<button>').addClass('equipment-remove-btn').html('&times;');

			$removeBtn.on('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				unselectEquipment(item.value);
			});

			$listItem.prepend($removeBtn);
			$list.append($listItem);
		});

		$selectedEquipmentContainer.empty().append($list);
	}

	function unselectEquipment(value) {
		const $checkbox = $(`.equipment-dropdown .dropdown-menu input[value="${value}"]`);
		if ($checkbox.length) {
			$checkbox.prop('checked', false);
		}
		selectedEquipment = selectedEquipment.filter(item => item.value !== value);
		console.log("Selected Equipment (After Remove):", selectedEquipment);
		updateSelectedEquipmentDisplay();
	}

	function populateEquipmentDropdown(classType) {
		const $equipmentMenu = $('.equipment-dropdown .dropdown-menu');
		$equipmentMenu.empty();
		selectedEquipment = [];

		if (!classType || !equipmentByClassType[classType]) {
			updateSelectedEquipmentDisplay();
			return;
		}

		equipmentByClassType[classType].forEach(item => {
			const $listItem = $('<li>');
			const $label = $('<label>').addClass('dropdown-item d-flex align-items-center');
			const $checkbox = $('<input>').attr({ type: 'checkbox', value: item.value }).addClass('form-check-input me-2');

			$checkbox.on('change', function () {
				if ($(this).is(':checked')) {
					selectedEquipment.push(item);
				} else {
					selectedEquipment = selectedEquipment.filter(equip => equip.value !== item.value);
				}
				updateSelectedEquipmentDisplay();
			});

			$label.append($checkbox).append(`${item.icon} ${item.value}`);
			$listItem.append($label);
			$equipmentMenu.append($listItem);
		});

		updateSelectedEquipmentDisplay();
	}

	$('#classType').on('change', function () {
		populateEquipmentDropdown($(this).val());

	});

	const style = document.createElement('style');
	style.textContent = `
            .equipment-dropdown.is-invalid .dropdown-toggle {
                border-color: #dc3545;
            }
            
            .equipment-dropdown.is-invalid .invalid-feedback {
                display: block;
                color: #dc3545;
                font-size: 0.875em;
                margin-top: 0.25rem;
            }
        `;
	document.head.appendChild(style);

	//Map For Address
	document.getElementById("mapModal").addEventListener("shown.bs.modal", function () {

		if (!map) {
			map = L.map('map').setView([0, 0], 2);
			L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
				attribution: '© <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> © <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);

			map.on('click', async (e) => {
				if (marker) map.removeLayer(marker);
				marker = L.marker(e.latlng).addTo(map);
				await fetchAddress(e.latlng.lat, e.latlng.lng);
			});
		}

		//Live Location Fetch 
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					const { latitude, longitude } = pos.coords;
					map.setView([latitude, longitude], 15);
					if (marker) map.removeLayer(marker);
					marker = L.marker([latitude, longitude]).addTo(map);
					fetchAddress(latitude, longitude);
				},
				(error) => {
					console.log("Geolocation error:", error);
				}
			);
		}
	});


	//Fetch Address From The Map (Select)
	async function fetchAddress(lat, lng) {
		try {
			//here only english lang accept
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Nominatim API Response:", data); // Debugging

			if (!data || !data.address) {
				throw new Error("Invalid address data received");
			}

			// Extract the address
			const englishAddress = data.display_name || `Near ${data.address.road || data.address.city || 'Selected Location'}`;
			document.getElementById("address").value = englishAddress;

			// Extract city
			const city = data.address.city || data.address.town || data.address.village || data.address.state_district || data.address.state || "";

			if (city) {
				document.getElementById("city").value = city;
			} else {
				document.getElementById("city").value = "Unknown City";
			}

		} catch (error) {
			console.error("Error fetching address:", error);
			document.getElementById("address").value = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
			document.getElementById("city").value = "Unknown City";
		}
	}

	//City Field is only read only
	document.getElementById("city").readOnly = true;


	openMapBtn.addEventListener("click", () => mapModal.show());
	document.getElementById("confirmLocationBtn").addEventListener("click", () => mapModal.hide());

	const form = document.getElementById("classForm");
	const selectedEquipmentDiv = document.getElementById("selectedEquipment");
	const startDateInput = document.getElementById("startDate");
	const endDateInput = document.getElementById("endDate");
	const startTimeInput = document.getElementById("startTime");
	const endTimeInput = document.getElementById("endTime");
	const maxCapacityInput = document.getElementById("maxCapacity");
	const availableCapacityInput = document.getElementById("availableCapacity");



	let selectedFiles = [];
	let imageAssets = {};
	const today = new Date().toISOString().split('T')[0];
	startDateInput.min = today;

	const checkboxes = document.querySelectorAll('input[name="equipment"]');
	checkboxes.forEach(checkbox => {
		checkbox.addEventListener("change", updateSelectedEquipment);
	});



	// Drag And Drop 
	const dropZone = document.getElementById('dropZone');
	const imageInput = document.getElementById('imageInput');
	const imagePreview = document.getElementById('imagePreview');
	const dropText = document.getElementById('dropText');

	const MAX_IMAGES = 6;
	const BANNER_DIMENSIONS = { width: 1920, height: 1080 }; // Banner dimensions
	const NORMAL_MAX_SIZE = 2 * 1024 * 1024; // 2MB for normal images
	const BANNER_MAX_SIZE = 5 * 1024 * 1024; // 5MB for banner image

	let hasBannerImage = false;

	function initializeDragAndDrop() {
		if (!dropZone || !imageInput || !imagePreview || !dropText) {
			console.error('One or more required DOM elements are missing:', {
				dropZone: !!dropZone,
				imageInput: !!imageInput,
				imagePreview: !!imagePreview,
				dropText: !!dropText
			});
			return;
		}

		if (typeof selectedFiles === 'undefined') {
			selectedFiles = [];
		}

		updateDropzoneText();

		['dragover', 'dragenter'].forEach(event => {
			dropZone.addEventListener(event, (e) => {
				e.preventDefault();
				dropZone.classList.add('drag-over');
			});
		});

		['dragleave', 'drop'].forEach(event => {
			dropZone.addEventListener(event, (e) => {
				e.preventDefault();
				dropZone.classList.remove('drag-over');
			});
		});

		dropZone.addEventListener('click', () => {
			imageInput.click();
		});

		imageInput.addEventListener('change', (e) => {
			handleFileSelect(e.target.files);
		});

		dropZone.addEventListener('drop', (e) => {
			e.preventDefault();
			handleFileSelect(e.dataTransfer.files);
		});

		function handleFileSelect(files) {
			const newFiles = Array.from(files);

			// First check if we already have max images
			if (selectedFiles.length >= MAX_IMAGES) {
				Swal.fire({
					title: 'Limit Exceeded',
					text: `You can upload a maximum of ${MAX_IMAGES} images.`,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				return;
			}

			// Group files by banner and normal images
			processFilesInBatch(newFiles);

			// Check if any files are selected and update validation state
			// if (selectedFiles.length === 0) {
			// 	dropZone.classList.add('is-invalid');
			// 	errorContainer.textContent = 'Please upload class images';
			// 	errorContainer.style.display = 'block';
			// } else {
			// 	// Remove error state as soon as files are added
			// 	dropZone.classList.remove('is-invalid');
			// 	errorContainer.style.display = 'none';
			// }
			validateImages();
		}

		async function processFilesInBatch(files) {
			// Prepare arrays to categorize the files
			const bannerSizedFiles = [];
			const normalSizedFiles = [];

			// First pass: categorize files by size
			for (const file of files) {
				try {
					const dimensions = await getImageDimensions(file);
					const isBannerSize = dimensions.width === BANNER_DIMENSIONS.width &&
						dimensions.height === BANNER_DIMENSIONS.height;

					if (isBannerSize) {
						bannerSizedFiles.push(file);
					} else {
						normalSizedFiles.push(file);
					}
				} catch (error) {
					console.error("Error checking image dimensions:", error);
				}
			}


			// Process banner image first if needed
			if (!hasBannerImage && bannerSizedFiles.length > 0) {
				const bannerFile = bannerSizedFiles[0];

				if (bannerFile.size <= BANNER_MAX_SIZE) {
					bannerFile.isBanner = true;
					hasBannerImage = true;
					selectedFiles.push(bannerFile);

					// Display single message for extra banner images
					if (bannerSizedFiles.length > 1) {
						Swal.fire({
							title: 'Invalid Images',
							text: `Only using the first banner image. ${bannerSizedFiles.length - 1} additional banner images were not added.`,
							icon: 'error',
							confirmButtonText: 'OK'
						});
					}
				} else {
					Swal.fire({
						title: 'Invalid Images',
						text: `The banner image must have dimensions of ${BANNER_DIMENSIONS.width}x${BANNER_DIMENSIONS.height}.`,
						icon: 'error',
						confirmButtonText: 'OK'
					});
				}
			} else if (hasBannerImage && bannerSizedFiles.length > 0) {
				Swal.fire({
					title: 'Invalid Images',
					text: 'You already have a banner image. Additional banner images were not added.',
					icon: 'error',
					confirmButtonText: 'OK'
				});
			}

			// Process normal images second
			const normalImagesNeeded = 5 - selectedFiles.filter(f => !f.isBanner).length;

			if (normalImagesNeeded > 0 && normalSizedFiles.length > 0) {
				// Only take as many as we need
				const normalFilesToAdd = normalSizedFiles.slice(0, normalImagesNeeded);

				// Check size limits for each
				const validNormalFiles = normalFilesToAdd.filter(file => {
					if (file.size <= NORMAL_MAX_SIZE) {
						return true;
					}
					return false;
				});

				for (const file of validNormalFiles) {
					file.isBanner = false;
					selectedFiles.push(file);
				}

				// Show message if we rejected some for size
				const rejectedForSize = normalFilesToAdd.length - validNormalFiles.length;
				if (rejectedForSize > 0) {
					Swal.fire({
						title: 'Invalid Images',
						text: `${rejectedForSize} normal image(s) exceeded the maximum size of ${NORMAL_MAX_SIZE / 1024 / 1024}MB`,
						icon: 'error',
						confirmButtonText: 'OK'
					});
				}

				// Show message if we didn't use all normal files
				if (normalSizedFiles.length > normalImagesNeeded) {
					Swal.fire({
						title: 'Invalid Images',
						text: `Only using ${normalImagesNeeded} normal images. ${normalSizedFiles.length - normalImagesNeeded} additional normal images were not added.`,
						icon: 'error',
						confirmButtonText: 'OK'
					});
				}
			} else if (normalImagesNeeded === 0 && normalSizedFiles.length > 0) {
				// If we already have max normal images
				Swal.fire({
					title: 'Invalid Images',
					text: 'You already have the maximum number of normal images. Additional normal images were not added.',
					icon: 'error',
					confirmButtonText: 'OK'
				});
			}

			// Update UI after all processing
			renderPreview();
			updateFileInput();
			updateDropzoneText();
		}

		function getImageDimensions(file) {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = function () {
					resolve({ width: img.width, height: img.height });
					// Clean up object URL
					URL.revokeObjectURL(img.src);
				};
				img.onerror = function () {
					reject(new Error("Failed to load image"));
					URL.revokeObjectURL(img.src);
				};
				img.src = URL.createObjectURL(file);
			});
		}

		function renderPreview() {
			imagePreview.innerHTML = '';

			selectedFiles.forEach((file, index) => {
				const previewContainer = document.createElement('div');
				previewContainer.classList.add('image-preview-container');

				// Add special class for banner
				if (file.isBanner) {
					previewContainer.classList.add('banner-image-container');
				}

				const img = document.createElement('img');
				img.classList.add('image-preview-item');
				img.src = URL.createObjectURL(file);

				const removeBtn = document.createElement('button');
				removeBtn.innerHTML = '×';
				removeBtn.classList.add('remove-btn');
				removeBtn.addEventListener('click', () => {
					// Update hasBannerImage flag if removing banner
					if (file.isBanner) {
						hasBannerImage = false;
					}

					// Remove the file
					selectedFiles = selectedFiles.filter(f => f !== file);
					previewContainer.remove();
					updateFileInput();
					updateDropzoneText();
					// validateImages();

				});

				const label = document.createElement('span');
				label.classList.add('image-label');
				label.textContent = file.isBanner ? 'Banner' : `Image ${index + 1}`;

				previewContainer.appendChild(img);
				previewContainer.appendChild(label);
				previewContainer.appendChild(removeBtn);
				imagePreview.appendChild(previewContainer);
			});

		}

		function updateFileInput() {
			const dataTransfer = new DataTransfer();
			selectedFiles.forEach(file => dataTransfer.items.add(file));
			imageInput.files = dataTransfer.files;
		}

		function updateDropzoneText() {
			const normalImagesCount = selectedFiles.filter(f => !f.isBanner).length;

			if (selectedFiles.length >= MAX_IMAGES) {
				// Hide dropzone if we have max images
				dropZone.style.display = 'none';
				return;
			} else {
				dropZone.style.display = 'block';
			}

			if (!hasBannerImage && normalImagesCount < 5) {
				dropText.textContent = `Drag and drop images or click to select (${selectedFiles.length}/${MAX_IMAGES})
                                    Need: 1 banner image (${BANNER_DIMENSIONS.width}x${BANNER_DIMENSIONS.height}) 
                                    and ${5 - normalImagesCount} normal images`;
			} else if (!hasBannerImage) {
				dropText.textContent = `Drag and drop a banner image or click to select (${selectedFiles.length}/${MAX_IMAGES})
                                    Need: 1 banner image (${BANNER_DIMENSIONS.width}x${BANNER_DIMENSIONS.height})`;
			} else if (normalImagesCount < 5) {
				dropText.textContent = `Drag and drop normal images or click to select (${selectedFiles.length}/${MAX_IMAGES})
                                    Need: ${5 - normalImagesCount} more normal images`;
			}
		}
	}

	// Add some CSS for better visualization
	function addCustomStyles() {
		const style = document.createElement('style');
		style.textContent = `
                    .image-preview-container {
                        position: relative;
                        display: inline-block;
                        margin: 10px;
                        border: 2px solid #ddd;
                        border-radius: 4px;
                        overflow: hidden;
                    }
                    .banner-image-container {
                        border-color: #007bff;
                        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
                    }
                    .image-preview-item {
                        width: 250px;
                        height: 250px;
                        object-fit: cover;
                    }
                    .image-label {
                        position: absolute;
                        bottom: 5px;
                        left: 5px;
                        background-color: rgba(0, 0, 0, 0.7);
                        color: white;
                        padding: 2px 8px;
                        border-radius: 3px;
                        font-size: 12px;
                    }
                    .remove-btn {
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        background-color: rgba(255, 0, 0, 0.7);
                        color: white;
                        border: none;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 16px;
                    }
                    .drag-over {
                        background-color: rgba(0, 123, 255, 0.1);
                        border: 2px dashed #007bff;
                    }
                `;
		document.head.appendChild(style);
	}

	addCustomStyles();
	initializeDragAndDrop();


	const $startDate = $('#startDate');
	const $endDate = $('#endDate');
	const $startTime = $('#startTime');
	const $endTime = $('#endTime');

	function validateDateRange() {
		const startDateValue = $startDate.val();
		const endDateValue = $endDate.val();

		$startDate.removeClass('is-invalid is-valid');
		$endDate.removeClass('is-invalid is-valid');
		$startDate.next('.invalid-feedback').text('');
		$endDate.next('.invalid-feedback').text('');

		if (!startDateValue && !endDateValue) {
			$startDate.addClass('is-invalid').next('.invalid-feedback').text('Start date is required');
			$endDate.addClass('is-invalid').next('.invalid-feedback').text('End date is required');
			return false;
		}

		if (!startDateValue) {
			$startDate.addClass('is-invalid').next('.invalid-feedback').text('Start date is required');
			return false;
		} else {
			$startDate.addClass('is-valid');
		}

		if (!endDateValue) {
			$endDate.addClass('is-invalid').next('.invalid-feedback').text('End date is required');
			return false;
		} else {
			$endDate.addClass('is-valid');
		}

		const startDate = new Date(startDateValue);
		const endDate = new Date(endDateValue);

		// Ensure end date is after start date
		if (endDate <= startDate) {
			$endDate.addClass('is-invalid').next('.invalid-feedback').text('End date must be after start date');
			return false;
		}

		// Ensure date range is between 2 and 90 days
		const daysDifference = (endDate - startDate) / (1000 * 60 * 60 * 24);
		if (daysDifference > 90) {
			$endDate.addClass('is-invalid').next('.invalid-feedback').text('Maximum date range is 90 days');
			return false;
		} else if (daysDifference < 2) {
			$endDate.addClass('is-invalid').next('.invalid-feedback').text('Minimum date range is 2 days');
			return false;
		}

		$startDate.addClass('is-valid');
		$endDate.addClass('is-valid');
		return true;
	}

	function validateTimeRange() {
		const startTime = $startTime.val();
		const endTime = $endTime.val();

		$startTime.removeClass('is-invalid');
		$endTime.removeClass('is-invalid');
		$startTime.next('.invalid-feedback').text('');
		$endTime.next('.invalid-feedback').text('');

		if (!startTime && !endTime) {
			$startTime.addClass('is-invalid').next('.invalid-feedback').text('Start time is required');
			$endTime.addClass('is-invalid').next('.invalid-feedback').text('End time is required');
			return false;
		}

		if (!startTime) {
			$startTime.addClass('is-invalid').next('.invalid-feedback').text('Start time is required');
			return false;
		}

		if (!endTime) {
			$endTime.addClass('is-invalid').next('.invalid-feedback').text('End time is required');
			return false;
		}

		// Convert times to total minutes
		const [startHours, startMinutes] = startTime.split(':').map(Number);
		const [endHours, endMinutes] = endTime.split(':').map(Number);

		const startTotalMinutes = startHours * 60 + startMinutes;
		const endTotalMinutes = endHours * 60 + endMinutes;

		// Ensure end time is after start time
		if (endTotalMinutes <= startTotalMinutes) {
			$endTime.addClass('is-invalid').next('.invalid-feedback').text('End time must be after start time');
			return false;
		}

		// Ensure time difference is between 1 and 8 hours
		const timeDiffMinutes = endTotalMinutes - startTotalMinutes;
		if (timeDiffMinutes < 60) {
			$endTime.addClass('is-invalid').next('.invalid-feedback').text('Minimum duration is 1 hour');
			return false;
		} else if (timeDiffMinutes > 480) {
			$endTime.addClass('is-invalid').next('.invalid-feedback').text('Maximum duration is 8 hours');
			return false;
		}

		return true;
	}

	// Attach event listeners
	$startDate.on('change', validateDateRange);
	$endDate.on('change', validateDateRange);
	$startTime.on('change', validateTimeRange);
	$endTime.on('change', validateTimeRange);

	// function validateDescriptions() {
	// 	const description1 = document.getElementById("classDescription");
	// 	const description2 = document.getElementById("classBenefits");
	// 	let isValid = true;

	// 	$(description1).removeClass('is-invalid');
	// 	$(description2).removeClass('is-invalid');

	// 	description1.nextElementSibling.textContent = "";
	// 	description2.nextElementSibling.textContent = "";

	// 	if (!description1.value.trim()) {
	// 		description1.classList.add("is-invalid");
	// 		description1.nextElementSibling.textContent = "Description is required.";
	// 		isValid = false;
	// 	} else if (description1.value.trim().length < 50) {
	// 		description1.classList.add("is-invalid");
	// 		description1.nextElementSibling.textContent = "Description must be at least 50 characters.";
	// 		isValid = false;
	// 	} else if (description1.value.trim().length > 150) {
	// 		description1.classList.add("is-invalid");
	// 		description1.nextElementSibling.textContent = "Description cannot exceed 150 characters.";
	// 		isValid = false;
	// 	}

	// 	if (!description2.value.trim()) {
	// 		description2.classList.add("is-invalid");
	// 		description2.nextElementSibling.textContent = "Benefits description is required.";
	// 		isValid = false;
	// 	} else if (description2.value.trim().length < 150 || description2.value.trim().length > 300) {
	// 		description2.classList.add("is-invalid");
	// 		description2.nextElementSibling.textContent = "Benefits description must be between 150 and 300 characters.";
	// 		isValid = false;
	// 	}

	// 	return isValid;
	// }
	// document.getElementById("classDescription").addEventListener("input", validateDescriptions);
	// document.getElementById("classBenefits").addEventListener("input", validateDescriptions);

	function validateDescriptions() {
		const description1 = document.getElementById("classDescription");
		const description2 = document.getElementById("classBenefits");
		let isValid = true;

		// Remove previous validation states
		$(description1).removeClass('is-invalid is-valid');
		$(description2).removeClass('is-invalid is-valid');

		// Clear previous error messages
		description1.nextElementSibling.textContent = "";
		description2.nextElementSibling.textContent = "";

		// Validate first description
		if (!description1.value.trim()) {
			description1.classList.add("is-invalid");
			description1.nextElementSibling.textContent = "Description is required.";
			isValid = false;
		} else if (description1.value.trim().length < 50 || description1.value.trim().length > 200) {
			description1.classList.add("is-invalid");
			description1.nextElementSibling.textContent =
				`Description must be between 50 and 200 characters (currently: ${description1.value.trim().length}).`;
			isValid = false;
		} else {
			description1.classList.add("is-valid");
		}

		// Validate second description
		if (!description2.value.trim()) {
			description2.classList.add("is-invalid");
			description2.nextElementSibling.textContent = "Benefits description is required.";
			isValid = false;
		} else if (description2.value.trim().length < 50 || description2.value.trim().length > 200) {
			description2.classList.add("is-invalid");
			description2.nextElementSibling.textContent =
				`Benefits description must be between 50 and 200 characters (currently: ${description2.value.trim().length}).`;
			isValid = false;
		} else {
			description2.classList.add("is-valid");
		}

		return isValid;
	}

	// Add input event listeners for real-time validation
	document.getElementById("classDescription").addEventListener("input", function () {
		const maxLength = 200;
		if (this.value.length > maxLength) {
			this.value = this.value.slice(0, maxLength);
		}

		// Only show validation if form was previously validated or field is not empty
		if (form.classList.contains('was-validated') || this.value.trim().length > 0) {
			if (!this.value.trim()) {
				this.classList.add("is-invalid");
				this.nextElementSibling.textContent = "Description is required.";
			} else if (this.value.trim().length < 50) {
				this.classList.add("is-invalid");
				this.nextElementSibling.textContent =
					`Description must be at least 50 characters.`;
			} else if (this.value.trim().length > 200) {
				this.classList.add("is-invalid");
				this.nextElementSibling.textContent = "Description cannot exceed 200 characters.";
			} else {
				this.classList.remove("is-invalid");
				this.classList.add("is-valid");
				this.nextElementSibling.textContent = "";
			}
		}

		updateCharacterCounter(this);
	});

	document.getElementById("classBenefits").addEventListener("input", function () {
		const maxLength = 200;
		if (this.value.length > maxLength) {
			this.value = this.value.slice(0, maxLength);
		}

		// Only show validation if form was previously validated or field is not empty
		if (form.classList.contains('was-validated') || this.value.trim().length > 0) {
			if (!this.value.trim()) {
				this.classList.add("is-invalid");
				this.nextElementSibling.textContent = "Benefits description is required.";
			} else if (this.value.trim().length < 50) {
				this.classList.add("is-invalid");
				this.nextElementSibling.textContent =
					`Benefits description must be at least 50 characters.`;
			} else if (this.value.trim().length > 200) {
				this.classList.add("is-invalid");
				this.nextElementSibling.textContent = "Benefits description cannot exceed 200 characters.";
			} else {
				this.classList.remove("is-invalid");
				this.classList.add("is-valid");
				this.nextElementSibling.textContent = "";
			}
		}

		updateCharacterCounter(this);
	});
	// Add blur event listeners for length validation
	document.getElementById("classDescription").addEventListener("blur", function () {
		const value = this.value.trim();
		if (value && (value.length < 50 || value.length > 200)) {
			this.classList.add("is-invalid");
			this.nextElementSibling.textContent =
				`Description must be between 50 and 200 characters.`;
		} else if (value) {
			this.classList.remove("is-invalid");
			this.classList.add("is-valid");
		}
	});

	document.getElementById("classBenefits").addEventListener("blur", function () {
		const value = this.value.trim();
		if (value && (value.length < 50 || value.length > 200)) {
			this.classList.add("is-invalid");
			this.nextElementSibling.textContent =
				`Benefits description must be between 50 and 200 characters.`;
		} else if (value) {
			this.classList.remove("is-invalid");
			this.classList.add("is-valid");
		}
	});

	function updateCharacterCounter(element) {
		const maxLength = 200;
		let counter = element.parentElement.querySelector('.char-counter');
		if (!counter) {
			counter = document.createElement('small');
			counter.className = 'char-counter';
			counter.style.cssText = `
            color: #fff;
            display: block;
            margin-top: 5px;
            font-size: 0.875rem;
            opacity: 0.8;
        `;
			element.parentElement.appendChild(counter);
		}
		counter.textContent = `${element.value.length}/${maxLength} characters`;
	}

	function validateImages() {
		const dropZone = document.getElementById('dropZone');
		let errorContainer = dropZone.parentNode.querySelector('.invalid-feedback');

		if (!errorContainer) {
			errorContainer = document.createElement('div');
			errorContainer.className = 'invalid-feedback';
			dropZone.parentNode.appendChild(errorContainer);
		}

		// Check for form validation state or if files are selected
		if (form.classList.contains('was-validated') || selectedFiles.length > 0) {
			if (selectedFiles.length === 0 || selectedFiles.length !== 6) {
				dropZone.classList.add('is-invalid');
				dropZone.classList.remove('is-valid');
				errorContainer.textContent = 'Please upload class images';
				errorContainer.style.display = 'block';
				return false;
			} else if (selectedFiles.length !== 6) {
				dropZone.classList.add('is-invalid');
				dropZone.classList.remove('is-valid');
				errorContainer.textContent = `Please upload exactly 6 images (1 banner + 5 normal)`;
				errorContainer.style.display = 'block';
				return false;
			}

			const hasBanner = selectedFiles.some(file => file.isBanner);
			if (!hasBanner) {
				dropZone.classList.add('is-invalid');
				dropZone.classList.remove('is-valid');
				errorContainer.textContent = 'Please upload 1 banner image (1920x1080)';
				errorContainer.style.display = 'block';
				return false;
			}

			// If all validations pass
			dropZone.classList.remove('is-invalid');
			dropZone.classList.add('is-valid');
			errorContainer.style.display = 'none';
			return true;
		}

		// Reset validation state if no validation triggered
		dropZone.classList.remove('is-invalid', 'is-valid');
		errorContainer.style.display = 'none';
		return true;
	}

	// Add this to your existing JavaScript
	function validateAddress() {
		const addressInput = document.getElementById('address');
		const addressContainer = addressInput.closest('.input-group');
		const errorFeedback = addressContainer.querySelector('.invalid-feedback');

		if (!addressInput.value.trim()) {
			addressInput.classList.add('is-invalid');
			errorFeedback.style.display = 'block';
			return false;
		}

		addressInput.classList.remove('is-invalid');
		errorFeedback.style.display = 'none';
		return true;
	}


	selectedEquipment = selectedEquipment.map(equip => equip.value).join(", ");

	document.querySelectorAll('input[name="equipment"]').forEach(checkbox => {
		checkbox.addEventListener("change", validateEquipment);
	});

	function validateClassName() {
		const classNameInput = document.getElementById('className');
		const value = classNameInput.value.trim();

		classNameInput.classList.remove('is-invalid');
		classNameInput.classList.add('is-valid');
		classNameInput.nextElementSibling.textContent = '';


		if (!value) {
			classNameInput.classList.add('is-invalid');
			classNameInput.nextElementSibling.textContent = 'Class name is required';
			return false;
		} else if (value.length < 2 || value.length > 100) {
			classNameInput.classList.add('is-invalid');
			classNameInput.nextElementSibling.textContent = 'Class name must be between 2 and 100 characters';
			return false;
		} else {
			classNameInput.classList.remove('is-invalid');
			classNameInput.classList.add('is-valid');
			return true;
		}
	}

	function validateClassType() {
		const classTypeSelect = document.getElementById('classType');
		if (!classTypeSelect.value) {
			classTypeSelect.classList.add('is-invalid');
			classTypeSelect.nextElementSibling.textContent = 'Please select a class type';
			return false;
		} else {
			classTypeSelect.classList.remove('is-invalid');
			classTypeSelect.classList.add('is-valid');
			return true;
		}
	}

	function validateFee() {
		const feeInput = document.getElementById('fee');
		const fee = parseFloat(feeInput.value);

		if (!feeInput.value) {
			feeInput.classList.add('is-invalid');
			feeInput.nextElementSibling.textContent = 'Fee is required';
			return false;
		} else if (isNaN(fee) || fee < 0 || fee > 100000) {
			feeInput.classList.add('is-invalid');
			feeInput.nextElementSibling.textContent = 'Fee must be between $0 and $100,000';
			return false;
		} else {
			feeInput.classList.remove('is-invalid');
			feeInput.classList.add('is-valid');
			return true;
		}
	}

	function validateCapacity() {
		const capacityInput = document.getElementById('maxCapacity');
		const capacity = parseInt(capacityInput.value);

		if (!capacityInput.value) {
			capacityInput.classList.add('is-invalid');
			capacityInput.nextElementSibling.textContent = 'Capacity is required';
			return false;
		} else if (isNaN(capacity) || capacity < 1 || capacity > 1000) {
			capacityInput.classList.add('is-invalid');
			capacityInput.nextElementSibling.textContent = 'Capacity must be between 1 and 1000';
			return false;
		} else {
			capacityInput.classList.remove('is-invalid');
			capacityInput.classList.add('is-valid');
			return true;
		}
	}

	document.getElementById('className').addEventListener('input', function () {
		// if (form.classList.contains('was-validated')) {
		validateClassName();
		// }
	});

	document.getElementById('classType').addEventListener('change', function () {
		// if (form.classList.contains('was-validated')) {
		validateClassType();
		// }
	});

	document.getElementById('fee').addEventListener('input', function () {
		// if (form.classList.contains('was-validated')) {
		validateFee();
		// }
	});

	document.getElementById('maxCapacity').addEventListener('input', function () {
		// if (form.classList.contains('was-validated')) {
		validateCapacity();
		// }
	});

	document.getElementById('address').addEventListener('input', function () {
		// if (form.classList.contains('was-validated')) {
		validateAddress();
		// }
	});

	document.getElementById("confirmLocationBtn").addEventListener("click", function () {
		validateAddress(); // Validate address when location is confirmed
		mapModal.hide();
	});

	document.getElementById('imageInput').addEventListener('change', validateImages);
	dropZone.addEventListener('drop', function (e) {
		setTimeout(validateImages, 100); // Short delay to allow files to process
	});

	document.getElementById('imageInput').addEventListener('change', function (e) {
		handleFileSelect(e.target.files);
	});

	dropZone.addEventListener('drop', function (e) {
		e.preventDefault();
		handleFileSelect(e.dataTransfer.files);
	});






	form.addEventListener("submit", function (e) {

		e.preventDefault();

		const descriptionText = document.getElementById("classDescription").value;
		const descriptionbenefits = document.getElementById("classBenefits").value;

		validateImages();
		const description = {
			purpose: descriptionText,
			benefits: descriptionbenefits
		};

		const descriptionJson = JSON.stringify(descriptionText);

		selectedFiles.sort((a, b) => {
			// Banner image should come first
			if (a.isBanner) return -1;
			if (b.isBanner) return 1;
			return 0;
		});

		if (!form.checkValidity()) {
			e.stopPropagation();
			form.classList.add('was-validated');
			const isClassNameValid = validateClassName();
			const isClassTypeValid = validateClassType();
			const isFeeValid = validateFee();
			const isCapacityValid = validateCapacity();
			const isTimeValid = validateTimeRange();
			const isDateValid = validateDateRange();
			const isDescriptionValid = validateDescriptions();
			const isImageValid = validateImages();
			const isAddressValid = validateAddress();
			//const isEquipmentValid = validateEquipment();
			//const isDescriptionValid = validateDescriptions();


			if (!isTimeValid || !isDateValid || !isDescriptionValid || !isImageValid || !isAddresValid) {
				return;
			}
			return;
		}



		const equipmentValues = selectedEquipment.map(item => item.value).join(', ');

		let duration = null;
		if (startTimeInput.value && endTimeInput.value) {
			const start = new Date(`2000-01-01T${startTimeInput.value}`);
			const end = new Date(`2000-01-01T${endTimeInput.value}`);
			duration = Math.round((end - start) / (1000 * 60));
		}

		const assets = {
			images: Array.from(imageInput.files).map(file => ({
				fileName: file.name,
				path: imageAssets[file.name]
			}))
		};

		console.log(assets);

		const formData = new FormData();

		formData.append("classId", "0");
		formData.append("className", document.getElementById("className").value);
		formData.append("instructorId", document.getElementById("instructorId").value);
		formData.append("description", JSON.stringify(description));
		formData.append("type", document.getElementById("classType").value);
		formData.append("startDate", document.getElementById("startDate").value);
		formData.append("endDate", document.getElementById("endDate").value || "");
		formData.append("startTime", startTimeInput.value || "");
		formData.append("endTime", endTimeInput.value || "");
		formData.append("duration", duration ? duration.toString() : "");
		formData.append("maxCapacity", document.getElementById("maxCapacity").value);
		formData.append("requiredEquipments", equipmentValues || "");
		formData.append("createdAt", new Date().toISOString());
		formData.append("status", document.getElementById("status").value);
		formData.append("city", document.getElementById("city").value);
		formData.append("address", document.getElementById("address").value);
		formData.append("assets", JSON.stringify(assets));
		formData.append("fee", document.getElementById("fee").value);

		// Append selected files to formData
		// for (let i = 0; i < selectedFiles.length; i++) {
		// 	formData.append(`assetFiles`, selectedFiles[i], selectedFiles[i].name);
		// } 

		selectedFiles.forEach((file, index) => {
			formData.append('assetFiles', file);
			console.log(`Appending file ${index}: ${file.name} (${file.isBanner ? 'Banner' : 'Normal'})`);
		});

		console.log("Form Data Entries:");
		for (let pair of formData.entries()) {
			console.log(pair[0] + ':', pair[1]);
		}

		console.log("Files order:");
		for (let [key, value] of formData.entries()) {
			if (key === 'assetFiles') {
				console.log(value.name, value.isBanner ? '(Banner)' : '(Normal)');
			}
		}

		$.ajax({
			url: 'http://localhost:8080/api/Class/Scheduleclass',
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.success) {
					console.log('Success:', response.message);
					Swal.fire({
						title: 'Success!',
						text: 'Class scheduled successfully!',
						icon: 'success',
						confirmButtonText: 'OK'
					});
				} else {
					Swal.fire({
						title: 'Error!',
						text: 'Error Add Class: ' + response.message,
						icon: 'error',
						confirmButtonText: 'OK'
					});
				}
			},
			error: function (xhr, status, error) {
				let errorMessage = 'An error occurred';
				try {
					const response = JSON.parse(xhr.responseText);
					errorMessage = response.message || errorMessage;
				} catch (e) {
					console.error('Error parsing response:', e);
				}
				console.error('AJAX Error:', status, error);
				Swal.fire({
					title: "Error!",
					text: "Error Add Class: " + errorMessage,
					icon: "error",
					confirmButtonText: "OK",
				});
			}
		});

	});



	form.addEventListener("input", function () {
		if (form.classList.contains('was-validated')) {
			form.classList.remove('was-validated');
		}
	});
});