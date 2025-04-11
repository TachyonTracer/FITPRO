var uri = "http://localhost:8080";

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
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
  const captchaContainer = document.getElementById("captcha-container");
  const captchaQuestion = document.getElementById("captcha-question");
  const captchaAnswer = document.getElementById("captcha-answer");
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

  // Real-time validation for CAPTCHA
  captchaAnswer.addEventListener("input", function () {
    const message = this.nextElementSibling;
    if (!this.value) {
      showMessage("Answer is required", false);
      message.textContent = "Answer is required";
    } else {
      hideMessage();
      message.textContent = "";
    }
  });

  // Generate a simple math CAPTCHA
  function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaQuestion.textContent = `What is ${num1} + ${num2}?`;
    return num1 + num2;
  }

  let correctAnswer = generateCaptcha();
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

  // Form submission
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const userAnswer = parseInt(captchaAnswer.value, 10) || 0;
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

    // CAPTCHA validation
    const captchaMessage = captchaAnswer.nextElementSibling;
    if (!captchaAnswer.value) {
      showMessage("Answer is required", false);
      captchaMessage.textContent = "Answer is required";
      isValid = false;
      return;
    } else if (userAnswer !== correctAnswer) {
      showMessage("Incorrect answer", false);
      captchaMessage.textContent = "Incorrect answer";
      isValid = false;
      correctAnswer = generateCaptcha();
      captchaAnswer.value = "";
      return;
    } else {
      captchaMessage.textContent = "";
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

    if (!isValid) {
      return;
    }

    // Proceed with form submission if valid
    const payload = {
      email: email,
      password: password,
      role: selectedRole,
    };

    $.ajax({
      url: `${uri}/api/AuthApi/login`,
      type: "POST",
      data: JSON.stringify(payload),
      contentType: "application/json",
      success: function (result) {
        localStorage.setItem("authToken", result.authToken);

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have successfully logged in!",
        }).then(() => {
            // Perform redirection based on user role
            if (result.userRole == "user") {
              window.location.href = "/user/index";  
            } else if (result.userRole == "instructor") {
              window.location.href = "/instructor";
            } else if (result.userRole == "admin") {
              window.location.href = "/admin";
            }
        });
        

      },
      error: function (xhr) {
        const errorMessage = xhr.responseJSON?.message || "Login failed";
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: errorMessage,
        });
      },
    });
  });
});
