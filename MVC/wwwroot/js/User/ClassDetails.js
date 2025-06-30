$("document").ready(function(){

    var user = localStorage.getItem("authToken");
    if (!user) {
        window.location.href = "/auth/login"
    }
});

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

function ExploreBlogs() {
    // Redirect to the class details page with the class ID
    window.location.href = `/User/ExploreBlogs`;
}
function BMI() {
    // Redirect to the class details page with the class ID
    window.location.href = `/User/BMICalculator`;
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
async function fetchInstructorDetails(instructorId) {
    try {
        console.log('Fetching instructor with ID:', instructorId);
        const response = await fetch(`${uri}/api/Instructor/GetInstructorById/${instructorId}`);
        const data = await response.json();
        
        console.log('Instructor API response:', data);
        
        if (data.success && data.data) {
            return data.data;
        }
        throw new Error('Failed to fetch instructor details');
    } catch (error) {
        console.error('Error fetching instructor details:', error);
        return null;
    }
}

async function bookThisClass() {
    const classId = document.getElementById('classId').value;
    const userId = getUserIdFromToken();

    if (!classId) {
        Swal.fire({
            title: 'Error',
            text: 'No class ID provided',
            icon: 'error'
        });
        return;
    }

    try {
        // First check if the user has already booked this class
        const checkResponse = await fetch('http://localhost:8080/api/Class/IsClassAlreadyBooked', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                classId: parseInt(classId),
                userId: parseInt(userId)
            })
        });

        const checkResult = await checkResponse.json();
        if (!checkResult.success) {
            Swal.fire({
                title: 'Already Booked',
                text: checkResult.message,
                icon: 'info'
            });
            return;
        }

        // Get class details to determine availability and fee
        const classResponse = await fetch(`http://localhost:8080/api/Class/GetOneClass?id=${classId}`);
        const result = await classResponse.json();

        // Fix: Always use result.data
        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch class data');
        }
        const classInfo = result.data;

        // Check if this is a direct booking (available capacity) or waitlist
        if (classInfo.availableCapacity > 0) {
            // Initialize Stripe
            const stripe = Stripe('pk_test_51R9873B6NxmJUHpLwRmbtVWKFWIAFHzLx27IWuda1MiaD1WtS6G9uimHfT4bepFIzXCYNQ0BpcYEo1FWSH651Zjp00H0cXnR7g');

            // Create checkout session
            try {
                const sessionResponse = await fetch('http://localhost:8080/Checkout/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ClassName: classInfo.className,
                        ClassDescription: classInfo.description?.purpose || 'N/A',
                        amount: classInfo.fee * 100, // Stripe expects amount in cents
                        currency: "INR",
                        classId: classId,
                        userId: userId
                    })
                });

                const session = await sessionResponse.json();

                if (!session.data.sessionId) {
                    Swal.fire({
                        title: "Payment Error",
                        text: "Failed to initiate payment. Please try again later.",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                    return;
                }

                // Store session ID for verification after payment
                localStorage.setItem("sessionId", session.data.sessionId);
                localStorage.setItem("bookingClassId", classId);
                localStorage.setItem("bookingUserId", userId);

                // Redirect to Stripe checkout
                const result = await stripe.redirectToCheckout({ sessionId: session.data.sessionId });

                if (result.error) {
                    Swal.fire({
                        title: "Payment Error",
                        text: result.error.message,
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                }
            } catch (error) {
                console.error('Payment error:', error);
                Swal.fire({
                    title: "Payment Error",
                    text: "Unable to process payment. Please try again later.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        } else {
            // Handle waitlist WITH payment - using the same payment flow as booking
            Swal.fire({
                title: "Join Waitlist",
                text: "This class is currently full. Would you like to join the waitlist? You'll only be charged if you get a spot.",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, Join Waitlist",
                cancelButtonText: "Cancel"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // Use Stripe for waitlist entries too
                        const stripe = Stripe('pk_test_51R9873B6NxmJUHpLwRmbtVWKFWIAFHzLx27IWuda1MiaD1WtS6G9uimHfT4bepFIzXCYNQ0BpcYEo1FWSH651Zjp00H0cXnR7g');

                        // Create checkout session - same as booking but add a waitlist flag
                        const sessionResponse = await fetch('http://localhost:8080/Checkout/create-checkout-session', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                ClassName: classInfo.className,
                                ClassDescription: `Waitlist entry for ${classInfo.className}`,
                                amount: classInfo.fee * 100, // Same fee for waitlist
                                currency: "INR",
                                classId: classId,
                                userId: userId,
                                isWaitlist: true // Add a flag to indicate this is for waitlist
                            })
                        });

                        const session = await sessionResponse.json();

                        if (!session.data.sessionId) {
                            Swal.fire({
                                title: "Payment Error",
                                text: "Failed to initiate payment for waitlist. Please try again later.",
                                icon: "error",
                                confirmButtonText: "OK"
                            });
                            return;
                        }

                        // Store session ID for verification after payment
                        localStorage.setItem("sessionId", session.data.sessionId);
                        localStorage.setItem("bookingClassId", classId);
                        localStorage.setItem("bookingUserId", userId);
                        localStorage.setItem("isWaitlist", "true"); // Flag to indicate waitlist in storage

                        // Redirect to Stripe checkout
                        const result = await stripe.redirectToCheckout({ sessionId: session.data.sessionId });

                        if (result.error) {
                            Swal.fire({
                                title: "Payment Error",
                                text: result.error.message,
                                icon: "error",
                                confirmButtonText: "OK"
                            });
                        }
                    } catch (error) {
                        console.error('Waitlist payment error:', error);
                        Swal.fire({
                            title: "Payment Error",
                            text: "Unable to process waitlist payment. Please try again later.",
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'An unexpected error occurred. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

// Add a function to handle successful payments after returning from Stripe
async function completeBookingAfterPayment(sessionId, classId, userId) {
    try {
        const response = await fetch('http://localhost:8080/api/Class/CompleteBookingAfterPayment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId: sessionId,
                classId: parseInt(classId),
                userId: parseInt(userId)
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
                title: 'Booking Successful!',
                text: 'Your payment was successful and the class has been booked.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'Booking Error',
                text: result.message || 'There was a problem completing your booking after payment.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Error completing booking after payment:', error);
        Swal.fire({
            title: 'Booking Error',
            text: 'There was a problem completing your booking after payment.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
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
function getUserIdFromToken() {
    const token = localStorage.getItem("authToken");
    if (!token) {
        console.warn("No auth token found in localStorage.");
        return null;
    }
    const decoded = parseJwt(token);
    if (decoded) {
        return JSON.parse(decoded.UserObject).userId; // Updated to return instructorId from decoded token
    }
    console.warn("Invalid or malformed token.");
    return null;
}

// function getUserIdFromToken() {
//     // Hardcoded user ID for testing without login
//     return 1; // You can change this to any valid user ID in your database
// }

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
            // document.getElementById("waitlist-count").textContent = 0;
            document.getElementById("waitlist-count").textContent = data.data.count;
        } else {
            document.getElementById("waitlist-count").textContent = "N/A";
            console.error("Failed to fetch count:", data.message);
        }
    }
    catch (error) {
        console.error("Error fetching waitlist count:", error);
        document.getElementById("waitlist-count").textContent = "Error";
    }
}

// Update this part of your DOMContentLoaded event handler
async function updateBookingSection(classInfo) {
    const bookSection = document.getElementById('book-section');
    const waitlistSection = document.getElementById('waitlist-section');

    // Fetch the waitlist count
    try {
        const response = await fetch(`http://localhost:8080/api/Class/ClasswiseWaitlistCount/${classInfo.classId}`);
        const data = await response.json();

        const waitlistCount = data.success ? data.count : 0;

        if (classInfo.availableCapacity > 0) {
            // Show Book Now button
            bookSection.style.display = 'block';
            waitlistSection.style.display = 'none';

            // Make sure the button has the correct onclick handler
            document.querySelector('.book-now-btn').onclick = bookThisClass;
        } else {
            // Show Join Waiting List button
            bookSection.style.display = 'none';
            waitlistSection.style.display = 'block';
            document.getElementById('waitlist-count').textContent = waitlistCount;
            updateWaitlistColor(waitlistCount);

            // Make sure the waitlist button has the same onclick handler as booking
            document.querySelector('.waitlist-btn').onclick = bookThisClass;
        }
    } catch (error) {
        console.error('Error fetching waitlist count:', error);
    }
}



// Replace your current DOMContentLoaded event listener with this:
document.addEventListener('DOMContentLoaded', async function () {
    // Check if authentication token exists FIRST, before doing anything else
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        // Store current page URL to redirect back after login
        localStorage.setItem('redirectAfterLogin', window.location.href);

        // Show alert and then redirect, using async/await to ensure alert is shown
        await Swal.fire({
            title: 'Authentication Required',
            text: 'Please log in to view class details',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Go to Login'
        });

        // After alert is closed, redirect immediately
        window.location.href = '/Auth/Login';
        return; // Stop execution
    }

    // Continue with the rest of your code for authenticated users
    const urlParams = new URLSearchParams(window.location.search);
    const classId = document.getElementById('classId').value;
    const paymentSuccess = urlParams.get('payment_success');

    // Process payment success if needed
    if (paymentSuccess === 'true') {
        const sessionId = localStorage.getItem('sessionId');
        const classId = localStorage.getItem('bookingClassId');
        const userId = localStorage.getItem('bookingUserId');

        if (sessionId && classId && userId) {
            // Verify payment and complete booking
            completeBookingAfterPayment(sessionId, classId, userId);

            // Clear stored booking data
            localStorage.removeItem('sessionId');
            localStorage.removeItem('bookingClassId');
            localStorage.removeItem('bookingUserId');
        }
    }

    // Your existing class loading code...
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
        const result = await classResponse.json();

        // Fix: Always use result.data
        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch class data');
        }
        const classInfo = result.data;

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
        updateBookingSection(classInfo);

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

        // Fetch and update instructor details
        if (classInfo.instructorName) {
            const instructorSection = document.querySelector('.instructor-info');
            instructorSection.innerHTML = `
                <img src="/img/fitness.jpg" 
                    alt="${classInfo.instructorName}" 
                    onerror="this.src='/img/default-instructor.png'">
                <div class="instructor-text">
                    <strong>${classInfo.instructorName}</strong>
                    <p>Expert Fitness Instructor</p>
                </div>
            `;
        } else {
            document.querySelector('.instructor-info').innerHTML = `
                <img src="/img/default-instructor.png" alt="Default Instructor">
                <div class="instructor-text">
                    <strong>Instructor information unavailable</strong>
                    <p>Details not available at this time</p>
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

