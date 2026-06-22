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

  document.querySelectorAll(".asidebar-tab")
    .forEach(tab => tab.classList.remove("asidebar-active"));

  const activeTab = document.querySelector(`[data-page="${page}"] .asidebar-tab`);
  if (activeTab) activeTab.classList.add("asidebar-active");

  try {
    // exit animation
    await gsap.to(content, {
      opacity: 0,
      y: 10,
      duration: 0.4,
      ease: "power2.inout"
    });

    content.innerHTML = "";

    const module = await pages[page]();

    let pageElement;

    // ✅ CASE 1: render() returns DOM
    if (typeof module.render === "function") {
      pageElement = module.render();
      content.appendChild(pageElement);

    // ✅ CASE 2: default export function
    } else if (typeof module.default === "function") {
      pageElement = module.default();
      content.appendChild(pageElement);

    // ✅ CASE 3: default with mount(container)
    } else if (module.default?.mount) {
      module.default.mount(content);
      pageElement = content;

    } else {
      throw new Error(`Invalid export in page: ${page}`);
    }

    // entry animation
    gsap.fromTo(content,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
    );

  } catch (err) {
    console.error("Failed to load page:", page, err);

    content.innerHTML = `<h2>Failed to load page</h2>`;

    gsap.fromTo(content,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    );
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