 // Slider Functionality
 const slides = document.getElementById('slides');
 const prevBtn = document.getElementById('prev-btn');
 const nextBtn = document.getElementById('next-btn');
 const indicatorsContainer = document.getElementById('indicators');
 let currentSlide = 0;
 const totalSlides = 5;

 // Create indicators
 for (let i = 0; i < totalSlides; i++) {
     const indicator = document.createElement('div');
     indicator.classList.add('indicator');
     if (i === 0) indicator.classList.add('active');
     indicator.addEventListener('click', () => {
         goToSlide(i);
     });
     indicatorsContainer.appendChild(indicator);
 }

 function goToSlide(slideIndex) {
     slides.style.transform = `translateX(-${slideIndex * 20}%)`;
     currentSlide = slideIndex;
     
     // Update indicators
     document.querySelectorAll('.indicator').forEach((indicator, index) => {
         if (index === slideIndex) {
             indicator.classList.add('active');
         } else {
             indicator.classList.remove('active');
         }
     });
 }

 prevBtn.addEventListener('click', () => {
     currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; // Loop to last slide if at first
     goToSlide(currentSlide);
 });

 nextBtn.addEventListener('click', () => {
     currentSlide = (currentSlide + 1) % totalSlides; // Loop to first slide if at last
     goToSlide(currentSlide);
 });

 // Auto-advance slides
 let slideInterval = setInterval(() => {
     currentSlide = (currentSlide + 1) % totalSlides;
     goToSlide(currentSlide);
 }, 5000);

 // Pause auto-advance on hover
 const sliderElement = document.querySelector('.slider');
 sliderElement.addEventListener('mouseenter', () => {
     clearInterval(slideInterval);
 });

 sliderElement.addEventListener('mouseleave', () => {
     slideInterval = setInterval(() => {
         currentSlide = (currentSlide + 1) % totalSlides;
         goToSlide(currentSlide);
     }, 5000);
 });

 // Keyboard navigation for slider
 document.addEventListener('keydown', (e) => {
     if (e.key === 'ArrowLeft') {
         currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
         goToSlide(currentSlide);
     } else if (e.key === 'ArrowRight') {
         currentSlide = (currentSlide + 1) % totalSlides;
         goToSlide(currentSlide);
     }
 });

 // Parse dates for better display
 function formatDate(dateString) {
     const date = new Date(dateString);
     const options = { year: 'numeric', month: 'long', day: 'numeric' };
     return date.toLocaleDateString('en-US', options);
 }

 // Format the dates in the display
 const startDate = "2025-03-28T00:00:00";
 const endDate = "2025-03-29T00:00:00";
 
 // Total Price Logic (Static for now)
 const pricePerClass = 15; // Extracted from the Price field
 const totalPriceElement = document.getElementById('total-price');
 let totalPrice = pricePerClass; // For a single class booking
 totalPriceElement.textContent = `Total Price to Pay: $${totalPrice}`;

 // Button Actions
 document.querySelector('.book-btn').addEventListener('click', () => {
     const btn = document.querySelector('.book-btn');
     btn.innerHTML = 'Booking...';
     setTimeout(() => {
         btn.innerHTML = 'Booked!';
         btn.style.backgroundColor = '#4CAF50';
         setTimeout(() => {
             alert(`Class booked successfully! Total paid: $${totalPrice}`);
             btn.innerHTML = 'Book Now';
             btn.style.backgroundColor = '';
         }, 1000);
     }, 1000);
 });

 document.querySelector('.cancel-btn').addEventListener('click', () => {
     if(confirm('Are you sure you want to cancel this booking?')) {
         alert('Booking cancelled.');
     }
 });