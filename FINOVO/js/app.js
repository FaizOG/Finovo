/**
 * MOBILE SIDEBAR CONTROLLER
 * Handles:
 * - Opening sidebar via hamburger
 * - Closing sidebar on outside click
 * - Closing sidebar when a nav tab is clicked
 */

function initMobileSidebar() {
  const sidebar = document.querySelector("aside");
  const hamburger = document.querySelector(".hamburger-menu");
  const navItems = document.querySelectorAll(".nav-item");

  // safety check
  if (!sidebar || !hamburger) return;

  /**
   * OPEN / CLOSE SIDEBAR
   * Toggles sidebar visibility on mobile
   */
  function toggleSidebar() {
    sidebar.classList.toggle("open");
  }

  /**
   * CLOSE SIDEBAR
   * Removes "open" class
   */
  function closeSidebar() {
    sidebar.classList.remove("open");
  }

  /**
   * EVENT: Hamburger click
   * Opens or closes sidebar
   */
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation(); // prevents triggering outside click logic
    toggleSidebar();
  });

  /**
   * EVENT: Click on nav item
   * Closes sidebar after selecting a tab
   */
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      closeSidebar();
    });
  });

  /**
   * EVENT: Click outside sidebar
   * Closes sidebar when user clicks anywhere outside
   */
  document.addEventListener("click", (e) => {
    const clickedInsideSidebar = sidebar.contains(e.target);
    const clickedHamburger = hamburger.contains(e.target);

    if (!clickedInsideSidebar && !clickedHamburger) {
      closeSidebar();
    }
  });
}

/**
 * INIT
 * Starts the sidebar behavior after DOM loads
 */
document.addEventListener("DOMContentLoaded", initMobileSidebar);




const themeBtn = document.querySelector(".screen-mode-btn");

const savedTheme = localStorage.getItem("theme");

/*
Default = DARK
Only add .light when user chooses light mode
*/

if (savedTheme === "light") {
    document.body.classList.add("light");
}

updateThemeIcon();

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light")
            ? "light"
            : "dark"
    );

    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = document.querySelector(".screen-mode-btn svg");

    if (document.body.classList.contains("light")) {
        icon.innerHTML = `
            <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path>
        `;
    } else {
        icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun size-4" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
        `;
    }
}