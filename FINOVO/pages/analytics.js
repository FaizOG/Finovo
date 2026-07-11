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

function createAnalyticsOverview() {
  const section = document.createElement("section");

  section.className = "analytics-overview";

  section.append(
    createAnalyticsCard({
      title: "Top category",
      value: "Bills",
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame size-4 summary-card__icon">
          <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"></path>
        </svg>
      `,
    }),

    createAnalyticsCard({
      title: "Avg daily spend",
      value: "$145.45",
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-down size-4 summary-card__icon">
          <path d="M16 17h6v-6"></path>
          <path d="m22 17-8.5-8.5-5 5L2 7"></path>
        </svg>
      `,
    }),

    createAnalyticsCard({
      title: "Savings rate",
      value: "62%",
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-piggy-bank size-4 summary-card__icon">
          <path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z"></path>
          <path d="M16 10h.01"></path>
          <path d="M2 8v1a2 2 0 0 0 2 2h1"></path>
        </svg>
      `,
    }),

    createAnalyticsCard({
      title: "vs last month",
      value: "+7904%",
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up size-4 summary-card__icon">
          <path d="M16 7h6v6"></path>
          <path d="m22 7-8.5 8.5-5-5L2 17"></path>
        </svg>
      `,
    }),
  );

  return section;
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

        <div class="analytics-chart__body"></div>

      </div>
    </div>

    <div>
      <div class="panel analytics-category-panel">

        <div class="analytics-category-panel__header">
          <h2 class="analytics-category-panel__title">
            Expense categories
          </h2>
        </div>

      </div>
    </div>
  `;

  return section;
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

        </div>

        <div class="analytics-chart__body"></div>

      </div>

    </div>

    <div class="analytics-split-grid__categories">

      <div class="panel analytics-category-panel">

        <div class="analytics-category-panel__header">
          <h2 class="analytics-category-panel__title">
            Expense categories
          </h2>
        </div>

      </div>

    </div>
  `;

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
