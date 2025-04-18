document.addEventListener("DOMContentLoaded", function () {
  const formContainer = document.querySelector(".form-container form");
  const emailInput = document.getElementById("email");
  const submitButton = document.getElementById("submitter-button");
  let base_url = "http://localhost:8080";

  function showMessage(message, success = true) {
    let messageDiv = document.querySelector(".message");
    if (!messageDiv) {
      messageDiv = document.createElement("div");
      messageDiv.className = "message";
      messageDiv.id = "message-displayer";
      formContainer.prepend(messageDiv);
    }

    // Add CSS for sliding animation
    messageDiv.style.transition = "all 0.9s ease-in-out";
    messageDiv.style.transform = "translateY(-100%)";
    messageDiv.style.opacity = "0";

    // Set message content and styling
    messageDiv.textContent = message;
    messageDiv.style.background = success ? "#28a745" : "red";
    messageDiv.style.color = "white";
    messageDiv.style.padding = "10px"; 
    messageDiv.style.marginBottom = "10px";
    messageDiv.style.textAlign = "center";
    messageDiv.style.borderRadius = "5px";
    messageDiv.style.position = "relative";
    messageDiv.style.zIndex = "1000";

    // Trigger reflow to ensure transition works
    messageDiv.offsetHeight;

    // Slide in the message
    messageDiv.style.transform = "translateY(0)";
    messageDiv.style.opacity = "1";

    // Optional: Automatically hide after 3 seconds
    // setTimeout(hideMessage, 3000);
  }

  function hideMessage() {
    const messageDiv = document.getElementById("message-displayer");
    if (messageDiv) {
      // Slide out the message
      messageDiv.style.transform = "translateY(-100%)";
      messageDiv.style.opacity = "0";

      // Remove from DOM after animation completes
      setTimeout(() => {
        messageDiv.remove();
      }, 500);
    }
  }

  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  function handleAction() {
    if (!emailInput.disabled) {
      if (!emailInput.value || !isValidEmail(emailInput.value)) {
        showMessage("Please enter a valid email address!", false);
        return;
      }
      sendOTP();
    } else if (
      document.getElementById("otp-container") &&
      !document.getElementById("otp-container").disabled
    ) {
      verifyOTP();
    } else if (
      document.getElementById("new-password") &&
      document.getElementById("confirm-password")
    ) {
      resetPassword();
    }
  }

  function sendOTP() {
    $.ajax({
      // url: "https://mocki.io/v1/9606ecff-fc72-4003-851e-ec335b3e988e",
      url: `${base_url}/api/AuthApi/Dispatch-otp`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email: emailInput.value }),
      success: function (data) {
        if (data.success) {
          showMessage(data.message, true);
          emailInput.disabled = true;
          submitButton.textContent = "VERIFY OTP";
          setupOTPInput();
        } else {
          showMessage(data.message, false);
        }
      },
    });
  }

  function setupOTPInput() {
    const otpContainer = document.createElement("div");
    otpContainer.id = "otp-container";
    otpContainer.style.display = "flex";
    otpContainer.style.gap = "10px";
    otpContainer.style.justifyContent = "center";

    for (let i = 0; i < 6; i++) {
      const otpInput = document.createElement("input");
      otpInput.type = "text";
      otpInput.maxLength = 1;
      otpInput.className = "otp-box";
      otpInput.style.width = "45px";
      otpInput.style.height = "40px";
      otpInput.style.textAlign = "center";
      otpInput.style.fontSize = "20px";
      otpInput.style.border = "1px solid #ccc";
      otpInput.style.borderRadius = "5px";
      otpInput.style.outline = "none";
      otpInput.style.transition = "border-color 0.3s";
      otpInput.addEventListener("input", function (event) {
        otpInput.value = otpInput.value.replace(/\D/g, ""); // Only allow numbers
        if (otpInput.value.length === 1 && i < 5) {
          otpContainer.children[i + 1].focus();
        }
      });
      otpContainer.appendChild(otpInput);
    }
    formContainer.insertBefore(otpContainer, submitButton);
  }

  function verifyOTP() {
    const otpInputs = document.querySelectorAll(".otp-box");
    let otpValue = "";
    otpInputs.forEach((input) => (otpValue += input.value));

    if (otpValue.length !== 6) {
      showMessage("OTP must be exactly 6 digits!", false);
      return;
    }

    $.ajax({
      // url: "https://mocki.io/v1/0903fed4-cd57-432e-8e9a-9cb613953276",
      url: `${base_url}/api/AuthApi/verify-otp`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email: emailInput.value, OTP: otpValue }),
      success: function (data) {
        if (data.success) {
          showMessage(data.message, true);
          otpInputs.forEach((input) => (input.disabled = true));
          document.getElementById("otp-container").disabled = true;
          submitButton.textContent = "RESET PASSWORD";
          setupPasswordInputs();
        } else {
          showMessage(data.message, false);
        }
      },
    });
  }

  function setupPasswordInputs() {
    const newPassword = document.createElement("input");
    newPassword.type = "password";
    newPassword.id = "new-password";
    newPassword.placeholder = "Enter new password";

    const confirmPassword = document.createElement("input");
    confirmPassword.type = "password";
    confirmPassword.id = "confirm-password";
    confirmPassword.placeholder = "Confirm new password";

    formContainer.insertBefore(newPassword, submitButton);
    formContainer.insertBefore(confirmPassword, submitButton);
  }

  function resetPassword() {
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(newPassword)) {
      showMessage("Password must contain at least one uppercase and one lowercase letter.", false);
      return false;
    }
    if (!/(?=.*\d)/.test(newPassword)) {
      showMessage("Password must contain at least one number.", false);
      return false;
    }
    if (!/(?=.*[\W_])/.test(newPassword)) {
      showMessage("Password must contain at least one special character.", false);
      return false;
    }
    if (!/.{8,}/.test(newPassword)) {
      showMessage("Password must be at least 8 characters long.", false);
      return false;
    }

    if (!newPassword) {
      showMessage("Password cannot be empty!", false);
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("Passwords do not match!", false);
      return;
    }

    const otpInputs = document.querySelectorAll(".otp-box");
    let otpValue = "";
    otpInputs.forEach((input) => (otpValue += input.value));

    $.ajax({
      // url: "https://mocki.io/v1/7dda4c6c-5a7b-415f-af44-4c4bb57712a5",
      url: `${base_url}/api/AuthApi/update-password`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email: emailInput.value, newPassword: newPassword, OTP: otpValue }),
      success: function (data) {
        if (data.success) {
          showMessage(data.message, true);
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 1500);
        } else {
          showMessage(data.message, false);
        }
      },
    });
  }

  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    handleAction();
  });
  emailInput.addEventListener("input", (event) => {
    const email = event.target.value.trim();

    if (!email) {
      showMessage("Email field cannot be empty", false);
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address", false);
    } else {
      hideMessage();
      // setTimeout(hideMessage, 3000); // Hide message after 3 seconds
    }
  });
});
