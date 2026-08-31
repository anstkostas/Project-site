/** 
 * Position nav elements based on device screen size.
 * 
*/ 

// Categorize devices.
let device = window.innerWidth >= 601 ? "laptop" : "mobile";

const setMobileUi = function (e) {
  // A checkpoint for the resize event
  if (e.type === "resize") {
    // If resize event doesn't include 601px size then no change should happen.
    if (window.innerWidth >= 601 && device === "laptop") return;
    if (window.innerWidth < 601 && device === "mobile") return;
  }

  device = window.innerWidth >= 601 ? "laptop" : "mobile";

  const dataThemeToggleCont = document.querySelector(".data-theme-toggle");

  // Place themeToggleCont(theme-btn) accordingly.
  if (device === "laptop") {
    document.querySelector(".menu-container").appendChild(dataThemeToggleCont);
  } else {
    document
      .querySelector(".mobile-1st-line-container")
      .appendChild(dataThemeToggleCont);
  }
};

window.addEventListener("load", setMobileUi);
window.addEventListener("resize", setMobileUi);
