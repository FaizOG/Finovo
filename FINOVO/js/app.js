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