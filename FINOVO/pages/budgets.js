import { getData, updateData, changedSymbol } from "../js/core/store.js";

let budgetListSection = null;
let editingBudgetId = null;

function createBudgetHeader() {
  const section = document.createElement("section");

  section.innerHTML = `
      <h2 class="setting-tab-title">
        Budgets
      </h2>

      <p class="setting-tab-subtitle">
        Manage your spending limits
      </p>
    `;

  return section;
}

function createBudgetOverview() {
  const overallBudget = getBudgets().find(
    (budget) => budget.category === "Overall",
  );

  if (!overallBudget) {
    const section = document.createElement("section");

    section.innerHTML = `
      <div class="budget-overview-card">

        <div class="budget-overview-header">

          <div class="budget-overview-main">

            <div class="budget-overview-label">
              Overall Monthly Cap
            </div>

            <div class="budget-overview-amount">
              No budget set
            </div>

          </div>

        </div>

      </div>
    `;

    return section;
  }

  const overallSpent = getOverallSpent();

  const overallPercent =
    overallBudget.limit > 0
      ? Math.min((overallSpent / overallBudget.limit) * 100, 100)
      : 0;

  const overallProgressColor = getBudgetProgressColor(overallPercent);
  const isOverallOverspent = overallSpent > overallBudget.limit;

  const overallOverspentAmount = overallSpent - overallBudget.limit;

  const section = document.createElement("section");
  if (isOverallOverspent) {
    section.classList.add("budget-over-limit");
  }

  section.innerHTML = `
      <div class="budget-overview-card">

        <div class="budget-overview-header">

          <div class="budget-overview-main">

            <div class="budget-overview-label">
  Overall Monthly Cap

  ${
    isOverallOverspent
      ? `
      <span class="budget-warning">
        • Budget exceeded by
        <span>
          ${changedSymbol()}${overallOverspentAmount.toFixed(2)}
        </span>
      </span>
      `
      : ""
  }
</div>

            <div class="budget-overview-amount">
              ${changedSymbol()}${getOverallSpent().toFixed(2)}

              <span class="budget-overview-limit">
                of ${changedSymbol()}${overallBudget.limit.toFixed(2)}
              </span>
            </div>

          </div>

          <div class="budget-overview-actions">

    <div class="budget-overview-edit" title="Edit budget">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-pencil size-3.5"
      aria-hidden="true"
    >
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
      <path d="m15 5 4 4"></path>
    </svg>
  </div>


  <div class="budget-overview-delete category-budget-delete" title="Delete budget">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 size-3.5" aria-hidden="true"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
  </div>

  </div>
        </div>

        <div class="budget-progress">

          <div
    class="budget-progress-fill"
    style="
      width:${overallPercent}%;
      background:${overallProgressColor};
    "
  ></div>

        </div>

      </div>
    `;

  // Add the event listener here
  section
    .querySelector(".budget-overview-edit")
    .addEventListener("click", () => {
      editBudget(overallBudget.id);
    });

  section
    .querySelector(".budget-overview-delete")
    .addEventListener("click", () => {
      const confirmDelete = confirm("Delete Overall Monthly Cap?");

      if (!confirmDelete) return;

      const budgets = getBudgets().filter(
        (item) => item.category !== "Overall",
      );

      updateData({
        budgets,
      });

      refreshBudgetsUI();
    });

  return section;
}

function getOverallSpent() {
  const transactions = getData()?.transaction || [];

  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions
    .filter((transaction) => {
      if (transaction.type !== "expense") return false;

      const date = new Date(transaction.date);

      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    })
    .reduce((total, transaction) => {
      return total + Number(transaction.amount || 0);
    }, 0);
}

function getBudgets() {
  const budgets = getData()?.budgets || [];

  const cleaned = [];
  const categories = new Set();

  budgets.forEach((budget) => {
    const category = budget.category.trim();

    if (!categories.has(category)) {
      categories.add(category);

      cleaned.push({
        ...budget,
        category,
      });
    }
  });

  return cleaned;
}

function getBudgetSpent(category) {
  const transactions = getData()?.transaction || [];

  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions
    .filter((transaction) => {
      if (transaction.type !== "expense") return false;

      if (transaction.category !== category) return false;

      const transactionDate = new Date(transaction.date);

      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    })
    .reduce((total, transaction) => {
      return total + Number(transaction.amount || 0);
    }, 0);
}

function createCategoryBudgetCard({ id, category, limit }) {
  const card = document.createElement("div");

  card.className = "category-budget-card";

  const spent = getBudgetSpent(category);

  const rawPercent = limit > 0 ? (spent / limit) * 100 : 0;

  const percent = Math.min(rawPercent, 100);

  const progressColor = getBudgetProgressColor(percent);

  const isOverspent = spent > limit;

  const overspentAmount = spent - limit;

  card.dataset.id = id;

  if (isOverspent) {
    card.classList.add("budget-over-limit");
  }

  card.innerHTML = `

      <div class="category-budget-header">

        <div class="category-budget-name">
  ${category}

  ${
    isOverspent
      ? `
      <span class="budget-warning">
        • Budget is over spendy by 
        <span>
          ${changedSymbol()}${overspentAmount.toFixed(2)}
        </span>
      </span>
      `
      : ""
  }
</div>


        <div class="category-budget-actions">

          <span class="category-budget-amount">

            ${changedSymbol()}${spent.toFixed(2)}
            /
            ${changedSymbol()}${limit.toFixed(2)}

          </span>


          <div class="category-budget-edit" title="Edit budget">

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-pencil size-3.5"
      aria-hidden="true"
    >
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
      <path d="m15 5 4 4"></path>
    </svg>

  </div>


  <div class="category-budget-delete" title="Delete budget">

    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 size-3.5" aria-hidden="true"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>

  </div>


        </div>


      </div>

      <div class="category-budget-progress">

        <div
    class="category-budget-progress-fill"
    style="
      width:${percent}%;
      background:${progressColor};
    "
  ></div>

      </div>

    `;

  card.querySelector(".category-budget-edit").addEventListener("click", () => {
    editBudget(id);
  });

  card
    .querySelector(".category-budget-delete")
    .addEventListener("click", () => {
      const confirmDelete = confirm(`Delete ${category} budget?`);

      if (!confirmDelete) return;

      const budgets = getBudgets().filter((item) => item.id !== id);

      updateData({
        budgets,
      });

      refreshBudgetsUI();
    });

  return card;
}

function createBudgetsList() {
  const section = document.createElement("section");

  section.className = "budgets-card budgets-list-card";

  section.innerHTML = `
      <h2 class="budgets-title">
        Category Budgets
      </h2>
    `;

  budgetListSection = section;

  renderBudgets(section);

  return section;
}

function renderBudgets(section) {
  const budgets = getBudgets().filter(
    (budget) => budget.category?.trim() !== "Overall",
  );

  budgets.forEach((budget) => {
    section.appendChild(createCategoryBudgetCard(budget));
  });
}

function createBudgetForm() {
  const section = document.createElement("section");

  section.className = "budgets-card budgets-form-card";

  section.innerHTML = `

      <h2 class="budgets-title">
        <span class="budget-form-title">
          New Budget
        </span>
      </h2>


      <div class="budget-field">

        <label class="budget-label">
          Category
        </label>

        <div class="budget-dropdown-container"></div>

      </div>


      <div class="budget-field">

        <label class="budget-label">
          Monthly Amount
        </label>

        <input
          class="budget-input"
          type="number"
          placeholder="0.00"
        />

      </div>


      <button class="budget-submit">
        Save Budget
      </button>


      <button class="budget-cancel-edit">
        Cancel Edit
      </button>


      <p class="budget-helper">
        Existing budgets for the same category are replaced.
      </p>

    `;

  section
    .querySelector(".budget-dropdown-container")
    .appendChild(createBudgetCategoryDropdown());

  section
    .querySelector(".budget-submit")
    .addEventListener("click", () => saveBudget(section));

  const cancelButton = section.querySelector(".budget-cancel-edit");

  cancelButton.style.display = editingBudgetId ? "block" : "none";

  cancelButton.addEventListener("click", () => {
    editingBudgetId = null;

    refreshBudgetsUI();
  });

  return section;
}

function saveBudget(section) {
  const category = section
    .querySelector(".budget-category-selected")
    .textContent.trim();

  const input = section.querySelector(".budget-input");

  const amount = Number(input.value);

  if (!amount || amount <= 0) return;

  let budgets = getBudgets();

  if (editingBudgetId) {
    budgets = budgets.map((item) => {
      if (item.id === editingBudgetId) {
        return {
          ...item,
          limit: amount,
          category,
        };
      }

      return item;
    });
  } else {
    const exists = budgets.some((item) => item.category === category);

    if (exists) return;

    budgets.push({
      id: Date.now(),

      category,

      limit: amount,

      spent: 0,
    });
  }

  updateData({
    budgets,
  });

  editingBudgetId = null;

  refreshBudgetsUI();
}

function editBudget(id) {
  editingBudgetId = id;

  const budget = getBudgets().find((item) => item.id === id);

  if (!budget) return;

  const input = document.querySelector(".budget-input");
  const title = document.querySelector(".budget-form-title");
  const button = document.querySelector(".budget-submit");
  const cancelButton = document.querySelector(".budget-cancel-edit");

  if (input) {
    input.value = budget.limit;
  }

  if (title) {
    title.textContent = "Edit Budget";
  }

  if (button) {
    button.textContent = "Update Budget";
  }

  if (cancelButton) {
    cancelButton.style.display = "block";
  }

  const selected = document.querySelector(".budget-category-selected");

  if (selected) {
    selected.textContent = budget.category;
  }

  document.querySelector(".budgets-form-card")?.scrollIntoView({
    behavior: "smooth",
  });
}

function refreshBudgetsUI() {
  const page = document.querySelector(".budgets-page");

  if (!page) return;

  page.innerHTML = "";

  page.append(
    createBudgetHeader(),
    createBudgetOverview(),
    createBudgetsLayout(),
  );
}

function createBudgetsLayout() {
  const section = document.createElement("section");

  section.innerHTML = `

      <div class="budgets-layout"></div>

    `;

  const layout = section.querySelector(".budgets-layout");

  layout.append(
    createBudgetsList(),

    createBudgetForm(),
  );

  return section;
}

function getBudgetCategories() {
  const allCategories = [
    "Overall",
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Other",
  ];

  const usedCategories = getBudgets().map((budget) => budget.category);

  return allCategories.filter((category) => !usedCategories.includes(category));
}

function createBudgetCategoryDropdown() {
  const categories = getBudgetCategories();

  const selectedCategory = categories[0] || "No categories";

  const wrapper = document.createElement("div");

  wrapper.className = "budget-category-dropdown";

  wrapper.innerHTML = `
      <button
        class="budget-category-select"
        type="button"
        ${categories.length === 0 ? "disabled" : ""}
      >
        <span class="budget-category-selected">
          ${selectedCategory}
        </span>

        <svg
          class="budget-category-select-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </button>

      <div class="budget-category-menu">
        ${buildBudgetCategoryOptions()}
      </div>
    `;

  if (categories.length > 0) {
    initBudgetCategoryDropdown(wrapper);
  }

  return wrapper;
}

function buildBudgetCategoryOptions() {
  return getBudgetCategories()
    .map(
      (category) => `

        <div
          class="budget-category-item"
          data-category="${category}"
        >

          ${category}

        </div>

        `,
    )
    .join("");
}

function initBudgetCategoryDropdown(dropdown) {
  const button = dropdown.querySelector(".budget-category-select");

  const menu = dropdown.querySelector(".budget-category-menu");

  const selected = dropdown.querySelector(".budget-category-selected");

  const items = dropdown.querySelectorAll(".budget-category-item");

  button.addEventListener("click", (e) => {
    e.stopPropagation();

    menu.classList.toggle("active");
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      items.forEach((i) => {
        i.classList.remove("active");
      });

      item.classList.add("active");

      selected.textContent = item.textContent.trim();

      menu.classList.remove("active");
    });
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      menu.classList.remove("active");
    }
  });
}

function getBudgetProgressColor(percent) {
  const value = Math.min(Math.max(percent, 0), 100);

  // 0% = blue primary
  // 30% = cyan
  // 50% = green
  // 70% = yellow
  // 85% = orange
  // 100% = red

  const stops = [
    { percent: 0, hue: 210 },
    { percent: 30, hue: 190 },
    { percent: 50, hue: 120 },
    { percent: 70, hue: 60 },
    { percent: 85, hue: 30 },
    { percent: 100, hue: 0 },
  ];

  let start = stops[0];
  let end = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (value >= stops[i].percent && value <= stops[i + 1].percent) {
      start = stops[i];
      end = stops[i + 1];
      break;
    }
  }

  const range = end.percent - start.percent;
  const progress = range === 0 ? 0 : (value - start.percent) / range;

  const hue = start.hue + (end.hue - start.hue) * progress;

  return `hsl(${hue}, 85%, 50%)`;
}

export default {
  mount(container) {
    const budgets = document.createElement("div");

    budgets.className = "budgets-page";

    budgets.append(
      createBudgetHeader(),

      createBudgetOverview(),

      createBudgetsLayout(),
    );

    container.appendChild(budgets);

    window.addEventListener("appDataUpdated", refreshBudgetsUI);
  },
};
