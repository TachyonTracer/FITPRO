// const themes = [
//     {
//         background: "#1A1A2E",
//         color: "#FFFFFF",
//         primaryColor: "#FF4D4D",
//         glassColor: "rgba(255, 255, 255, 0.1)"
//     },
//     {
//         background: "#2C2C2C",
//         color: "#FFFFFF",
//         primaryColor: "#FFD700",
//         glassColor: "rgba(255, 255, 255, 0.1)"
//     },
//     {
//         background: "#3A3A3A",
//         color: "#FFFFFF",
//         primaryColor: "#00C4B4",
//         glassColor: "rgba(255, 255, 255, 0.1)"
//     },
//     {
//         background: "#FF4D4D",
//         color: "#FFFFFF",
//         primaryColor: "#1A1A2E",
//         glassColor: "rgba(255, 255, 255, 0.1)"
//     },
//     {
//         background: "#FFD700",
//         color: "#1A1A2E",
//         primaryColor: "#2C2C2C",
//         glassColor: "rgba(0, 0, 0, 0.1)"
//     },
//     {
//         background: "#00C4B4",
//         color: "#FFFFFF",
//         primaryColor: "#FF4D4D",
//         glassColor: "rgba(255, 255, 255, 0.1)"
//     }
// ];

// const setTheme = (theme) => {
//     const root = document.querySelector(":root");
//     const illustration = document.querySelector(".illustration");

//     root.style.setProperty("--background", theme.background);
//     root.style.setProperty("--color", theme.color);
//     root.style.setProperty("--primary-color", theme.primaryColor);
//     root.style.setProperty("--glass-color", theme.glassColor);

//     // if (theme.color !== "#FFFFFF") {
//     //     // illustration.style.background = "rgba(255, 255, 255, 0.3)";
//     //     illustration.style.borderRadius = "15px";
//     //     illustration.style.padding = "8px";
//     // } else {
//     //     // illustration.style.background = "none";
//     //     illustration.style.padding = "0";
//     // }

//     // Update gym icon stroke color to match the theme's text color
//     const gymIcons = document.querySelectorAll(".gym-icon");
//     gymIcons.forEach(icon => {
//         icon.style.backgroundImage = icon.style.backgroundImage.replace(/stroke="[^"]*"/, stroke = "${theme.color}");
//     });
// };

// const displayThemeButtons = () => {
//     const btnContainer = document.querySelector(".theme-btn-container");
//     themes.forEach((theme, index) => {
//         const div = document.createElement("div");
//         div.className = "theme-btn";
//         div.style.background = theme.background;
//         div.setAttribute("role", "radio");
//         div.setAttribute("aria-checked", index === 0 ? "true" : "false");
//         div.setAttribute("tabindex", "0");
//         btnContainer.appendChild(div);

//         div.addEventListener("click", () => {
//             setTheme(theme);
//             document.querySelectorAll(".theme-btn").forEach(btn => btn.setAttribute("aria-checked", "false"));
//             div.setAttribute("aria-checked", "true");
//         });

//         div.addEventListener("keydown", (e) => {
//             if (e.key === "Enter" || e.key === " ") {
//                 e.preventDefault();
//                 div.click();
//             }
//         });
//     });
// };

// displayThemeButtons();