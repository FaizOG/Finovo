// // navigation.js

// const pages = {
//   dashboard: "Dashboard",
//   transactions: "Transactions",
//   budgets: "Budgets",
//   analytics: "Analytics",
//   goals: "Goals",
//   accounts: "Accounts",
//   settings: "Settings"
// };

// // Load page content + highlight active tab
// function loadPage(page) {
//   const content = document.getElementById("page-content");

//   // remove active class from all tabs
//   document.querySelectorAll(".asidebar-tab")
//     .forEach(tab => tab.classList.remove("asidebar-active"));

//   // add active class to selected tab
//   const activeTab = document.querySelector(
//     `[data-page="${page}"] .asidebar-tab`
//   );

//   if (activeTab) {
//     activeTab.classList.add("asidebar-active");
//   }

//   // update page content
//   content.innerHTML = `
//     <h1>${pages[page]}</h1>
//     <p>${pages[page]} page content</p>
//   `;
// }

// // Initialize sidebar click events
// function initNavigation() {
//   const items = document.querySelectorAll(".nav-item");

//   items.forEach(item => {
//     item.addEventListener("click", (e) => {
//       e.preventDefault();

//       const page = item.dataset.page;
//       loadPage(page);
//     });
//   });

//   // default page load
//   loadPage("dashboard");
// }

// initNavigation();



// navigation.js

const pages = {
  dashboard: () => import("../pages/dashboard.js"),
  transactions: () => import("../pages/transactions.js"),
  budgets: () => import("../pages/budgets.js"),
  analytics: () => import("../pages/analytics.js"),
  goals: () => import("../pages/goals.js"),
  accounts: () => import("../pages/accounts.js"),
  settings: () => import("../pages/settings.js")
};

// Load and render page
async function loadPage(page) {
  const content = document.getElementById("page-content");

  if (!content) {
    console.error("page-content container not found");
    return;
  }

  // update active sidebar UI
  document.querySelectorAll(".asidebar-tab")
    .forEach(tab => tab.classList.remove("asidebar-active"));

  const activeTab = document.querySelector(`[data-page="${page}"] .asidebar-tab`);
  if (activeTab) {
    activeTab.classList.add("asidebar-active");
  }

  try {
    // dynamic import
    const module = await pages[page]();

    // clear previous content
    content.innerHTML = "";

    // support either:
    // 1) export function renderX()
    // 2) default export with mount()
    if (typeof module.render === "function") {
      content.appendChild(module.render());
    } else if (module.default?.mount) {
      module.default.mount(content);
    } else {
      console.error(`Page "${page}" has no valid export`);
    }

  } catch (err) {
    console.error("Failed to load page:", page, err);
    content.innerHTML = `<h2>Failed to load page</h2>`;
  }
}

// Initialize navigation
function initNavigation() {
  const items = document.querySelectorAll(".nav-item");

  items.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      const page = item.dataset.page;
      if (page) {
        loadPage(page);
      }
    });
  });

  // default page
  loadPage("dashboard");
}

// run on load
initNavigation();