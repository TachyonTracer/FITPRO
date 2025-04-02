const themes = [
  {
    background: "#1A1A2E",
    color: "#FFFFFF",
    primaryColor: "#FF4D4D",
    glassColor: "rgba(255, 255, 255, 0.1)",
  },
  {
    background: "#2C2C2C",
    color: "#FFFFFF",
    primaryColor: "#FFD700",
    glassColor: "rgba(255, 255, 255, 0.1)",
  },
  {
    background: "#3A3A3A",
    color: "#FFFFFF",
    primaryColor: "#00C4B4",
    glassColor: "rgba(255, 255, 255, 0.1)",
  },
  {
    background: "#FF4D4D",
    color: "#FFFFFF",
    primaryColor: "#1A1A2E",
    glassColor: "rgba(255, 255, 255, 0.1)",
  },
  {
    background: "#FFD700",
    color: "#1A1A2E",
    primaryColor: "#2C2C2C",
    glassColor: "rgba(0, 0, 0, 0.1)",
  },
  {
    background: "#00C4B4",
    color: "#FFFFFF",
    primaryColor: "#FF4D4D",
    glassColor: "rgba(255, 255, 255, 0.1)",
  },
];

const setTheme = (theme) => {
  const root = document.querySelector(":root");
  const illustration = document.querySelector(".illustration");

  root.style.setProperty("--background", theme.background);
  root.style.setProperty("--color", theme.color);
  root.style.setProperty("--primary-color", theme.primaryColor);
  root.style.setProperty("--glass-color", theme.glassColor);

  if (theme.color !== "#FFFFFF") {
    illustration.style.background = "rgba(255, 255, 255, 0.3)";
    illustration.style.borderRadius = "15px";
    illustration.style.padding = "8px";
  } else {
    illustration.style.background = "none";
    illustration.style.padding = "0";
  }

  const gymIcons = document.querySelectorAll(".gym-icon");
  gymIcons.forEach((icon) => {
    icon.style.backgroundImage = icon.style.backgroundImage.replace(
      /stroke="[^"]*"/,
      `stroke="${theme.color}"`
    );
  });
};

const displayThemeButtons = () => {
  const btnContainer = document.querySelector(".theme-btn-container");
  themes.forEach((theme, index) => {
    const div = document.createElement("div");
    div.className = "theme-btn";
    div.style.background = theme.background;
    div.setAttribute("role", "radio");
    div.setAttribute("aria-checked", index === 0 ? "true" : "false");
    div.setAttribute("tabindex", "0");
    btnContainer.appendChild(div);

    div.addEventListener("click", () => {
      setTheme(theme);
      document
        .querySelectorAll(".theme-btn")
        .forEach((btn) => btn.setAttribute("aria-checked", "false"));
      div.setAttribute("aria-checked", "true");
    });

    div.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        div.click();
      }
    });
  });
};

// Function to show terms and conditions
function showTerms() {
  Swal.fire({
    title: "Terms and Conditions",
    html: `
                    <div style="text-align: left; max-height: 60vh; overflow-y: auto; padding: 0 10px;">
                        <h3 style="color: var(--primary-color); margin-top: 15px;">1. Acceptance of Terms</h3>
                        <p>By registering with Fitness Hub, you agree to be bound by these Terms and Conditions.</p>
                        
                        <h3 style="color: var(--primary-color); margin-top: 15px;">2. Membership</h3>
                        <p>Membership is personal to you and cannot be transferred or assigned.</p>
                        
                        <h3 style="color: var(--primary-color); margin-top: 15px;">3. Health and Safety</h3>
                        <p>You confirm that you are in good physical condition and have no medical reason or impairment that might prevent you from using our services.</p>
                        
                        <h3 style="color: var(--primary-color); margin-top: 15px;">4. Privacy Policy</h3>
                        <p>Your personal information will be handled in accordance with our Privacy Policy.</p>
                        
                        <h3 style="color: var(--primary-color); margin-top: 15px;">5. Cancellation Policy</h3>
                        <p>Memberships can be cancelled with 30 days notice.</p>
                        
                        <h3 style="color: var(--primary-color); margin-top: 15px;">6. Liability</h3>
                        <p>Fitness Hub is not liable for any injuries sustained while using our facilities or services.</p>
                    </div>
                `,
    width: "800px",
    confirmButtonText: "I Understand",
    backdrop: true,
    background: "var(--glass-color)",
    scrollbarPadding: false,
  });
}

displayThemeButtons();

$(document).ready(function () {
  let selectedRole = "user";
  let emailValid = false;
  let formDataStore = {
    personalInfo: {
      acceptTerms: false,
    },
    detailsInfo: {},
    profileImageInfo: {},
  };

  // Role selection functionality
  $(".role-option").click(function () {
    $(".role-option").removeClass("selected");
    $(this).addClass("selected");
    selectedRole = $(this).data("role");
    formDataStore.personalInfo.role = selectedRole;
    formDataStore.detailsInfo = {};

    // Refresh the wizard to show appropriate fields for the selected role
    const wizard = $("#wizard").data("kendoWizard");
    if (wizard) {
      wizard.refresh();
    }
  });

  function generateActivationToken() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  function getUserDetailsConfig() {
    return {
      formData: {
        height: null,
        weight: null,
        goal: [],
        medicalCondition: [],
      },
      items: [
        {
          field: "height",
          label: "Height (min 100cm):",
          editor: "NumericTextBox",
          editorOptions: {
            format: "n0",
            min: 100,
            max: 300,
          },
          validation: {
            required: true,
            min: 100,
            max: 300,
            messages: { required: "Height is required" },
          },
        },
        {
          field: "weight",
          label: "Weight (min 35kg):",
          editor: "NumericTextBox",
          editorOptions: {
            format: "n2",
            min: 30,
            max: 500,
          },
          validation: {
            required: true,
            min: 35,
            max: 500,
            messages: { required: "Weight is required" },
          },
        },
        {
          field: "goal",
          label: "Fitness Goal:",
          editor: "MultiSelect",
          editorOptions: {
            dataSource: [
              "Weight Loss",
              "Muscle Gain",
              "General Fitness",
              "Endurance Training",
              "Flexibility Improvement",
              "Sports Specific",
            ],
            placeholder: "Select your goals...",
          },
          validation: {
            required: true,
            maxLength: 100,
            messages: { required: "Please select at least one fitness goal" },
          },
        },
        {
          field: "medicalCondition",
          label: "Medical Conditions:",
          editor: "MultiSelect",
          editorOptions: {
            dataSource: [
              "Diabetes",
              "High Blood Pressure",
              "Heart Disease",
              "Asthma",
              "Arthritis",
              "Back Pain",
              "None",
            ],
            placeholder: "Select any conditions...",
          },
          validation: {
            required: true,
            maxLength: 200,
            messages: {
              required:
                "Please select at least one medical condition or 'None'",
            },
          },
        },
      ],
    };
  }

  function getInstructorDetailsConfig() {
    return {
      formData: {
        specialization: [],
        association: "",
        certificates: null,
        idProof: null,
      },
      items: [
        {
          field: "specialization",
          label: "Specialization:",
          editor: "MultiSelect",
          editorOptions: {
            dataSource: [
              "Yoga",
              "Pilates",
              "Weight Training",
              "Cardio",
              "CrossFit",
              "Martial Arts",
              "Dance",
              "Nutrition",
            ],
            placeholder: "Select your specializations...",
          },
          validation: {
            required: true,
            maxLength: 100,
            messages: { required: "Please select at least one specialization" },
          },
        },
        {
          field: "association",
          label: "Professional Association:",
          validation: {
            required: true,
            maxLength: 100,
            messages: { required: "Professional Association is required" },
          },
        },
        {
          field: "certificates",
          label: "Professional Certificates (Pdf):",
          editor: function (container, options) {
            var input = $('<input type="file" />')
              .appendTo(container)
              .attr("name", options.field)
              .kendoUpload({
                multiple: true,
                validation: { allowedExtensions: [".pdf"] },
                showFileList: true,
                dropZone: ".k-dropzone",
                select: function (e) {
                  formDataStore.detailsInfo.certificates = e.files;
                },
              });
          },
          validation: {
            required: true,
            messages: { required: "Professional Certificates are required" },
          },
        },
        {
          field: "idProof",
          label: "ID Proof (Pdf):",
          editor: function (container, options) {
            var input = $('<input type="file" />')
              .appendTo(container)
              .attr("name", options.field)
              .kendoUpload({
                multiple: false,
                validation: { allowedExtensions: [".pdf"] },
                showFileList: true,
                dropZone: ".k-dropzone",
                select: function (e) {
                  formDataStore.detailsInfo.idProof = e.files;
                },
              });
          },
          validation: {
            required: true,
            messages: { required: "ID Proof is required" },
          },
        },
      ],
    };
  }

  var wizard = $("#wizard")
    .kendoWizard({
      validateOnPrevious: true,
      stepper: { indicator: true, label: true, linear: true },
      steps: [
        {
          title: "Personal Information",
          form: {
            formData: {
              role: "user",
              fullName: "",
              email: "",
              phone: "",
              gender: "",
              dateOfBirth: null,
              password: "",
              confirmPassword: "",
              acceptTerms: false,
            },
            buttonsTemplate: "",
            items: [
              {
                field: "fullName",
                label: "Full Name:",
                validation: {
                  required: true,
                  minLength: 2,
                  maxLength: 50,
                  messages: {
                    required: "Full Name is required",
                    minLength: "Full Name must be at least 2 characters long",
                    maxLength: "Full Name cannot exceed 50 characters",
                  },
                },
                editor: function (container, options) {
                  var input = $(
                    '<input type="text" required data-required-msg = "Full Name is required" pattern="^.{2,20}$" data-pattern-msg="Full Name must be at least 2 characters long"/>'
                  )
                    .appendTo(container)
                    .attr("name", options.field)
                    .kendoTextBox({ placeholder: "Enter your full name" });
                  input.on("change", function () {
                    formDataStore.personalInfo.fullName = $(this).val();
                  });
                },
              },
              {
                field: "email",
                label: "Email:",
                validation: {
                  required: true,
                  email: true,
                  messages: {
                    required: "Email is required",
                    email: "Please enter a valid email address",
                  },
                },
                editor: function (container, options) {
                  var input = $(
                    '<input type="email" required data-required-msg = "Email is required" type="email" data-email-msg="Please enter email in proper format!"/>'
                  )
                    .appendTo(container)
                    .attr("name", options.field)
                    .kendoTextBox({ placeholder: "Enter your email" });
                  input.on("blur", function () {
                    var email = $(this).val();
                    if (email) {
                      $.ajax({
                        url: "http://localhost:8080/api/AuthApi/check-email",
                        method: "GET",
                        data: { email: email },
                        success: function (response) {
                          if (response.exists) {
                            emailValid = false;
                            input.next(".email-error").remove();
                            input.after(
                              '<span class="email-error">Email already registered</span>'
                            );
                          } else {
                            emailValid = true;
                            input.next(".email-error").remove();
                          }
                        },
                        error: function () {
                          emailValid = false;
                          input.next(".email-error").remove();
                          input.after(
                            '<span class="email-error">Error checking email</span>'
                          );
                        },
                      });
                    }
                  });
                  input.on("change", function () {
                    formDataStore.personalInfo.email = $(this).val();
                  });
                },
              },
              {
                field: "phone",
                label: "Phone Number:",
                validation: {
                  required: true,
                  pattern: "^[0-9]{10}$",
                  messages: {
                    required: "Phone Number is required",
                    pattern: "Please enter a valid 10-digit phone number",
                  },
                },
                editor: function (container, options) {
                  var input = $(
                    '<input type="text" required data-required-msg = "Phone number is required" pattern="^[0-9]{10}$" data-pattern-msg="Please enter a valid 10-digit phone number" />'
                  )
                    .appendTo(container)
                    .attr("name", options.field)
                    .kendoTextBox({ placeholder: "Enter your phone number" });
                  input.on("change", function () {
                    formDataStore.personalInfo.phone = $(this).val();
                  });
                },
              },
              {
                field: "gender",
                label: "Gender:",
                editor: function (container, options) {
                  var genderContainer = $(
                    '<div class="role-selection">'
                  ).appendTo(container);

                  var hiddenInput = $(
                    '<input type="hidden" name="gender" required />'
                  ).appendTo(genderContainer);

                  $('<div class="gender-role-option">')
                    .appendTo(genderContainer)
                    .append(
                      '<input type="radio" name="genderRadio" id="male" value="Male" />'
                    )
                    .append('<label for="male">Male</label>')
                    .on("click", function () {
                      hiddenInput.val("Male").trigger("change");
                      formDataStore.personalInfo.gender = "Male";
                    });

                  $('<div class="gender-role-option">')
                    .appendTo(genderContainer)
                    .append(
                      '<input type="radio" name="genderRadio" id="female" value="Female" />'
                    )
                    .append('<label for="female">Female</label>')
                    .on("click", function () {
                      hiddenInput.val("Female").trigger("change");
                      formDataStore.personalInfo.gender = "Female";
                    });

                  $('<div class="gender-role-option">')
                    .appendTo(genderContainer)
                    .append(
                      '<input type="radio" name="genderRadio" id="other" value="Other" />'
                    )
                    .append('<label for="other">Other</label>')
                    .on("click", function () {
                      hiddenInput.val("Other").trigger("change");
                      formDataStore.personalInfo.gender = "Other";
                    });
                },
                validation: {
                  required: true,
                  messages: {
                    required: "Gender is required",
                  },
                },
              },
              {
                field: "dateOfBirth",
                label: "Date of Birth:",
                validation: {
                  required: true,
                  messages: {
                    required: "Date of Birth is required",
                  },
                },
                editor: function (container, options) {
                  var input = $(
                    '<input placeholder="YYYY-MM-DD" required data-required-msg="Date of birth is required"/>'
                  )
                    .appendTo(container)
                    .attr("name", options.field)
                    .kendoDatePicker({
                      format: "yyyy-MM-dd",
                      max: new Date(),
                      change: function () {
                        validateAge(input, container);
                      },
                    });

                  input.on("change", function () {
                    formDataStore.personalInfo.dateOfBirth = $(this).val();
                  });

                  // Function to validate age
                  function validateAge(input, container) {
                    // Remove any existing age error message
                    container.find(".age-error").remove();

                    if (input.val()) {
                      var today = new Date();
                      var birthDate = new Date(input.val());
                      var age = today.getFullYear() - birthDate.getFullYear();
                      var m = today.getMonth() - birthDate.getMonth();
                      if (
                        m < 0 ||
                        (m === 0 && today.getDate() < birthDate.getDate())
                      ) {
                        age--;
                      }

                      // If under 18, show error message
                      if (age < 15) {
                        $(
                          '<span class="k-form-error age-error">You must be at least 15 years old</span>'
                        ).appendTo(container);

                        // Prevent form from proceeding
                        var wizard = $("#wizard").data("kendoWizard");
                        if (wizard) {
                          wizard.enableStep(1, false);
                        }
                        return false;
                      } else {
                        // Enable next step if age is valid
                        var wizard = $("#wizard").data("kendoWizard");
                        if (wizard) {
                          wizard.enableStep(1, true);
                        }
                        return true;
                      }
                    }
                    return true;
                  }

                  // Initial validation
                  setTimeout(function () {
                    if (input.val()) {
                      validateAge(input, container);
                    }
                  }, 100);
                },
              },
              {
                field: "password",
                label: "Password:",
                editor: function (container, options) {
                  var input = $(
                    '<input type="password" name="password" required />'
                  )
                    .appendTo(container)
                    .kendoTextBox({
                      placeholder: "Enter your password",
                      change: function () {
                        formDataStore.personalInfo.password = this.value();
                        // Clear validation when input changes
                        var form = container.closest("form").data("kendoForm");
                        if (form) {
                          form.validateInput(input);
                        }
                      },
                    });

                  // Add pattern attribute for validation
                  input.attr(
                    "pattern",
                    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"
                  );
                  input.attr(
                    "data-pattern-msg",
                    "Password must contain: 8+ chars, 1 uppercase, 1 lowercase, 1 number"
                  );

                  input.on("change", function () {
                    formDataStore.personalInfo.password = $(this).val();
                    // Manually trigger validation
                    var form = container.closest("form").data("kendoForm");
                    if (form) {
                      form.validateInput(input);
                    }
                  });
                },
                validation: {
                  required: true,
                  minLength: 8,
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                  messages: {
                    required: "Password is required",
                    minLength: "Password must be at least 8 characters",
                    pattern:
                      "Must contain: 8+ chars, 1 uppercase, 1 lowercase, 1 number",
                  },
                },
              },
              {
                field: "confirmPassword",
                label: "Confirm Password:",
                editor: function (container, options) {
                  // Create input element
                  var input = $(
                    '<input type="password" required data-required-msg="Confirm Password is required" />'
                  )
                    .appendTo(container)
                    .attr("name", options.field)
                    .kendoTextBox({ placeholder: "Confirm your password" });

                  // Add validation message container
                  $(
                    '<span class="k-invalid-msg" data-for="' +
                      options.field +
                      '"></span>'
                  ).appendTo(container);

                  // Handle change event
                  input.on("change", function () {
                    formDataStore.personalInfo.confirmPassword = $(this).val();
                  });
                },
                validation: {
                  required: true,
                  custom: function (input) {
                    if (input.is("[name=confirmPassword]")) {
                      var password = $("input[name=password]").val();
                      var confirmPassword = input.val();

                      if (password !== confirmPassword) {
                        input.attr("data-custom-msg", "Passwords do not match");
                        return false;
                      }
                    }
                    return true;
                  },
                },
              },
            ],
          },
          content: function () {
            var form = $("<form>").kendoForm({
              formData: {
                role: "user",
                fullName: formDataStore.personalInfo.fullName || "",
                email: formDataStore.personalInfo.email || "",
                phone: formDataStore.personalInfo.phone || "",
                gender: formDataStore.personalInfo.gender || "",
                dateOfBirth: formDataStore.personalInfo.dateOfBirth || null,
                password: formDataStore.personalInfo.password || "",
                confirmPassword:
                  formDataStore.personalInfo.confirmPassword || "",
                acceptTerms: formDataStore.personalInfo.acceptTerms || false,
              },
              items: this.form.items,
              buttonsTemplate: "",
            });

            var buttonContainer = $('<div class="wizard-buttons">').appendTo(
              form
            );
            $('<button type="button" class="reset">Reset</button>')
              .appendTo(buttonContainer)
              .on("click", function () {
                console.log("click");
                var step1Form = wizard
                  .steps()[0]
                  .element.find("form")
                  .data("kendoForm");
                if (step1Form) {
                  step1Form.clear();
                  console.log("clear"); // Clear the Kendo form fields
                  // Manually reset the terms checkbox
                  step1Form.element
                    .find("[name='acceptTerms']")
                    .data("kendoCheckBox")
                    .value(false);
                  formDataStore.personalInfo.acceptTerms = false;
                } else {
                  console.log("form not found");
                }
                formDataStore.personalInfo = { acceptTerms: false };
                emailValid = false;
              });
            $('<button type="button" class="next">Next</button>')
              .appendTo(buttonContainer)
              .on("click", function () {
                var step1Form = wizard
                  .steps()[0]
                  .element.find("form")
                  .data("kendoForm");
                if (step1Form && step1Form.validate()) {
                  if (!formDataStore.personalInfo.acceptTerms) {
                    Swal.fire({
                      icon: "error",
                      title: "Terms Not Accepted",
                      text: "You must accept the terms and conditions to proceed",
                    });
                    return;
                  }
                  if (!emailValid) {
                    form
                      .find("[name='email']")
                      .closest(".k-form-field")
                      .find(".email-error")
                      .remove();
                    form
                      .find("[name='email']")
                      .closest(".k-form-field")
                      .append(
                        '<span class="email-error">Please fix the email validation error</span>'
                      );
                    return;
                  }
                  wizard.select(1);
                }
              });

            return form;
          },
        },
        {
          title: "Details",
          content: function () {
            var formConfig =
              selectedRole === "user"
                ? getUserDetailsConfig()
                : getInstructorDetailsConfig();
            var formData = {
              ...formConfig.formData,
              ...formDataStore.detailsInfo,
            };

            var form = $("<form>").kendoForm({
              formData: formData,
              items: formConfig.items,
              buttonsTemplate: "",
            });

            form.find("[name='height']").on("change", function () {
              formDataStore.detailsInfo.height = $(this).val();
            });
            form.find("[name='weight']").on("change", function () {
              formDataStore.detailsInfo.weight = $(this).val();
            });
            form.find("[name='goal']").on("change", function () {
              formDataStore.detailsInfo.goal = $(this)
                .data("kendoMultiSelect")
                .value();
            });
            form.find("[name='medicalCondition']").on("change", function () {
              formDataStore.detailsInfo.medicalCondition = $(this)
                .data("kendoMultiSelect")
                .value();
            });
            form.find("[name='specialization']").on("change", function () {
              formDataStore.detailsInfo.specialization = $(this)
                .data("kendoMultiSelect")
                .value();
            });
            form.find("[name='association']").on("change", function () {
              formDataStore.detailsInfo.association = $(this).val();
            });
            form.find("[name='certificates']").on("select", function (e) {
              formDataStore.detailsInfo.certificates = e.files;
            });
            form.find("[name='idProof']").on("select", function (e) {
              formDataStore.detailsInfo.idProof = e.files;
            });

            var buttonContainer = $('<div class="wizard-buttons">').appendTo(
              form
            );
            $('<button type="button" class="previous">Previous</button>')
              .appendTo(buttonContainer)
              .on("click", function () {
                wizard.select(0);
              });
            $('<button type="button" class="next">Next</button>')
              .appendTo(buttonContainer)
              .on("click", function () {
                var step2Form = wizard
                  .steps()[1]
                  .element.find("form")
                  .data("kendoForm");
                if (step2Form && step2Form.validate()) {
                  if (selectedRole === "instructor") {
                    if (
                      !formDataStore.detailsInfo.certificates ||
                      formDataStore.detailsInfo.certificates.length === 0
                    ) {
                      form
                        .find("[name='certificates']")
                        .closest(".k-form-field")
                        .find(".k-form-error")
                        .remove();
                      form
                        .find("[name='certificates']")
                        .closest(".k-form-field")
                        .append(
                          '<span class="k-form-error">Please upload at least one professional certificate.</span>'
                        );
                      return;
                    }
                    if (
                      !formDataStore.detailsInfo.idProof ||
                      formDataStore.detailsInfo.idProof.length === 0
                    ) {
                      form
                        .find("[name='idProof']")
                        .closest(".k-form-field")
                        .find(".k-form-error")
                        .remove();
                      form
                        .find("[name='idProof']")
                        .closest(".k-form-field")
                        .append(
                          '<span class="k-form-error">Please upload an ID proof.</span>'
                        );
                      return;
                    }
                  }
                  wizard.select(2);
                }
              });

            if (selectedRole === "user") {
              if (formDataStore.detailsInfo.goal) {
                form
                  .find("[name='goal']")
                  .data("kendoMultiSelect")
                  .value(formDataStore.detailsInfo.goal);
              }
              if (formDataStore.detailsInfo.medicalCondition) {
                form
                  .find("[name='medicalCondition']")
                  .data("kendoMultiSelect")
                  .value(formDataStore.detailsInfo.medicalCondition);
              }
            } else {
              if (formDataStore.detailsInfo.specialization) {
                form
                  .find("[name='specialization']")
                  .data("kendoMultiSelect")
                  .value(formDataStore.detailsInfo.specialization);
              }
            }

            return form;
          },
        },
        {
          title: "Profile Image",
          form: {
            formData: { profileImage: null },
            items: [
              {
                field: "profileImage",
                label: "Upload Profile Picture:",
                editor: "Upload",
                editorOptions: {
                  multiple: false,
                  validation: { allowedExtensions: [".jpg", ".png", ".jpeg"] },
                  showFileList: true,
                  dropZone: ".k-dropzone",
                },
                editor: function (container, options) {
                  var input = $('<input type="file" />')
                    .appendTo(container)
                    .attr("name", options.field)
                    .kendoUpload({
                      multiple: false,
                      validation: {
                        allowedExtensions: [".jpg", ".png", ".jpeg"],
                      },
                      showFileList: true,
                      dropZone: ".k-dropzone",
                      select: function (e) {
                        formDataStore.profileImageInfo.profileImage = e.files;
                      },
                    });
                },
                validation: {
                  required: true,
                  messages: { required: "Profile image is required" },
                },
              },
              {
                field: "acceptTerms",
                label: " ",
                editor: function (container, options) {
                  var input = $(
                    '<input type="checkbox" name="acceptTerms" required />'
                  )
                    .appendTo(container)
                    .kendoCheckBox({
                      label: "I agree to the Terms and Conditions",
                      change: function () {
                        formDataStore.personalInfo.acceptTerms = this.checked();
                      },
                    });

                  // Add terms and conditions link
                  $(
                    '<a class="terms-link" onclick="showTerms()">(View Terms)</a>'
                  ).appendTo(container);
                },
                validation: {
                  required: true,
                  messages: {
                    required: "You must accept the terms and conditions",
                  },
                },
              },
            ],
          },
          content: function () {
            var form = $("<form>").kendoForm({
              formData: this.form.formData,
              items: this.form.items,
            });

            var buttonContainer = $('<div class="wizard-buttons">').appendTo(
              form
            );
            $('<button type="button" class="previous">Previous</button>')
              .appendTo(buttonContainer)
              .on("click", function () {
                wizard.select(1);
              });
            $('<button type="button" id ="abcd"class="next">Submit</button>')
              .appendTo(buttonContainer)
              .on("click", function () {
                var step3Form = wizard
                  .steps()[2]
                  .element.find("form")
                  .data("kendoForm");
                if (step3Form && step3Form.validate()) {
                  wizard.trigger("done");
                }
              });

            return form;
          },
        },
      ],
      done: function (e) {
        e.preventDefault();

        if (!emailValid) {
          alert("Please fix the email validation error before proceeding.");
          return;
        }

        var formData = new FormData();
        formData.append("userName", formDataStore.personalInfo.fullName || "");
        formData.append(
          "instructorName",
          formDataStore.personalInfo.fullName || ""
        );
        formData.append("email", formDataStore.personalInfo.email || "");
        formData.append("password", formDataStore.personalInfo.password || "");
        formData.append(
          "confirmPassword",
          formDataStore.personalInfo.confirmPassword || ""
        );
        formData.append("mobile", formDataStore.personalInfo.phone || "");
        formData.append("gender", formDataStore.personalInfo.gender || "Male");
        formData.append("dob", formDataStore.personalInfo.dateOfBirth || "");
        formData.append("activationToken", generateActivationToken());
        formData.append(
          "status",
          selectedRole === "user" ? "false" : "pending"
        );

        if (selectedRole === "user") {
          formData.append("height", formDataStore.detailsInfo.height || "");
          formData.append("weight", formDataStore.detailsInfo.weight || "");
          formData.append(
            "goal",
            formDataStore.detailsInfo.goal
              ? formDataStore.detailsInfo.goal.join(", ")
              : ""
          );
          formData.append(
            "medicalCondition",
            formDataStore.detailsInfo.medicalCondition
              ? formDataStore.detailsInfo.medicalCondition.join(", ")
              : ""
          );
        } else {
          formData.append(
            "specialization",
            formDataStore.detailsInfo.specialization
              ? formDataStore.detailsInfo.specialization.join(", ")
              : ""
          );
          formData.append(
            "association",
            formDataStore.detailsInfo.association || ""
          );
          if (
            formDataStore.detailsInfo.certificates &&
            formDataStore.detailsInfo.certificates.length > 0
          ) {
            for (
              var i = 0;
              i < formDataStore.detailsInfo.certificates.length;
              i++
            ) {
              formData.append(
                "certificateFiles",
                formDataStore.detailsInfo.certificates[i].rawFile
              );
            }
          } else {
            alert("Professional Certificates are required for instructors.");
            return;
          }
          if (
            formDataStore.detailsInfo.idProof &&
            formDataStore.detailsInfo.idProof.length > 0
          ) {
            formData.append(
              "idProofFile",
              formDataStore.detailsInfo.idProof[0].rawFile
            );
          } else {
            alert("ID Proof is required for instructors.");
            return;
          }
        }

        if (
          formDataStore.profileImageInfo.profileImage &&
          formDataStore.profileImageInfo.profileImage.length > 0
        ) {
          formData.append(
            "profileImageFile",
            formDataStore.profileImageInfo.profileImage[0].rawFile
          );
        } else {
          alert("Profile image is required.");
          return;
        }

        console.log(...formData.entries());

        var url =
          selectedRole === "user"
            ? "http://localhost:8080/api/AuthApi/register-user"
            : "http://localhost:8080/api/AuthApi/register-instructor";

        $.ajax({
          url: url,
          type: "POST",
          data: formData,
          processData: false,
          contentType: false,
          success: function (response) {
            if (response.success) {
              Swal.fire({
                icon: "success",
                title: "Registration Successful ",
                text: response.message,
              }).then(() => {
                window.location.href = "./Login";
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: response.message,
              });
            }
          },
          error: function (xhr, status, error) {
            const errorMessage = xhr.responseJSON?.message || "Registration Failed";
            Swal.fire({
              icon: "error",
              title: "Registration Failed",
              text: errorMessage,
            });
          },
        });
      },
    })
    .data("kendoWizard");

  wizard.wrapper.on("change", "input[name='role']", function () {
    selectedRole = $(this).val();
    formDataStore.personalInfo.role = selectedRole;
    formDataStore.detailsInfo = {};
    wizard.refresh();
  });

  wizard.bind("activate", function (e) {
    if (e.step.options.title === "Details") {
      var stepElement = e.step.element;
      stepElement.empty();
      var formConfig =
        selectedRole === "user"
          ? getUserDetailsConfig()
          : getInstructorDetailsConfig();
      var formData = {
        ...formConfig.formData,
        ...formDataStore.detailsInfo,
      };

      var form = $("<form>").kendoForm({
        formData: formData,
        items: formConfig.items,
        buttonsTemplate: "",
      });

      form.find("[name='height']").on("change", function () {
        formDataStore.detailsInfo.height = $(this).val();
      });
      form.find("[name='weight']").on("change", function () {
        formDataStore.detailsInfo.weight = $(this).val();
      });
      form.find("[name='goal']").on("change", function () {
        formDataStore.detailsInfo.goal = $(this)
          .data("kendoMultiSelect")
          .value();
      });
      form.find("[name='medicalCondition']").on("change", function () {
        formDataStore.detailsInfo.medicalCondition = $(this)
          .data("kendoMultiSelect")
          .value();
      });
      form.find("[name='specialization']").on("change", function () {
        formDataStore.detailsInfo.specialization = $(this)
          .data("kendoMultiSelect")
          .value();
      });
      form.find("[name='association']").on("change", function () {
        formDataStore.detailsInfo.association = $(this).val();
      });
      form.find("[name='certificates']").on("select", function (e) {
        formDataStore.detailsInfo.certificates = e.files;
      });
      form.find("[name='idProof']").on("select", function (e) {
        formDataStore.detailsInfo.idProof = e.files;
      });

      var buttonContainer = $('<div class="wizard-buttons">').appendTo(form);
      $('<button type="button" class="previous">Previous</button>')
        .appendTo(buttonContainer)
        .on("click", function () {
          wizard.select(0);
        });
      $('<button type="button" class="next">Next</button>')
        .appendTo(buttonContainer)
        .on("click", function () {
          var step2Form = wizard
            .steps()[1]
            .element.find("form")
            .data("kendoForm");
          if (step2Form && step2Form.validate()) {
            if (selectedRole === "instructor") {
              if (
                !formDataStore.detailsInfo.certificates ||
                formDataStore.detailsInfo.certificates.length === 0
              ) {
                form
                  .find("[name='certificates']")
                  .closest(".k-form-field")
                  .find(".k-form-error")
                  .remove();
                form
                  .find("[name='certificates']")
                  .closest(".k-form-field")
                  .append(
                    '<span class="k-form-error">Please upload at least one professional certificate.</span>'
                  );
                return;
              }
              if (
                !formDataStore.detailsInfo.idProof ||
                formDataStore.detailsInfo.idProof.length === 0
              ) {
                form
                  .find("[name='idProof']")
                  .closest(".k-form-field")
                  .find(".k-form-error")
                  .remove();
                form
                  .find("[name='idProof']")
                  .closest(".k-form-field")
                  .append(
                    '<span class="k-form-error">Please upload an ID proof.</span>'
                  );
                return;
              }
            }
            wizard.select(2);
          }
        });

      if (selectedRole === "user") {
        if (formDataStore.detailsInfo.goal) {
          form
            .find("[name='goal']")
            .data("kendoMultiSelect")
            .value(formDataStore.detailsInfo.goal);
        }
        if (formDataStore.detailsInfo.medicalCondition) {
          form
            .find("[name='medicalCondition']")
            .data("kendoMultiSelect")
            .value(formDataStore.detailsInfo.medicalCondition);
        }
      } else {
        if (formDataStore.detailsInfo.specialization) {
          form
            .find("[name='specialization']")
            .data("kendoMultiSelect")
            .value(formDataStore.detailsInfo.specialization);
        }
      }

      stepElement.append(form);
    }
  });
});
