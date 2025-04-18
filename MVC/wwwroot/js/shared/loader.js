class LoaderManager {
  constructor() {
    this.loaderHTML = `
            <div class="loader-wrapper">
                <div class="loader-container">
                    <div class="loader-ring">
                        <div class="outer-ring"></div>
                        <div class="inner-ring"></div>
                        <div class="progress-ring"></div>
                        <div class="inner-progress"></div>
                        <span class="material-symbols-outlined center-icon">exercise</span>
                    </div>
                    <div class="loading-text">
                        LOADING
                        <span class="dot-animation">
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                        </span>
                    </div>
                </div>
            </div>`;

    this.init();
  }

  init() {
    // Add required fonts if not already present
    if (!document.querySelector('link[href*="Material+Symbols+Outlined"]')) {
      const fontLinks = `
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=exercise">
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700&display=swap" rel="stylesheet">`;
      document.head.insertAdjacentHTML("beforeend", fontLinks);
    }

    // Create loader element if it doesn't exist
    if (!this.loaderElement) {
      this.loaderElement = document.createElement("div");
      this.loaderElement.className = "loader-overlay";
      this.loaderElement.innerHTML = this.loaderHTML;
      document.body.appendChild(this.loaderElement);
    }
  }

  show() {
    document.body.style.overflow = "hidden"; // Prevent scrolling while loading
    this.loaderElement.style.display = "flex";
  }

  hide() {
    document.body.style.overflow = ""; // Restore scrolling
    this.loaderElement.style.display = "none";
  }
}
