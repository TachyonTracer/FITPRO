var uri = "http://localhost:8080";

// Add this variable at the top of your script
let recaptchaCompleted = false;

// Add this at the top of your file
var onloadCallback = function () {
  grecaptcha.render('recaptcha-div', {
    'sitekey': '6LdkwwgrAAAAAH9_icrIwM6fkKMCzTH2zMmcuZSf',
    'theme': 'dark',
    'callback': 'recaptchaCallback',
    'size': 'normal',
    'challenge-type': 'image',
    'type': 'image'
  });
};

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Add this callback function for reCAPTCHA
function recaptchaCallback() {
  // Hide error message when captcha is successfully completed
  document.querySelector('.captcha-error').style.display = 'none';
  recaptchaCompleted = true;
}

window.onload = function () {
  const message = getQueryParam("message");
  if (message) {
    const alertContainer = document.getElementById("alert-container");
    const decodedMessage = decodeURIComponent(message);

    // Determine alert color based on message
    const alertType = decodedMessage === "Activation Successful" ? "alert-success" : "alert-danger";

    // Create alert element
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert ${alertType} alert-dismissible fade show`;
    alertDiv.role = "alert";
    alertDiv.innerHTML = `
          ${decodedMessage}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;

    // Append to container
    alertContainer.appendChild(alertDiv);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      alertDiv.classList.remove("show");
      setTimeout(() => alertDiv.remove(), 500); // Wait for fade-out effect
    }, 5000);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const roleOptions = document.querySelectorAll(".role-option");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const formContainer = document.querySelector(".form-container");
  const tagline = document.querySelector(".tagline"); // Target the tagline

  // Utility function to show sliding message after the tagline
  function showMessage(message, success = true) {
    let messageDiv = document.querySelector(".message");
    if (!messageDiv) {
      messageDiv = document.createElement("div");
      messageDiv.className = "message";
      messageDiv.id = "message-displayer";
      // Insert the message div after the tagline
      tagline.insertAdjacentElement("afterend", messageDiv);
    }

    messageDiv.style.transition = "all 0.9s ease-in-out";
    messageDiv.style.transform = "translateY(-100%)";
    messageDiv.style.opacity = "0";

    messageDiv.textContent = message;
    messageDiv.style.background = success ? "green" : "red";
    messageDiv.style.color = "white";
    messageDiv.style.padding = "10px";
    messageDiv.style.marginBottom = "10px";
    messageDiv.style.textAlign = "center";
    messageDiv.style.borderRadius = "5px";
    messageDiv.style.position = "relative";
    messageDiv.style.zIndex = "1000";

    messageDiv.offsetHeight; // Trigger reflow
    messageDiv.style.transform = "translateY(0)";
    messageDiv.style.opacity = "1";
  }

  // Utility function to hide message
  function hideMessage() {
    const messageDiv = document.getElementById("message-displayer");
    if (messageDiv) {
      messageDiv.style.transform = "translateY(-100%)";
      messageDiv.style.opacity = "0";
      setTimeout(() => messageDiv.remove(), 500);
    }
  }

  // Email validation function
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Password validation function
  function isValidPassword(password) {
    const hasUpperCase = /(?=.*[A-Z])/.test(password);
    const hasLowerCase = /(?=.*[a-z])/.test(password);
    const hasNumber = /(?=.*\d)/.test(password);
    const hasSpecialChar = /(?=.*[\W_])/.test(password);
    const minLength = /.{8,}/.test(password);

    return {
      isValid: hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && minLength,
      message: !minLength
        ? "Password must be at least 8 characters long"
        : !hasUpperCase
          ? "Password must contain at least one uppercase letter"
          : !hasLowerCase
            ? "Password must contain at least one lowercase letter"
            : !hasNumber
              ? "Password must contain at least one number"
              : !hasSpecialChar
                ? "Password must contain at least one special character"
                : "",
    };
  }

  // Real-time validation for email
  usernameInput.addEventListener("input", function () {
    const email = this.value.trim();
    const message = this.nextElementSibling;
    if (!email) {
      showMessage("Email is required", false);
      message.textContent = "Email is required";
    } else if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address", false);
      message.textContent = "Please enter a valid email";
    } else {
      hideMessage();
      message.textContent = "";
    }
  });

  // Real-time validation for password
  passwordInput.addEventListener("input", function () {
    const password = this.value.trim();
    const message = this.nextElementSibling;
    const validation = isValidPassword(password);
    if (!password) {
      showMessage("Password is required", false);
      message.textContent = "Password is required";
    } else if (!validation.isValid) {
      showMessage(validation.message, false);
      message.textContent = validation.message;
    } else {
      hideMessage();
      message.textContent = "";
    }
  });

  // Add these event listeners to reset captcha when user changes form inputs after a failure
  usernameInput.addEventListener("focus", function () {
    if (document.querySelector('.captcha-error').style.display === 'block') {
      grecaptcha.reset();
      document.querySelector('.captcha-error').style.display = 'none';
      document.querySelector('.captcha-container').classList.remove('captcha-error-highlight');
    }
  });

  passwordInput.addEventListener("focus", function () {
    if (document.querySelector('.captcha-error').style.display === 'block') {
      grecaptcha.reset();
      document.querySelector('.captcha-error').style.display = 'none';
      document.querySelector('.captcha-container').classList.remove('captcha-error-highlight');
    }
  });

  let selectedRole = null;

  // Role Selection Logic
  roleOptions.forEach((option) => {
    option.addEventListener("click", () => {
      roleOptions.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");
      selectedRole = option.dataset.role;
    });

    option.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        option.click();
      }
    });
  });

  // Form submission with reCAPTCHA v3
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    let isValid = true;

    // Email validation
    const emailMessage = usernameInput.nextElementSibling;
    if (!email) {
      showMessage("Email is required", false);
      emailMessage.textContent = "Email is required";
      isValid = false;
      return;
    } else if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address", false);
      emailMessage.textContent = "Please enter a valid email";
      isValid = false;
      return;
    } else {
      emailMessage.textContent = "";
    }

    // Password validation
    const passwordMessage = passwordInput.nextElementSibling;
    const passwordValidation = isValidPassword(password);
    if (!password) {
      showMessage("Password is required", false);
      passwordMessage.textContent = "Password is required";
      isValid = false;
      return;
    } else if (!passwordValidation.isValid) {
      showMessage(passwordValidation.message, false);
      passwordMessage.textContent = passwordValidation.message;
      isValid = false;
      return;
    } else {
      passwordMessage.textContent = "";
    }

    // Role validation
    if (!selectedRole) {
      Swal.fire({
        icon: "warning",
        title: "Role Required",
        text: "Please select a role before submitting.",
      });
      isValid = false;
    }

    // reCAPTCHA validation with better error handling
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      document.querySelector('.captcha-error').textContent = "Please complete the captcha verification";
      document.querySelector('.captcha-error').style.display = 'block';
      document.querySelector('.captcha-container').classList.add('captcha-error-highlight');
      isValid = false;
    } else {
      document.querySelector('.captcha-error').style.display = 'none';
      document.querySelector('.captcha-container').classList.remove('captcha-error-highlight');
    }

    if (!isValid) {
      // Always reset the CAPTCHA to force a new challenge on retry
      grecaptcha.reset();
      return;
    }

    // Submit form
    submitLoginForm(email, password, selectedRole, recaptchaResponse);
  });

  function submitLoginForm(email, password, role, recaptchaToken) {
    // Proceed with form submission
    const payload = {
      email: email,
      password: password,
      role: role,
      recaptchaToken: recaptchaToken
    };

    $.ajax({
      url: `${uri}/api/AuthApi/login`,
      type: "POST",
      data: JSON.stringify(payload),
      contentType: "application/json",
      success: function (result) {
        // Reset the reCAPTCHA immediately
        grecaptcha.reset();

        localStorage.setItem("authToken", result.data.authToken);
        // Rest of your success handling...
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have successfully logged in!",
        }).then(() => {
          // Perform redirection based on user role
          if (result.data.userRole == "user") {
            window.location.href = "/User/DashBoard";
          } else if (result.data.userRole == "instructor") {
            window.location.href = "/instructor";
          } else if (result.data.userRole == "admin") {
            window.location.href = "/admin";
          }
        });
      },
      error: function (xhr) {
        // Reset the reCAPTCHA immediately
        grecaptcha.reset();

        const errorMessage = xhr.responseJSON?.message || "Login failed";
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: errorMessage,
        });
      },
    });
  }
});
