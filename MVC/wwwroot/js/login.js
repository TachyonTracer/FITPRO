document.addEventListener('DOMContentLoaded', () => {
    const captchaContainer = document.getElementById('captcha-container');
    const captchaQuestion = document.getElementById('captcha-question');
    const captchaAnswer = document.getElementById('captcha-answer');
    const loginForm = document.getElementById('login-form');
    const roleOptions = document.querySelectorAll('.role-option');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Set custom validation messages
    usernameInput.addEventListener('input', function () {
        const message = this.nextElementSibling;
        console.log('Validation message element:', message); // Debugging
        if (!this.value) {
            message.textContent = 'Email is required';
        } else if (!isValidEmail(this.value)) {
            message.textContent = 'Please enter a valid email';
        } else {
            message.textContent = '';
        }
    });

    passwordInput.addEventListener('input', function () {
        const message = this.nextElementSibling;
        if (!this.value) {
            message.textContent = 'Password is required';
        } else {
            message.textContent = '';
        }
    });

    captchaAnswer.addEventListener('input', function () {
        const message = this.nextElementSibling;
        if (!this.value) {
            message.textContent = 'Answer is required';
        } else {
            message.textContent = '';
        }
    });

    // Email validation function
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Generate a simple math CAPTCHA
    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        captchaQuestion.textContent = `What is ${num1} + ${num2}?`;
        return num1 + num2;
    }

    // Store the correct CAPTCHA answer
    let correctAnswer = generateCaptcha();
    let selectedRole = null;

    // Role Selection Logic
    roleOptions.forEach(option => {
        option.addEventListener('click', () => {
            roleOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedRole = option.dataset.role;
        });

        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                option.click();
            }
        });
    });

    // Form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const userAnswer = parseInt(captchaAnswer.value, 10) || 0;
        let isValid = true;

        // Email validation
        const emailMessage = usernameInput.nextElementSibling;
        if (!email) {
            emailMessage.textContent = 'Email is required';
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailMessage.textContent = 'Please enter a valid email';
            isValid = false;
        } else {
            emailMessage.textContent = '';
        }

        // Password validation
        const passwordMessage = passwordInput.nextElementSibling;
        if (!password) {
            passwordMessage.textContent = 'Password is required';
            isValid = false;
        } else {
            passwordMessage.textContent = '';
        }

        // CAPTCHA validation
        const captchaMessage = captchaAnswer.nextElementSibling;
        if (!captchaAnswer.value) {
            captchaMessage.textContent = 'Answer is required';
            isValid = false;
        } else if (userAnswer !== correctAnswer) {
            captchaMessage.textContent = 'Incorrect answer';
            isValid = false;
            correctAnswer = generateCaptcha(); // Regenerate CAPTCHA
            captchaAnswer.value = ''; // Clear the input field
        } else {
            captchaMessage.textContent = '';
        }

        // Role validation
        if (!selectedRole) {
            Swal.fire({
                icon: 'warning',
                title: 'Role Required',
                text: 'Please select a role before submitting.',
            });
            isValid = false;
        }

        if (!isValid) {
            return; // Stop form submission if validation fails
        }

        // Proceed with form submission if valid
        const payload = {
            email: email,
            password: password,
            role: selectedRole
        };

        $.ajax({
            url: 'http://localhost:8080/api/AuthApi/login',
            type: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            success: function (result) {
                localStorage.setItem("token", result.token);
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'You have successfully logged in!',
                }).then(() => {
                    console.log('Token:', result.token);
                });
            },
            error: function (xhr) {
                const errorMessage = xhr.responseJSON?.message || 'Login failed';
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: errorMessage,
                });
            }
        });
    });
});



