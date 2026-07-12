import { getData, changedSymbol } from "../js/core/store.js";
import Chart from "https://cdn.jsdelivr.net/npm/chart.js@4.4.3/auto/+esm";

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
      value: `${changedSymbol()} ${getTotalBalance().toLocaleString()}`,
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
      value: `${changedSymbol()} ${getMonthlyIncome().toLocaleString()}`,
      subtitle: "+ deposits & salary",
      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right size-4" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
      `,
    }),

    createSummaryCard({
      title: "Expenses (this month)",
      value: `${changedSymbol()} ${getMonthlyExpenses().toLocaleString()}`,
      subtitle: "− spending",
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-down-right size-4" aria-hidden="true"><path d="m7 7 10 10"></path><path d="M17 7v10H7"></path></svg>
      `,
    }),

    createSummaryCard({
      title: "Savings (goals)",
      value: `${changedSymbol()} ${getSavingsAmount().toLocaleString()}`,
      subtitle: "across all goals",
      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-piggy-bank size-4" aria-hidden="true"><path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z"></path><path d="M16 10h.01"></path><path d="M2 8v1a2 2 0 0 0 2 2h1"></path></svg>
      `,
    }),
  );

  return section;
}

function getCashFlowData() {
  const transactions = Array.isArray(getData()?.transaction)
    ? getData().transaction
    : [];

  const today = new Date();

  const months = [];

  // create last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);

    months.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString("default", {
        month: "short",
      }),
      income: 0,
      expense: 0,
    });
  }

  transactions.forEach((transaction) => {
    const date = new Date(
      transaction.date || transaction.createdAt || transaction.id,
    );

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    const month = months.find((m) => m.key === key);

    if (!month) return;

    const amount = Number(transaction.amount) || 0;

    if (transaction.type === "income") {
      month.income += amount;
    }

    if (transaction.type === "expense") {
      month.expense += amount;
    }
  });

  return {
    labels: months.map((m) => m.label),
    income: months.map((m) => m.income),
    expense: months.map((m) => m.expense),
  };
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
        <canvas class="cash-flow-chart__canvas"></canvas>
    </div>

</div>
`;

  const canvas = wrapper.querySelector(".cash-flow-chart__canvas");

  const { labels, income, expense } = getCashFlowData();
  const styles = getComputedStyle(document.documentElement);

  const incomeColor = styles.getPropertyValue("--primary").trim();
  const expenseColor = styles.getPropertyValue("--text-muted").trim();
  new Chart(canvas, {
    type: "bar",

    data: {
      labels,

      datasets: [
        {
          label: "Income",
          data: income,
          backgroundColor: incomeColor,
          borderRadius: {
            topLeft: 12,
            topRight: 12,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: "bottom",
        },

        {
          label: "Expense",
          data: expense,
          backgroundColor: expenseColor,
          borderRadius: {
            topLeft: 12,
            topRight: 12,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: "bottom",
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },
      },

      scales: {
        x: {
          grid: {
            display: false,
          },
        },

        y: {
          beginAtZero: true,

          ticks: {
            callback(value) {
              return `${changedSymbol()}${value}`;
            },
          },
        },
      },
    },
  });

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

// import { getData, changedSymbol } from "../js/core/store.js";

function createRecentTransactionsSection() {
  const wrapper = document.createElement("div");

  wrapper.className = "dashboard-grid__main";

  const currency = changedSymbol();

  const transactions = Array.isArray(getData()?.transaction)
    ? getData().transaction
    : [];

  const icons = {
    expense: `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="16" height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path d="m7 7 10 10"></path>
        <path d="M17 7v10H7"></path>
      </svg>
    `,

    income: `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="16" height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M7 17 17 7"></path>
        <path d="M7 7h10v10"></path>
      </svg>
    `,

    transfer: `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="16" height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M17 3l4 4-4 4"></path>
        <path d="M3 7h18"></path>
        <path d="M7 21l-4-4 4-4"></path>
        <path d="M21 17H3"></path>
      </svg>
    `,
  };

  const transactionHTML = transactions.length
    ? transactions
        .slice()
        .sort((a, b) => {
          const dateA = new Date(a.date || a.createdAt || a.id);
          const dateB = new Date(b.date || b.createdAt || b.id);

          return dateB - dateA; // newest first
        })
        .slice(0, 5)
        .map((transaction) => {
          const type = transaction.type || "expense";

          const amount = Number(transaction.amount || 0);

          const isIncome = type === "income";

          return `
            <div class="transaction-item">

              <div class="
                transaction-item__icon 
                transaction-item__icon--${type}
              ">
                ${icons[type]}
              </div>


              <div class="transaction-item__content">

                <div class="transaction-item__name">
                  ${
                    type === "transfer"
                      ? "Transfer"
                      : transaction.category || transaction.name || type
                  }
                </div>


                <div class="transaction-item__meta">

                  ${
                    type === "transfer"
                      ? `${transaction.fromName || "From"} • ${transaction.toName || "To"}`
                      : type === "income"
                        ? `${transaction.source || transaction.category || "Income"}`
                        : `${transaction.category || "Expense"}`
                  }

                  •

                  ${formatTransactionDate(transaction)}

                </div>

              </div>


              <div class="
                transaction-item__amount
                ${isIncome ? "transaction-item__amount--income" : ""}
              ">

                ${type === "expense" ? "-" : "+"}

                ${currency}${amount.toFixed(2)}

              </div>

            </div>
          `;
        })
        .join("")
    : `
      <p class="empty-message">
        No transactions yet.
      </p>
    `;

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

        ${transactionHTML}

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

  const currency = changedSymbol();

  const goals = Array.isArray(getData()?.goals) ? getData().goals : [];

  const activeGoals = goals.filter((goal) => !goal.completedAt);

  const goalHTML = activeGoals.length
    ? activeGoals
        .slice(0, 3)
        .map((goal) => {
          const saved = Number(goal.savedAmount || 0);
          const target = Number(goal.targetAmount || 0);

          const progress = target ? Math.min((saved / target) * 100, 100) : 0;

          const today = new Date();
          const deadline = new Date(goal.deadline);

          const diff = deadline - today;

          const daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

          return `
            <div class="goal-item">

              <div class="goal-item__header">

                <span class="goal-item__name">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target size-4" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  ${goal.name}
                </span>


                <small>
                  ${progress.toFixed(0)}%
                </small>

              </div>


              <div class="goal-progress">

                <div 
                  class="goal-progress__bar"
                  style="width:${progress}%">
                </div>

              </div>


              <div class="goal-item__header">

                <span class="goal-item__amount">
                  ${currency} ${saved.toFixed(2)}
                  /
                  ${currency} ${target.toFixed(2)}
                </span>


                <small>
                  ${daysLeft} days left
                </small>

              </div>

            </div>
          `;
        })
        .join("")
    : `
      <p class="empty-message">
        No savings goals yet.
      </p>
    `;

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

        ${goalHTML}

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

function formatTransactionDate(transaction) {
  const date = new Date(
    transaction.date || transaction.createdAt || transaction.id,
  );

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

let dashboardContainer;

function renderDashboard() {
  if (!dashboardContainer) return;

  dashboardContainer.innerHTML = "";

  const dashboard = document.createElement("div");

  dashboard.className = "dashboard-page";

  dashboard.append(
    createDashboardHeader(),
    createNumbersOverview(),
    createCashFlowBudgetGrid(),
    createActivityGrid(),
  );

  dashboardContainer.appendChild(dashboard);
}

export default {
  mount(container) {
    dashboardContainer = container;

    renderDashboard();

    window.addEventListener("dataUpdated", () => {
      const dashboardPage = document.querySelector(".dashboard-page");

      if (dashboardPage) {
        renderDashboard();
      }
    });
  },
};
