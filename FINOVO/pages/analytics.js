import { getData, changedSymbol } from "../js/core/store.js";
import Chart from "https://cdn.jsdelivr.net/npm/chart.js@4.4.3/auto/+esm";
// import { Chart } from "https://cdn.jsdelivr.net/npm/chart.js@4.4.3/+esm";

function createAnalyticsHeader() {
  const section = document.createElement("section");

  section.innerHTML = `
    <h2 class="setting-tab-title">Analytics</h2>
    <p class="setting-tab-subtitle">
      Spending insights and trends
    </p>
  `;

  return section;
}

function createAnalyticsCard({ title, value, icon }) {
  const card = document.createElement("div");

  card.className = "analytics-card";

  card.innerHTML = `
    <div class="analytics-card__header">

      <span class="analytics-card__title">
        ${title}
      </span>

      <div class="analytics-card__icon-container">
        ${icon}
      </div>

    </div>

    <h3 class="analytics-card__value">
      ${value}
    </h3>
  `;

  return card;
}

function getAnalyticsOverviewData() {
  const transactions = Array.isArray(getData()?.transaction)
    ? getData().transaction
    : [];

  let categoryTotals = {};
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount || 0);

    if (transaction.type === "income") {
      totalIncome += amount;
    }

    if (transaction.type === "expense") {
      totalExpense += amount;

      const category = transaction.category || "Other";

      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    }
  });

  // Top category
  const topCategory =
    Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "No data";

  // Average daily spend
  const days = new Date().getDate();

  const avgDailySpend = days > 0 ? totalExpense / days : 0;

  // Savings rate
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  // Current month / previous month comparison

  const now = new Date();

  let currentMonthExpense = 0;
  let previousMonthExpense = 0;

  transactions.forEach((transaction) => {
    if (transaction.type !== "expense") return;

    const date = new Date(
      transaction.date || transaction.createdAt || transaction.id,
    );

    const amount = Number(transaction.amount || 0);

    if (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      currentMonthExpense += amount;
    }

    const previous = new Date(now.getFullYear(), now.getMonth() - 1);

    if (
      date.getMonth() === previous.getMonth() &&
      date.getFullYear() === previous.getFullYear()
    ) {
      previousMonthExpense += amount;
    }
  });

  let monthChange = 0;

  if (previousMonthExpense > 0) {
    monthChange =
      ((currentMonthExpense - previousMonthExpense) / previousMonthExpense) *
      100;
  }

  return {
    topCategory,

    avgDailySpend,

    savingsRate,

    monthChange,
  };
}

function createAnalyticsOverview() {
  const section = document.createElement("section");

  section.className = "analytics-overview";

  const data = getAnalyticsOverviewData();

  section.append(
    createAnalyticsCard({
      title: "Top category",

      value: data.topCategory,

      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame size-4" aria-hidden="true"><path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"></path></svg>
      `,
    }),

    createAnalyticsCard({
      title: "Avg daily spend",

      value: `${changedSymbol()}${data.avgDailySpend.toFixed(2)}`,

      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-down size-4" aria-hidden="true"><path d="M16 17h6v-6"></path><path d="m22 17-8.5-8.5-5 5L2 7"></path></svg>
      `,
    }),

    createAnalyticsCard({
      title: "Savings rate",

      value: `${data.savingsRate.toFixed(1)}%`,

      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-piggy-bank size-4" aria-hidden="true"><path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z"></path><path d="M16 10h.01"></path><path d="M2 8v1a2 2 0 0 0 2 2h1"></path></svg>
      `,
    }),

    createAnalyticsCard({
      title: "vs last month",

      value: `${data.monthChange >= 0 ? "+" : ""}${data.monthChange.toFixed(1)}%`,

      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up size-4" aria-hidden="true"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>
      `,
    }),
  );

  return section;
}

function getWeeklySpendingData() {
  const transactions = Array.isArray(getData()?.transaction)
    ? getData().transaction
    : [];

  const days = [];

  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setDate(today.getDate() - i);

    days.push({
      key: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      amount: 0,
    });
  }

  transactions.forEach((transaction) => {
    if (transaction.type !== "expense") return;

    const date = new Date(
      transaction.date || transaction.createdAt || transaction.id,
    );

    const key = date.toISOString().split("T")[0];

    const day = days.find((d) => d.key === key);

    if (!day) return;

    day.amount += Number(transaction.amount || 0);
  });

  return {
    labels: days.map((day) => day.label),
    values: days.map((day) => day.amount),
  };
}

function createAnalyticsGrid() {
  const section = document.createElement("section");

  section.className = "analytics-grid";

  section.innerHTML = `
    <div class="analytics-grid__main">
      <div class="panel analytics-chart">

        <div class="analytics-chart__header">

          <div>
            <h2 class="analytics-chart__title">
              Weekly spending
            </h2>
          </div>
        </div>

        <div class="analytics-category-chart__body">
          <canvas class="weekly-spending-chart"></canvas>
        </div>

      </div>
    </div>

    <div>
      <div class="panel analytics-category-panel">

        <div class="analytics-category-panel__header">
          <h2 class="analytics-category-panel__title">
            Expense categories
          </h2>
        </div>

         <div class="analytics-category-chart-body">
            <canvas class="expense-category-chart"></canvas>
        </div>

        <div class="expense-category-list"></div>

      </div>
    </div>
  `;

  const canvas = section.querySelector(".weekly-spending-chart");

  const { labels, values } = getWeeklySpendingData();

  const styles = getComputedStyle(document.documentElement);

  const expenseColor = styles.getPropertyValue("--primary").trim();

  new Chart(canvas, {
    type: "bar",

    data: {
      labels,

      datasets: [
        {
          label: "Expense",

          data: values,

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

  const categoryPanel = section.querySelector(".analytics-category-panel");

  createExpenseCategoryChart(categoryPanel);

  return section;
}

function getIncomeExpenseData() {
  const transactions = Array.isArray(getData()?.transaction)
    ? getData().transaction
    : [];

  const today = new Date();

  const months = [];

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

    const month = months.find((item) => item.key === key);

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

function getExpenseCategoryData() {
  const transactions = Array.isArray(getData()?.transaction)
    ? getData().transaction
    : [];

  const categories = {};

  transactions.forEach((transaction) => {
    if (transaction.type !== "expense") return;

    const category = transaction.category || "Other";

    const amount = Number(transaction.amount || 0);

    categories[category] = (categories[category] || 0) + amount;
  });

  const sortedCategories = Object.entries(categories).sort(
    (a, b) => b[1] - a[1],
  ); // high to low

  return {
    labels: sortedCategories.map(([category]) => category),
    values: sortedCategories.map(([, amount]) => amount),
  };
}

function createExpenseCategoryChart(section) {
  const canvas = section.querySelector(".expense-category-chart");

  const list = section.querySelector(".expense-category-list");

  const { labels, values } = getExpenseCategoryData();

  // Light color palette
  const colors = [
    "#93c5fd", // light blue
    "#86efac", // light green
    "#fde68a", // light yellow
    "#fca5a5", // light red
    "#d8b4fe", // light purple
    "#67e8f9", // light cyan
    "#fdba74", // light orange
    "#f9a8d4", // light pink
  ];

  const chartColors = labels.map((_, index) => colors[index % colors.length]);

  new Chart(canvas, {
    type: "doughnut",

    data: {
      labels,

      datasets: [
        {
          data: values,

          backgroundColor: chartColors,

          borderWidth: 3,

          borderColor: "#ffffff",

          hoverOffset: 8,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      cutout: "68%",

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          callbacks: {
            label(context) {
              const value = context.raw;

              return `${changedSymbol()}${value.toFixed(2)}`;
            },
          },
        },
      },
    },
  });

  // Clear old list
  list.innerHTML = "";

  labels.forEach((label, index) => {
    const item = document.createElement("div");

    item.className = "expense-category-item";

    item.innerHTML = `

      <span class="expense-category-name">

        <span
          class="expense-category-dot"
          style="
            background:${chartColors[index]}
          "
        ></span>

        ${label}

      </span>


      <span class="expense-category-value">

        ${changedSymbol()}${values[index].toFixed(2)}

      </span>

    `;

    list.appendChild(item);
  });
}

function getSavingsTrendData() {
  const goalTransactions = Array.isArray(getData()?.goalTransactions)
    ? getData().goalTransactions
    : [];

  const today = new Date();

  const months = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);

    months.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString("default", {
        month: "short",
      }),
      amount: 0,
    });
  }

  goalTransactions.forEach((item) => {
    if (item.type !== "goal_saving") return;

    const date = new Date(item.date || item.id);

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    const month = months.find((m) => m.key === key);

    if (!month) return;

    month.amount += Number(item.amount || 0);
  });

  return {
    labels: months.map((m) => m.label),
    values: months.map((m) => m.amount),
  };
}

function createAnalyticsSplitGrid() {
  const section = document.createElement("section");

  section.className = "analytics-split-grid";

  section.innerHTML = `
    <div class="analytics-split-grid__chart">

      <div class="panel analytics-chart">

        <div class="analytics-chart__header">

          <div>
            <h2 class="analytics-chart__title">
              Income vs expenses
            </h2>
          </div>

          <div class="analytics-chart__legend">

            <span class="analytics-legend-item">
              <span class="analytics-legend-dot analytics-legend-dot--income"></span>
              Income
            </span>

            <span class="analytics-legend-item">
              <span class="analytics-legend-dot analytics-legend-dot--expense"></span>
              Expense
            </span>

          </div>

        </div>

        <div class="analytics-chart__body">
            <canvas class="income-expense-chart"></canvas>
        </div>

      </div>

    </div>

    <div class="analytics-split-grid__categories">

  <div class="panel analytics-category-panel">

    <div class="analytics-category-panel__header">
      <h2 class="analytics-category-panel__title">
        Savings trend
      </h2>
    </div>

    <div class="analytics-savings-chart-body">
  <canvas class="savings-trend-chart"></canvas>
</div>

  </div>

</div>
  `;

  const canvas = section.querySelector(".income-expense-chart");

  const { labels, income, expense } = getIncomeExpenseData();

  const styles = getComputedStyle(document.documentElement);

  const primaryColor = styles.getPropertyValue("--primary").trim();

  const mutedColor = styles.getPropertyValue("--text-muted").trim();

  new Chart(canvas, {
    type: "bar",

    data: {
      labels,

      datasets: [
        {
          label: "Income",

          data: income,

          backgroundColor: primaryColor,

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

          backgroundColor: mutedColor,

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

  const savingsCanvas = section.querySelector(".savings-trend-chart");

  const { labels: savingsLabels, values: savingsValues } =
    getSavingsTrendData();

  const savingsColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();

  new Chart(savingsCanvas, {
    type: "line",

    data: {
      labels: savingsLabels,

      datasets: [
        {
          label: "Savings",

          data: savingsValues,

          borderColor: savingsColor,

          backgroundColor: `${savingsColor}20`,

          fill: true,

          tension: 0.45,

          borderWidth: 3,

          pointRadius: 5,

          pointHoverRadius: 7,

          pointBackgroundColor: savingsColor,
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

  return section;
}

export default {
  mount(container) {
    const analytics = document.createElement("div");

    analytics.className = "analytics-page";

    analytics.append(
      createAnalyticsHeader(),
      createAnalyticsOverview(),
      createAnalyticsGrid(),
      createAnalyticsSplitGrid(),
    );

    container.appendChild(analytics);
  },
};
