import { changedSymbol } from "../js/core/store.js";

import {
  getTotalBalance,
  getMonthlyIncome,
  getMonthlyExpenses,
  getSavingsAmount,
} from "../js/core/dashboard.utils.js";

function createDashboardHeader() {
  const section = document.createElement("section");

  section.innerHTML = `
    <h2 class="setting-tab-title">Dashboard</h2>
    <p class="setting-tab-subtitle">
      Here's how your money is moving this month.
    </p>
  `;

  return section;
}

function createSummaryCard({ title, value, subtitle, icon, type = "" }) {
  const card = document.createElement("div");

  card.className = `summary-card ${type}`;

  card.innerHTML = `
    <div class="summary-card__header">
      <span class="summary-card__title">
        ${title}
      </span>

      <div class="summary-card__icon__container">
        ${icon}
      </div>
    </div>

    <h3 class="summary-card__value">
      ${value}
    </h3>

    <p class="summary-card__subtitle">
      ${subtitle}
    </p>
  `;

  return card;
}

function createNumbersOverview() {
  const section = document.createElement("section");

  section.className = "numbers-overview";

  section.append(
    createSummaryCard({
      title: "Total Balance",
      value: `${changedSymbol()}${getTotalBalance().toLocaleString()}`,
      subtitle: `
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up size-3" aria-hidden="true"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>
        </span>
        across all accounts
      `,
      type: "total-balance-card",
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallet size-4" aria-hidden="true"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path></svg>
      `,
    }),

    createSummaryCard({
      title: "Income (this month)",
      value: `${changedSymbol()}${getMonthlyIncome().toLocaleString()}`,
      subtitle: "+ deposits & salary",
      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right size-4" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
      `,
    }),

    createSummaryCard({
      title: "Expenses (this month)",
      value: `${changedSymbol()}${getMonthlyExpenses().toLocaleString()}`,
      subtitle: "− spending",
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-down-right size-4" aria-hidden="true"><path d="m7 7 10 10"></path><path d="M17 7v10H7"></path></svg>
      `,
    }),

    createSummaryCard({
      title: "Savings (goals)",
      value: `${changedSymbol()}${getSavingsAmount().toLocaleString()}`,
      subtitle: "across all goals",
      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-piggy-bank size-4" aria-hidden="true"><path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z"></path><path d="M16 10h.01"></path><path d="M2 8v1a2 2 0 0 0 2 2h1"></path></svg>
      `,
    }),
  );

  return section;
}

function createCashFlowSection() {
  const wrapper = document.createElement("div");

  wrapper.className = "dashboard-grid__main";

  wrapper.innerHTML = `
    <div class="panel cash-flow-chart">

      <div class="cash-flow-chart__header">

        <div>
          <h2 class="cash-flow-chart__title">
            Cash flow
          </h2>

          <p class="cash-flow-chart__subtitle">
            Income vs expenses, last 6 months
          </p>
        </div>


        <div class="cash-flow-chart__legend">

          <span class="legend-item">
            <span class="legend-dot legend-dot--income"></span>
            Income
          </span>


          <span class="legend-item">
            <span class="legend-dot legend-dot--expense"></span>
            Expense
          </span>

        </div>

      </div>


      <div class="cash-flow-chart__body">
      </div>

    </div>
  `;

  return wrapper;
}

function createMonthlyBudgetSection() {
  const wrapper = document.createElement("div");

  wrapper.innerHTML = `
    <div class="panel monthly-budget">

      <div class="monthly-budget__header">

        <div>
          <h2 class="monthly-budget__title">
            Monthly budget
          </h2>

          <p class="monthly-budget__subtitle">
            July 2026
          </p>
        </div>


        <a href="#" class="monthly-budget__link">
          Manage
        </a>

      </div>


      <p class="monthly-budget__message">
        No monthly budget set.
        <a href="#" class="monthly-budget__action">
          Create one
        </a>.
      </p>

    </div>
  `;

  const createBtn = wrapper.querySelector(".monthly-budget__action");
  const manageBtn = wrapper.querySelector(".monthly-budget__link");

  function navigateToBudgets(e) {
    e.preventDefault();

    window.dispatchEvent(
      new CustomEvent("navigate", {
        detail: "budgets",
      }),
    );
  }

  createBtn.addEventListener("click", navigateToBudgets);
  manageBtn.addEventListener("click", navigateToBudgets);

  return wrapper;
}

function createCashFlowBudgetGrid() {
  const section = document.createElement("section");

  section.className = "dashboard-grid";

  section.append(createCashFlowSection(), createMonthlyBudgetSection());

  return section;
}

function createRecentTransactionsSection() {
  const wrapper = document.createElement("div");

  wrapper.className = "dashboard-grid__main";

  wrapper.innerHTML = `
    <div class="panel recent-transactions">

      <div class="recent-transactions__header">

        <h2 class="recent-transactions__title">
          Recent transactions
        </h2>

        <a href="#" class="recent-transactions__link">
          View all
        </a>

      </div>

      <div class="transaction-list">

        <div class="transaction-item">

          <div class="transaction-item__icon transaction-item__icon--expense">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <path d="m7 7 10 10"></path>
              <path d="M17 7v10H7"></path>
            </svg>
          </div>

          <div class="transaction-item__content">
            <div class="transaction-item__name">
              Food
            </div>

            <div class="transaction-item__meta">
              Food • BOB • 2026-07-10
            </div>
          </div>

          <div class="transaction-item__amount">
            −$500.00
          </div>

        </div>

      </div>

    </div>
  `;

  const viewAll = wrapper.querySelector(".recent-transactions__link");

  viewAll.addEventListener("click", (e) => {
    e.preventDefault();

    window.dispatchEvent(
      new CustomEvent("navigate", {
        detail: "transactions",
      }),
    );
  });

  return wrapper;
}

function createSavingsGoalsSection() {
  const wrapper = document.createElement("div");

  wrapper.innerHTML = `
    <div class="panel savings-goals">

      <div class="savings-goals__header">

        <h2 class="savings-goals__title">
          Savings goals
        </h2>


        <a href="#" class="savings-goals__link">
          All goals
        </a>

      </div>


      <div class="savings-goals__list">

        <div class="goal-item">

          <div class="goal-item__header">

            <span class="goal-item__name">
              Emergency Fund
            </span>


            <span class="goal-item__amount">
              $2,500 / $5,000
            </span>

          </div>


          <div class="goal-progress">
            <div class="goal-progress__bar"></div>
          </div>

        </div>

      </div>

    </div>
  `;

  const allGoals = wrapper.querySelector(".savings-goals__link");

  allGoals.addEventListener("click", (e) => {
    e.preventDefault();

    window.dispatchEvent(
      new CustomEvent("navigate", {
        detail: "goals",
      }),
    );
  });

  return wrapper;
}

function createActivityGrid() {
  const section = document.createElement("section");

  section.className = "dashboard-grid";

  section.append(
    createRecentTransactionsSection(),
    createSavingsGoalsSection(),
  );

  return section;
}

export default {
  mount(container) {
    const dashboard = document.createElement("div");

    dashboard.className = "dashboard-page";

    dashboard.append(
      createDashboardHeader(),
      createNumbersOverview(),
      createCashFlowBudgetGrid(),
      createActivityGrid(),
    );

    container.appendChild(dashboard);
  },
};
