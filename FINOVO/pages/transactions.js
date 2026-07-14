import { getData, updateData, changedSymbol } from "../js/core/store.js";

function setupTransactionSearch(container) {
  const input = container.querySelector(".search-box input");

  const list = container.querySelector(".transaction-list");

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();

    const filtered = getTransactions().filter((transaction) => {
      const description = (
        transaction.description ||
        transaction.note ||
        transaction.type ||
        ""
      ).toLowerCase();

      const category = (transaction.category || "").toLowerCase();

      return description.includes(value) || category.includes(value);
    });

    renderTransactions(list, filtered);
  });
}

function setupFilterDropdowns(container) {
  container.querySelectorAll(".dropdown-selected").forEach((selected) => {
    selected.addEventListener("click", (event) => {
      event.stopPropagation();

      const menu = selected.nextElementSibling;

      container.querySelectorAll(".dropdown-menu").forEach((item) => {
        if (item !== menu) {
          item.classList.remove("active");
        }
      });

      menu.classList.toggle("active");
    });
  });

  container.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", function () {
      const dropdown = this.closest(".filter-dropdown");

      dropdown.querySelector(".dropdown-selected span").textContent =
        this.textContent;

      dropdown.querySelectorAll(".dropdown-item").forEach((option) => {
        option.classList.remove("active");
      });

      this.classList.add("active");

      dropdown.querySelector(".dropdown-menu").classList.remove("active");
    });
  });

  // close only transaction filter dropdowns
  container.addEventListener("click", (e) => {
    container.querySelectorAll(".dropdown-menu").forEach((menu) => {
      const dropdown = menu.closest(".filter-dropdown");

      if (dropdown && !dropdown.contains(e.target)) {
        menu.classList.remove("active");
      }
    });
  });
}

function setupTransactionFilterModal(container) {
  const filterBtn = container.querySelector(".filter-btn");

  const modal = container.querySelector(".transactions-filter-overlay");

  const closeBtn = document.querySelector(".transactions-overlay-close-btn");

  if (!filterBtn || !modal || !closeBtn) return;

  filterBtn.addEventListener("click", (e) => {
    e.preventDefault();

    modal.classList.add("active");
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();

    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}

function createTransactionsHeader() {
  const section = document.createElement("section");

  section.className = "transactions-page-btn-container";

  const count = Array.isArray(getData()?.transaction)
    ? getData().transaction.length
    : 0;

  section.innerHTML = `
    <div>
      <h2 class="setting-tab-title">
        Transactions
      </h2>
      <p>
        <span class="ActiveGoals">
          ${count}
        </span>
        of ${count} entries
      </p>
    </div>
    <button class="goals-page-new-goal-btn">
      + New transaction
    </button>
  `;

  return section;
}

function getTransactions() {
  const transactions = Array.isArray(getData()?.transaction)
    ? getData().transaction
    : [];

  return transactions;
}

function deleteTransaction(id) {
  const data = getData();

  const transactions = data.transaction || [];
  const accounts = data.accounts || [];

  const transaction = transactions.find((item) => item.id === id);

  if (!transaction) return;

  const amount = Number(transaction.amount || 0);

  // -------------------------
  // UNDO EXPENSE
  // -------------------------
  if (transaction.type === "expense") {
    const account = accounts.find((acc) => acc.id === transaction.accountId);

    if (account) {
      account.currentBalance += amount;
    }
  }

  // -------------------------
  // UNDO INCOME
  // -------------------------
  if (transaction.type === "income") {
    const account = accounts.find((acc) => acc.id === transaction.accountId);

    if (account) {
      account.currentBalance -= amount;
    }
  }

  // -------------------------
  // UNDO TRANSFER
  // -------------------------
  if (transaction.type === "transfer") {
    const fromAccount = accounts.find((acc) => acc.id === transaction.from);

    const toAccount = accounts.find((acc) => acc.id === transaction.to);

    if (fromAccount) {
      fromAccount.currentBalance += amount;
    }

    if (toAccount) {
      toAccount.currentBalance -= amount;
    }
  }

  // remove transaction
  const updatedTransactions = transactions.filter((item) => item.id !== id);

  updateData({
    transaction: updatedTransactions,
    accounts,
  });

  window.dispatchEvent(new Event("dataUpdated"));
}

function createTransactionFilterToolbar() {
  const section = document.createElement("section");
  section.className = "transaction-filter-container";
  section.innerHTML = `
    <div class="filter-toolbar">
      <div class="search-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.34-4.34"></path>
        </svg>
        <input 
          type="text" 
          placeholder="Search notes or category..."
        />
      </div>
      <button class="filter-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path 
            d="M4 7h8M4 17h2M18 7h2M13 17h7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            />
            <circle 
            cx="15"
            cy="7"
            r="3"
            stroke="currentColor"
            stroke-width="2"
            />
            <circle 
            cx="9"
            cy="17"
            r="3"
            stroke="currentColor"
            stroke-width="2"
            />
        </svg>
        <span>
          Filter
        </span>
      </button>
    </div>
  `;
  return section;
}

function formatTransactionDate(date) {
  if (!date) return "";

  const transactionDate = new Date(date);

  return transactionDate.toISOString().split("T")[0];
}

function createTransactionRow({
  id,
  type,
  title,
  date,
  category,
  account,
  amount,
}) {
  const row = document.createElement("div");
  row.className = "transaction-row";
  row.dataset.id = id;
  const icons = {
    expense: `
      <svg viewBox="0 0 24 24">
        <path d="M7 7L17 17M17 7V17H7" />
      </svg>
    `,
    income: `
      <svg viewBox="0 0 24 24">
        <path d="M7 17L17 7" />
        <path d="M7 7h10v10" />
      </svg>
    `,
    transfer: `
      <svg viewBox="0 0 24 24">
        <path d="M17 2l4 4-4 4" />
        <path d="M3 10a4 4 0 014-4h14" />
        <path d="M7 22l-4-4 4-4" />
        <path d="M21 14a4 4 0 01-4 4H3" />
      </svg>
    `,
  };

  row.innerHTML = `
    <div class="description">
      <div class="icon icon-${type}">
        ${icons[type]}
      </div>
      <div>
        <h4>
          ${title}
        </h4>
        <span>
          ${date}
        </span>
      </div>
    </div>
    <div>
      ${category}
    </div>
    <div class="account">
      ${account}
    </div>
    <div class="amount ${type}">
      ${amount}
    </div>
    <div class="actions">
      <button>
        <svg viewBox="0 0 24 24">
          <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
          />
          <path d="M14.06 4.94l3.75 3.75" />
        </svg>
      </button>
      <button class="delete">
        <svg viewBox="0 0 24 24">
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6v14H5V6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      </button>
    </div>
  `;
  const deleteBtn = row.querySelector(".delete");

  deleteBtn.addEventListener("click", () => {
    const transactionId = Number(row.dataset.id);

    deleteTransaction(transactionId);
  });
  return row;
}

function createTransactionsTable() {
  const section = document.createElement("section");

  const transactions = document.createElement("div");

  transactions.className = "transactions";

  transactions.innerHTML = `

    <div class="table-header">

      <div>
        Description
      </div>

      <div>
        Category
      </div>

      <div>
        Account
      </div>

      <div class="text-right">
        Amount
      </div>

      <div class="text-right">
        Actions
      </div>

    </div>

    <div class="transaction-list"></div>

  `;

  const list = transactions.querySelector(".transaction-list");

  renderTransactions(list);

  section.appendChild(transactions);

  return section;
}

function renderTransactions(container, filtered = null) {
  container.innerHTML = "";

  const transactions = filtered || getTransactions();

  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount || 0);

    let formattedAmount = `${changedSymbol()}${amount.toFixed(2)}`;

    if (transaction.type === "income") {
      formattedAmount = `+${formattedAmount}`;
    }

    if (transaction.type === "expense") {
      formattedAmount = `-${formattedAmount}`;
    }

    let title = transaction.description || transaction.note;

    if (!title) {
      title =
        transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);
    }

    let account = "";

    if (transaction.type === "transfer") {
      account = `${transaction.fromName || "-"} → ${transaction.toName || "-"}`;
    } else {
      account = transaction.accountName || "-";
    }

    container.appendChild(
      createTransactionRow({
        id: transaction.id,

        type: transaction.type,

        title,

        date: formatTransactionDate(transaction.date || transaction.createdAt),

        category: transaction.category || "Other",

        account,

        amount: formattedAmount,
      }),
    );
  });
}

function createFilterField(label, items) {
  return `
    <div class="transactions-field">
      <label>
        ${label}
      </label>
      <div class="custom-dropdown filter-dropdown">
        <div class="dropdown-selected">
          <span>
            ${items[0]}
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="m6 9 6 6 6-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
        </div>
        <div class="dropdown-menu">
          ${items
            .map(
              (item, index) => `
              <div 
                class="dropdown-item ${index === 0 ? "active" : ""}"
                data-value="${item.toLowerCase()}"
              >
                ${item}
              </div>
            `,
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

export default {
  mount(container) {
    const transactionsPage = document.createElement("div");

    transactionsPage.className = "transactions-page";

    transactionsPage.append(
      createTransactionsHeader(),

      createTransactionFilterToolbar(),

      createTransactionsTable(),
    );

    container.appendChild(transactionsPage);

    setupTransactionSearch(transactionsPage);

    setupFilterDropdowns(transactionsPage);

    setupTransactionFilterModal(transactionsPage);

    window.addEventListener("appDataUpdated", () => {
      const list = transactionsPage.querySelector(".transaction-list");

      renderTransactions(list);

      const count = getTransactions().length;

      transactionsPage.querySelector(".ActiveGoals").textContent = count;

      transactionsPage.querySelector(
        ".ActiveGoals",
      ).parentElement.lastChild.textContent = ` of ${count} entries`;
    });
  },
};
