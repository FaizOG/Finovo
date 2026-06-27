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

  if (!sidebar || !hamburger) return;

  // ONLY small mobile
  function isSmallMobile() {
    return window.matchMedia("(max-width: 1023px)").matches;
  }

  let isOpen = false;

  // initial state (ONLY mobile)
  if (isSmallMobile()) {
    gsap.set(sidebar, { x: "-100%" });
  }

  function openSidebar() {
    if (!isSmallMobile()) return;

    isOpen = true;

    gsap.to(sidebar, {
      x: "0%",
      duration: 0.6,
      ease: "power3.out"
    });

    gsap.fromTo(
      ".asidebar-tab",
      { x: -12, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.4,
        delay: 0.1
      }
    );
  }

  function closeSidebar() {
    if (!isSmallMobile()) return;

    isOpen = false;

    gsap.to(sidebar, {
      x: "-100%",
      duration: 0.5,
      ease: "power3.in"
    });
  }

  function toggleSidebar() {
    if (!isSmallMobile()) return;

    isOpen ? closeSidebar() : openSidebar();
  }

  // hamburger click
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSidebar();
  });

  // close on nav click
  navItems.forEach((item) => {
    item.addEventListener("click", closeSidebar);
  });

  // click outside closes sidebar
  document.addEventListener("click", (e) => {
    if (!isOpen) return;

    const clickedInside = sidebar.contains(e.target);
    const clickedHamburger = hamburger.contains(e.target);

    if (!clickedInside && !clickedHamburger) {
      closeSidebar();
    }
  });

  // handle resize (prevents bugs)
  window.addEventListener("resize", () => {
    if (!isSmallMobile()) {
      gsap.set(sidebar, { clearProps: "transform" });
      isOpen = false;
    } else {
      gsap.set(sidebar, { x: "-100%" });
    }
  });
}

document.addEventListener("DOMContentLoaded", initMobileSidebar);

/**
 * INIT
 * Starts the sidebar behavior after DOM loads
 */
document.addEventListener("DOMContentLoaded", initMobileSidebar);




// const themeBtn = document.querySelector(".screen-mode-btn");

// const savedTheme = localStorage.getItem("theme");

/*
Default = DARK
Only add .light when user chooses light mode
*/

// if (savedTheme === "light") {
//   document.body.classList.add("light");
// }

// updateThemeIcon();

// themeBtn.addEventListener("click", () => {
//   document.body.classList.toggle("light");

//   localStorage.setItem(
//     "theme",
//     document.body.classList.contains("light")
//       ? "light"
//       : "dark"
//   );

//   updateThemeIcon();
// });

// function updateThemeIcon() {
//   const icon = document.querySelector(".screen-mode-btn svg");

//   if (document.body.classList.contains("light")) {
//     icon.innerHTML = `
//             <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path>
//         `;
//   } else {
//     icon.innerHTML = `
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun size-4" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
//         `;
//   }
// }


import { getData, updateData } from "../js/core/store.js";

function initHeaderThemeToggle() {
  const themeBtn = document.querySelector(".screen-mode-btn");

  if (!themeBtn) return;

  // apply theme on load
  syncThemeFromStore();

  // click toggle
  themeBtn.addEventListener("click", () => {
    toggleTheme();
  });

  // listen for external changes (settings page)
  window.addEventListener("theme-change", syncThemeFromStore);
}

/**
 * Toggle theme from header
 */
function toggleTheme() {
  const data = getData();

  const newTheme =
    data.settings.theme === "light" ? "dark" : "light";

  updateData({
    settings: {
      theme: newTheme
    }
  });

  applyTheme(newTheme);

  // 🔥 notify other pages (settings sync)
  window.dispatchEvent(new Event("theme-change"));
}

/**
 * Apply theme to DOM
 */
function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }

  updateThemeIcon();
}

/**
 * Sync from storage (single source of truth)
 */
function syncThemeFromStore() {
  const data = getData();

  const theme = data.settings.theme || "dark";

  applyTheme(theme);
}

/**
 * Update header icon safely
 */
function updateThemeIcon() {
  const icon = document.querySelector(".screen-mode-btn svg");

  if (!icon) return;

  const isLight = document.body.classList.contains("light");

  if (isLight) {
    icon.innerHTML = `
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path>
    `;
  } else {
    icon.innerHTML = `
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
    `;
  }
}

initHeaderThemeToggle();