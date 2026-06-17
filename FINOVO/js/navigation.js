// navigation.js

const pages = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  budgets: "Budgets",
  analytics: "Analytics",
  goals: "Goals",
  accounts: "Accounts",
  settings: "Settings"
};

// Load page content + highlight active tab
function loadPage(page) {
  const content = document.getElementById("page-content");

  // remove active class from all tabs
  document.querySelectorAll(".asidebar-tab")
    .forEach(tab => tab.classList.remove("asidebar-active"));

  // add active class to selected tab
  const activeTab = document.querySelector(
    `[data-page="${page}"] .asidebar-tab`
  );

  if (activeTab) {
    activeTab.classList.add("asidebar-active");
  }

  // update page content
  content.innerHTML = `
    <h1>${pages[page]}</h1>
    <p>${pages[page]} page content</p>
  `;
}

// Initialize sidebar click events
function initNavigation() {
  const items = document.querySelectorAll(".nav-item");

  items.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      const page = item.dataset.page;
      loadPage(page);
    });
  });

  // default page load
  loadPage("dashboard");
}

initNavigation();