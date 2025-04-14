function showTab(tab) {
    const detailsTab = document.getElementById('details-tab');
    const equipmentTab = document.getElementById('equipment-tab');
    const mapTab = document.getElementById('map-tab');
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(t => t.classList.remove('active'));

    // Hide all tabs initially
    detailsTab.style.display = 'none';
    equipmentTab.style.display = 'none';
    mapTab.style.display = 'none';

    // Show selected tab
    if (tab === 'details') {
        detailsTab.style.display = 'flex';
        tabs[0].classList.add('active');
    } else if (tab === 'equipment') {
        equipmentTab.style.display = 'flex';
        tabs[1].classList.add('active');
    } else if (tab === 'map') {
        mapTab.style.display = 'block';
        tabs[2].classList.add('active');
    }
}


const images = document.querySelectorAll(".class-gallery img");
let index = 0;

setInterval(() => {
    images[index].classList.remove("active");
    index = (index + 1) % images.length;
    images[index].classList.add("active");
}, 3000); // Change image every 3 seconds

const availableCapacity = 0; // Change this dynamically
let waitlistCount = 20; // Start with any number, fetch from backend later if needed

// Add this function to change waitlist badge color
function updateWaitlistColor(count) {
    const waitlistBadge = document.querySelector('.waitlist-badge');

    if (count <= 10) {
        waitlistBadge.style.backgroundColor = '#22c55e'; // green
        waitlistBadge.style.color = '#ffffff';
    } else if (count <= 20) {
        waitlistBadge.style.backgroundColor = '#facc15'; // yellow
        waitlistBadge.style.color = '#0f0f0f';
    } else {
        waitlistBadge.style.backgroundColor = '#ef4444'; // red
        waitlistBadge.style.color = '#ffffff';
    }
}

// Update the window.onload function
window.onload = () => {
    if (availableCapacity > 0) {
        document.getElementById('book-section').style.display = 'block';
        document.getElementById('waitlist-section').style.display = 'none';
    } else {
        document.getElementById('book-section').style.display = 'none';
        document.getElementById('waitlist-section').style.display = 'block';
        document.getElementById('waitlist-count').textContent = waitlistCount;
        updateWaitlistColor(waitlistCount);
    }
};

// Update the joinWaitlist function
function joinWaitlist() {
    waitlistCount++;
    document.getElementById('waitlist-count').textContent = waitlistCount;
    updateWaitlistColor(waitlistCount);
    alert("🕓 You've been added to the waiting list!");
}

async function bookThisClass() {
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('id');

   

    if (!classId) {
        Swal.fire({
            title: 'Error',
            text: 'No class ID provided',
            icon: 'error'
        });
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/Class/BookClass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                classId: parseInt(classId),
                userId: userId
            })
        });

        const result = await response.json();

        if (result.success) {
            // Show success confetti
            confetti({
                particleCount: 100,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#facc15', '#ffffff']
            });

            confetti({
                particleCount: 100,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#facc15', '#ffffff']
            });

            Swal.fire({
                title: 'Success!',
                text: 'Class booked successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire({
                title: 'Booking Failed',
                text: result.message || 'Failed to book class',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to book class. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

function getUserIdFromToken() {
    // Hardcoded user ID for testing without login
    return 1; // You can change this to any valid user ID in your database
}

// Add this function before your DOMContentLoaded event handler
async function getCoordinatesFromAddress(address) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();

        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

// Add this function to handle map initialization
function initializeMap(lat, lng, classInfo) {
    const map = L.map('mapContainer').setView([lat, lng], 15);

    L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create a custom red icon
    const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Add marker with red icon
    const marker = L.marker([lat, lng], { icon: redIcon }).addTo(map);

    marker.bindPopup(`
        <strong>${classInfo.className}</strong><br>
        ${classInfo.address || 'Location not specified'}<br>
        <small>${classInfo.startTime} - ${classInfo.endTime}</small>
    `).openPopup();

    // Fix map display issue when tab is shown
    document.querySelector('.tab[onclick="showTab(\'map\')"]').addEventListener('click', () => {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    });
}

async function fetchWaitlistCount(classId) {
    try {
        const response = await fetch(`http://localhost:8080/api/Class/ClasswiseWaitlistCount/${classId}`);
        const data = await response.json();

        if (data.success) {
            document.getElementById("waitlist-count").textContent = data.count;
        } else {
            document.getElementById("waitlist-count").textContent = "N/A";
            console.error("Failed to fetch count:", data.message);
        }
    } 
    catch (error) 
    {
        console.error("Error fetching waitlist count:", error);
        document.getElementById("waitlist-count").textContent = "Error";
    }
}

// Update the DOMContentLoaded event handler
document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('id');
    console.log(classId);

    if (!classId) {
        Swal.fire({
            title: 'Error',
            text: 'No class ID provided',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    try {
        // Fetch class details
        const classResponse = await fetch(`http://localhost:8080/api/Class/GetOneClass?id=${classId}`);
        const classData = await classResponse.json();

        if (!classData.sucess) {
            throw new Error(classData.message || 'Failed to fetch class data');
        }

        const classInfo = classData.data;

        // Update class details tab with dynamic data
        document.querySelector('.class-details h1').textContent = classInfo.className;

        // Update class details in the first table
        const detailsTab = document.querySelector('#details-tab');
        const detailsRows = detailsTab.querySelectorAll('.detail-row:not(.header)');

        // Update location, capacity and availability
        detailsRows[0].children[0].textContent = classInfo.address;
        detailsRows[0].children[1].textContent = `${classInfo.maxCapacity} Participants`;
        detailsRows[0].children[2].textContent = `${classInfo.availableCapacity} Spots Left`;

        // Update purpose, benefits and fee
        if (classInfo.description && typeof classInfo.description === 'object') {
            detailsRows[1].children[0].textContent = classInfo.description.purpose || 'No purpose specified';
            detailsRows[1].children[1].textContent = classInfo.description.benefits || 'No benefits specified';
        }
        detailsRows[1].children[2].textContent = `₹${classInfo.fee}`;

        // Update schedule
        const scheduleElements = document.querySelectorAll('.class-details p');
        scheduleElements.forEach(element => {
            if (element.textContent.includes('Dates:')) {
                element.innerHTML = `<strong>Dates:</strong> ${new Date(classInfo.startDate).toLocaleDateString()} - ${new Date(classInfo.endDate).toLocaleDateString()}`;
            } else if (element.textContent.includes('Time:')) {
                element.innerHTML = `<strong>Time:</strong> ${classInfo.startTime} - ${classInfo.endTime}`;
            } else if (element.textContent.includes('Duration:')) {
                element.innerHTML = `<strong>Duration:</strong> ${classInfo.duration} minutes`;
            }
        });

        // Update booking section based on availability
        const bookSection = document.getElementById('book-section');
        const waitlistSection = document.getElementById('waitlist-section');

        if (classInfo.availableCapacity > 0) {
            bookSection.style.display = 'block';
            waitlistSection.style.display = 'none';
        } else {
            bookSection.style.display = 'none';
            waitlistSection.style.display = 'block';
            document.getElementById('waitlist-count').textContent = classInfo.waitlistCount || 0;
            updateWaitlistColor(classInfo.waitlistCount || 0);
        }

        // Update gallery images if available
        if (classInfo.assets) {
            const gallery = document.querySelector('.class-gallery');
            gallery.innerHTML = ''; // Clear existing images

            Object.entries(classInfo.assets)
                .filter(([key]) => key.startsWith('picture') || key === 'banner')
                .forEach(([_, value], index) => {
                    const img = document.createElement('img');
                    img.src = `/ClassAssets/${value}`;
                    img.alt = `Class Image ${index + 1}`;
                    img.className = index === 0 ? 'active' : '';
                    img.onerror = () => img.src = '/img/fitness.jpg';
                    gallery.appendChild(img);
                });
        }

        // Add this inside the try block of your DOMContentLoaded event handler
        // Update equipment tab with dynamic data
        if (classInfo.requiredEquipments) {
            const equipmentBoxes = document.querySelector('.equipment-boxes');
            equipmentBoxes.innerHTML = ''; // Clear existing equipment items

            // Split the equipment string into an array if it's a comma-separated string
            const equipmentList = typeof classInfo.requiredEquipments === 'string'
                ? classInfo.requiredEquipments.split(',').map(item => item.trim())
                : classInfo.requiredEquipments;

            // Create equipment items
            equipmentList.forEach(equipment => {
                if (equipment) { // Check if equipment is not empty
                    const equipmentItem = document.createElement('span');
                    equipmentItem.className = 'equipment-item';
                    equipmentItem.textContent = equipment;
                    equipmentBoxes.appendChild(equipmentItem);
                }
            });

            // If no equipment is available, show a message
            if (!equipmentList || equipmentList.length === 0) {
                equipmentBoxes.innerHTML = '<p style="color: #ccc;">No equipment required for this class</p>';
            }
        }

        // Add this inside the try block where you handle classInfo
        // Update the map initialization code inside your DOMContentLoaded handler
        // Replace the existing map code with this:
        if (classInfo.latitude && classInfo.longitude) {
            initializeMap(classInfo.latitude, classInfo.longitude, classInfo);
        } else if (classInfo.address) {
            // If coordinates aren't available, try to geocode the address
            const coords = await getCoordinatesFromAddress(classInfo.address);
            if (coords) {
                initializeMap(coords.latitude, coords.longitude, classInfo);
            } else {
                document.getElementById('mapContainer').innerHTML = `
                    <div style="text-align: center; padding: 20px; color: #ccc;">
                        <p>Unable to locate address on map</p>
                    </div>
                `;
            }
        } else {
            document.getElementById('mapContainer').innerHTML = `
                <div style="text-align: center; padding: 20px; color: #ccc;">
                    <p>Location information not available</p>
                </div>
            `;
        }

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to load class details',
            icon: 'error'
        });
    }

    fetchWaitlistCount(classId);

});

