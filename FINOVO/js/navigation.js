// navigation.js
import { updateSidebarBalance } from "../js/core/sidebar.utils.js";

let currentPage = "dashboard";

const pages = {
  dashboard: () => import("../pages/dashboard.js"),
  transactions: () => import("../pages/transactions.js"),
  budgets: () => import("../pages/budgets.js"),
  analytics: () => import("../pages/analytics.js"),
  goals: () => import("../pages/goals.js"),
  accounts: () => import("../pages/accounts.js"),
  settings: () => import("../pages/settings.js"),
};

async function loadPage(page) {
  currentPage = page;

  const content = document.getElementById("page-content");

  if (!content) {
    console.error("page-content container not found");
    return;
  }

  document
    .querySelectorAll(".asidebar-tab")
    .forEach((tab) => tab.classList.remove("asidebar-active"));

  const activeTab = document.querySelector(
    `[data-page="${page}"] .asidebar-tab`,
  );
  if (activeTab) activeTab.classList.add("asidebar-active");

  try {
    await gsap.to(content, {
      opacity: 0,
      y: 10,
      duration: 0.4,
      ease: "power2.inout",
    });

    content.innerHTML = "";

    const module = await pages[page]();

    let pageElement;

    if (typeof module.render === "function") {
      pageElement = module.render();
      content.appendChild(pageElement);
    } else if (typeof module.default === "function") {
      pageElement = module.default();
      content.appendChild(pageElement);
    } else if (module.default?.mount) {
      module.default.mount(content);
      pageElement = content;
    } else {
      throw new Error(`Invalid export in page: ${page}`);
    }

    gsap.fromTo(
      content,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
    );
  } catch (err) {
    console.error("Failed to load page:", page, err);

    content.innerHTML = `<h2>Failed to load page</h2>`;

    gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  }
}

function animateTabIcon(tab, page) {
  const svg = tab.querySelector("svg");
  if (!svg) return;

  gsap.killTweensOf(svg);

  const reset = {
    clearProps: "transform",
    transformOrigin: "50% 50%",
  };

  switch (page) {
    case "dashboard":
      gsap.fromTo(
        svg,
        { x: -2, y: -2, rotation: -2 },
        {
          x: 2,
          y: 2,
          rotation: 2,
          duration: 0.08,
          repeat: 8,
          yoyo: true,
          ease: "none",
          ...reset,
        },
      );
      break;

    case "transactions":
      gsap.fromTo(
        svg.querySelectorAll("path"),
        { x: -6 },
        {
          x: 6,
          duration: 0.15,
          stagger: 0.05,
          repeat: 4,
          yoyo: true,
          ease: "power1.inOut",
          ...reset,
        },
      );
      break;

    case "budgets":
      gsap.fromTo(
        svg,
        { scale: 1 },
        {
          scale: 1.08,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "back.out(2)",
          ...reset,
        },
      );

      gsap.fromTo(
        svg,
        { y: 0 },
        {
          y: -4,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        },
      );
      break;

    case "analytics":
      gsap.fromTo(
        svg,
        { scaleY: 1 },
        {
          scaleY: 1.25,
          transformOrigin: "bottom",
          duration: 0.15,
          repeat: 6,
          yoyo: true,
          ease: "power1.inOut",
          ...reset,
        },
      );
      break;

    case "goals":
      gsap.fromTo(
        svg,
        { scale: 1 },
        {
          scale: 1.25,
          duration: 0.12,
          repeat: 4,
          yoyo: true,
          ease: "power2.inOut",
          ...reset,
        },
      );
      break;

    case "accounts":
      gsap.fromTo(
        svg,
        { scale: 1 },
        {
          scale: 1.18,
          duration: 0.12,
          repeat: 5,
          yoyo: true,
          ease: "sine.inOut",
          ...reset,
        },
      );
      break;

    case "settings":
      gsap.fromTo(
        svg,
        { rotate: 0 },
        {
          rotate: 360,
          duration: 1,
          ease: "power2.inOut",
          ...reset,
        },
      );
      break;
  }
}

function initNavigation() {
  updateSidebarBalance();

  const items = document.querySelectorAll(".nav-item");

  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      const page = item.dataset.page;

      if (!page) return;

      const tab = item.querySelector(".asidebar-tab");

      animateTabIcon(tab, page);

      loadPage(page);
    });
  });

  loadPage("dashboard");
}

// run on load
initNavigation();
window.addEventListener("appDataUpdated", () => {
  updateSidebarBalance();

  // refresh only the current page if needed
  window.dispatchEvent(
    new CustomEvent("pageDataUpdated", {
      detail: currentPage,
    }),
  );
});

window.addEventListener("navigate", (e) => {
  loadPage(e.detail);
});
