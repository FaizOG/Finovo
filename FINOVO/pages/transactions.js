import { getData, updateData, changedSymbol } from "../js/core/store.js";
const transactionFilters = {
  type: "",
  category: "",
  account: "",
  sort: "newest",
  startDate: "",
  endDate: "",
};

function setupTransactionSearch(container) {
  const input = container.querySelector(".search-box input");
  const list = container.querySelector(".transaction-list");
  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();
    const filtered = getFilteredTransactions().filter((transaction) => {
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

function setupFilterDropdowns() {
  const filterOverlay = document.querySelector(".transactions-filter-overlay");
  if (!filterOverlay) return;
  filterOverlay.querySelectorAll(".filter-dropdown").forEach((dropdown) => {
    const selected = dropdown.querySelector(".dropdown-selected");
    const menu = dropdown.querySelector(".dropdown-menu");
    selected.addEventListener("click", (e) => {
      e.stopPropagation();
      filterOverlay.querySelectorAll(".dropdown-menu").forEach((m) => {
        if (m !== menu) {
          m.classList.remove("active");
        }
      });
      menu.classList.toggle("active");
    });
    dropdown.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", () => {
        selected.querySelector("span").textContent = item.textContent.trim();
        dropdown.querySelectorAll(".dropdown-item").forEach((i) => {
          i.classList.remove("active");
        });
        item.classList.add("active");
        if (dropdown.id === "transactionType") {
          transactionFilters.type = item.dataset.value;
        }
        if (dropdown.id === "transactionCategory") {
          transactionFilters.category = item.dataset.value;
        }
        if (dropdown.id === "transactionAccount") {
          transactionFilters.account = item.dataset.value;
        }
        if (dropdown.id === "sortBy") {
          transactionFilters.sort = item.dataset.value;
        }
        menu.classList.remove("active");
      });
    });
  });

  filterOverlay.addEventListener("click", (e) => {
    if (!e.target.closest(".filter-dropdown")) {
      filterOverlay.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.classList.remove("active");
      });
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

function getFilteredTransactions() {
  let transactions = [...getTransactions()];

  if (transactionFilters.type) {
    transactions = transactions.filter(
      (t) => t.type === transactionFilters.type,
    );
  }

  if (transactionFilters.category) {
    transactions = transactions.filter(
      (t) =>
        t.category?.toLowerCase() === transactionFilters.category.toLowerCase(),
    );
  }

  if (transactionFilters.account) {
    transactions = transactions.filter((t) => {
      const account = transactionFilters.account.toLowerCase();

      if (t.type === "transfer") {
        return (
          t.fromName?.toLowerCase() === account ||
          t.toName?.toLowerCase() === account
        );
      }

      return t.accountName?.toLowerCase() === account;
    });
  }

  if (transactionFilters.startDate || transactionFilters.endDate) {
    transactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date || t.createdAt);

      transactionDate.setHours(0, 0, 0, 0);

      if (transactionFilters.startDate) {
        const startDate = new Date(transactionFilters.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (transactionDate < startDate) {
          return false;
        }
      }

      if (transactionFilters.endDate) {
        const endDate = new Date(transactionFilters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (transactionDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }

  if (transactionFilters.sort === "newest") {
    transactions.sort(
      (a, b) =>
        new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt),
    );
  }

  if (transactionFilters.sort === "oldest") {
    transactions.sort(
      (a, b) =>
        new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt),
    );
  }

  if (transactionFilters.sort === "highest") {
    transactions.sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
  }

  if (transactionFilters.sort === "lowest") {
    transactions.sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0));
  }

  return transactions;
}

function updateTransaction(updatedTransaction) {
  const data = getData();

  const transactions = data.transaction || [];
  const accounts = data.accounts || [];

  const oldTransaction = transactions.find(
    (t) => t.id === updatedTransaction.id,
  );

  if (!oldTransaction) return;

  const oldAmount = Number(oldTransaction.amount || 0);
  const newAmount = Number(updatedTransaction.amount || 0);

  if (oldTransaction.type === "expense") {
    const account = accounts.find((acc) => acc.id === oldTransaction.accountId);

    if (account) {
      account.currentBalance += oldAmount;
    }
  }

  if (oldTransaction.type === "income") {
    const account = accounts.find((acc) => acc.id === oldTransaction.accountId);

    if (account) {
      account.currentBalance -= oldAmount;
    }
  }

  if (updatedTransaction.type === "expense") {
    const account = accounts.find(
      (acc) => acc.id === updatedTransaction.accountId,
    );

    if (account) {
      account.currentBalance -= newAmount;
    }
  }

  if (updatedTransaction.type === "income") {
    const account = accounts.find(
      (acc) => acc.id === updatedTransaction.accountId,
    );

    if (account) {
      account.currentBalance += newAmount;
    }
  }

  const updatedTransactions = transactions.map((t) =>
    t.id === updatedTransaction.id ? updatedTransaction : t,
  );

  updateData({
    transaction: updatedTransactions,
    accounts,
  });
  window.notify?.success("Transaction updated successfully.");
  window.dispatchEvent(new Event("appDataUpdated"));
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

function deleteTransaction(id) {
  // console.log("Delete called", id);

  const data = getData();

  const transactions = data.transaction || [];
  const accounts = data.accounts || [];

  const transaction = transactions.find((item) => item.id === id);

  if (!transaction) return;

  const amount = Number(transaction.amount || 0);

  if (transaction.type === "expense") {
    const account = accounts.find((acc) => acc.id === transaction.accountId);
    if (account) {
      account.currentBalance += amount;
    }
  }

  if (transaction.type === "income") {
    const account = accounts.find((acc) => acc.id === transaction.accountId);
    if (account) {
      account.currentBalance -= amount;
    }
  }

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

  const updatedTransactions = transactions.filter((item) => item.id !== id);

  // console.log("Before updateData");

  updateData({
    transaction: updatedTransactions,
    accounts,
  });

  // console.log("After updateData");
  // console.log(window.notify);

  window.notify?.success("Transaction deleted successfully.");

  // console.log("After notify");

  window.dispatchEvent(new Event("appDataUpdated"));
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
      <button class="edit">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil size-3.5" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path><path d="m15 5 4 4"></path></svg>
      </button>
      <button class="delete">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 size-3.5" aria-hidden="true"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      </button>
    </div>
  `;

  const deleteBtn = row.querySelector(".delete");
  const editBtn = row.querySelector(".edit");

  deleteBtn.addEventListener("click", () => {
    const transactionId = Number(row.dataset.id);

    deleteTransaction(transactionId);
  });

  editBtn.addEventListener("click", () => {
    const id = Number(row.dataset.id);

    window.openModal(id);
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

  if (!transactions.length) {
    container.innerHTML = `
      <div class="empty-transactions">
        <div class="empty-icon">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="1.5"
          >
            <path d="M3 3h18v18H3z"/>
            <path d="M8 12h8"/>
            <path d="M12 8v8"/>
          </svg>
        </div>

        <h3>No transactions found</h3>
        <p>
          ${
            filtered
              ? "Try changing your filters or search terms."
              : "Start adding transactions to see them here."
          }
        </p>
      </div>
    `;

    return;
  }

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

function setupTransactionFilterPopup() {
  const overlay = document.querySelector(".transactions-filter-overlay");
  const openBtn = document.querySelector(".filter-btn");
  const closeBtn = document.querySelector(".transactions-overlay-close-btn");
  const modal = document.querySelector(".transactioins-modal");

  if (!overlay || !openBtn || !closeBtn || !modal) return;

  openBtn.addEventListener("click", () => {
    overlay.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("active");
    }
  });

  modal.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

function setupFilterForm() {
  const form = document.querySelector(".transaction-filter-form");
  const overlay = document.querySelector(".transactions-filter-overlay");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const list = document.querySelector(".transaction-list");
    renderTransactions(
      document.querySelector(".transaction-list"),
      getFilteredTransactions(),
    );
    overlay.classList.remove("active");
  });
}

function setupFilterReset() {
  const overlay = document.querySelector(".transactions-filter-overlay");
  const form = overlay?.querySelector(".transaction-filter-form");

  if (!form || !overlay) return;

  form.addEventListener("reset", () => {
    transactionFilters.type = "";
    transactionFilters.category = "";
    transactionFilters.account = "";
    transactionFilters.sort = "newest";
    transactionFilters.startDate = "";
    transactionFilters.endDate = "";

    setTimeout(() => {
      overlay.querySelectorAll(".dropdown-item").forEach((item) => {
        item.classList.remove("active");
      });

      overlay.querySelectorAll(".custom-dropdown").forEach((dropdown) => {
        const firstItem = dropdown.querySelector(".dropdown-item");

        if (firstItem) {
          firstItem.classList.add("active");
        }
      });

      overlay.querySelectorAll(".dropdown-selected span").forEach((span) => {
        const firstItem = span
          .closest(".custom-dropdown")
          .querySelector(".dropdown-item");

        if (firstItem) {
          span.textContent = firstItem.textContent.trim();
        }
      });

      overlay
        .querySelectorAll(".dateRangeBtnContainer button")
        .forEach((btn) => {
          btn.classList.remove("active");
        });
    }, 0);
  });
}

function setupQuickDateFilters() {
  const overlay = document.querySelector(".transactions-filter-overlay");

  if (!overlay) return;
  const buttons = overlay.querySelectorAll(".dateRangeBtnContainer button");
  const startInput = overlay.querySelector("#startDate");
  const endInput = overlay.querySelector("#endDate");

  if (!buttons.length || !startInput || !endInput) return;
  let activeButton = null;

  function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function setTodayEndDate() {
    const today = new Date();
    const formatted = formatDate(today);
    endInput.value = formatted;
    transactionFilters.endDate = formatted;
  }

  function clearActiveButton() {
    buttons.forEach((btn) => {
      btn.classList.remove("active");
    });

    activeButton = null;
  }

  function setStartDate(days) {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - days);
    const formattedStart = formatDate(start);
    startInput.value = formattedStart;
    transactionFilters.startDate = formattedStart;
    setTodayEndDate();
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.id === "clearDateFilter") {
        startInput.value = "";
        endInput.value = "";
        transactionFilters.startDate = "";
        transactionFilters.endDate = "";
        clearActiveButton();
        return;
      }

      if (activeButton === button) {
        startInput.value = "";
        endInput.value = "";
        transactionFilters.startDate = "";
        transactionFilters.endDate = "";
        clearActiveButton();
        return;
      }

      clearActiveButton();
      button.classList.add("active");
      activeButton = button;

      if (button.id === "filterLast7Days") {
        setStartDate(7);
      }

      if (button.id === "filterLast30Days") {
        setStartDate(30);
      }

      if (button.id === "filterLast6Months") {
        const today = new Date();
        const start = new Date();
        start.setMonth(today.getMonth() - 6);
        startInput.value = formatDate(start);
        transactionFilters.startDate = formatDate(start);
        setTodayEndDate();
      }

      if (button.id === "filterThisMonth") {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        startInput.value = formatDate(start);
        transactionFilters.startDate = formatDate(start);
        setTodayEndDate();
      }

      if (button.id === "filterThisYear") {
        const today = new Date();
        const start = new Date(today.getFullYear(), 0, 1);
        startInput.value = formatDate(start);
        transactionFilters.startDate = formatDate(start);
        setTodayEndDate();
      }
    });
  });
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
    setupFilterDropdowns();
    setupTransactionFilterPopup();
    setupFilterForm();
    setupFilterReset();
    setupQuickDateFilters();

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
