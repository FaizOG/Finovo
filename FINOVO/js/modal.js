import { buildAccountDropdownItems } from "./../pages/accounts.js";
import { getData, updateData } from "./core/store.js";

// MODAL (open / close / date)

let editingTransactionId = null;
const modal = document.querySelector("#modalOverlay");

function refreshAccountDropdown() {
  const menu = document.querySelector("#accountMenu");

  if (!menu) return;

  menu.innerHTML = buildAccountDropdownItems();

  const items = menu.querySelectorAll(".dropdown-item");

  items.forEach((item) => {
    item.addEventListener("click", () => {
      selectAccount(item);
    });
  });

  // set first account as default
  // const firstAccount = items[0];

  // if (firstAccount) {
  //   selectAccount(firstAccount);
  // }

  const selected = document.querySelector("#selectedAccount");

  selected.textContent = "Select account";

  delete selected.dataset.accountId;
}

function validateTransaction(type) {
  const amountInput = document.querySelector("#amountInput");

  const dateInput = document.querySelector("#dateInput");

  const amount = Number(amountInput.value);

  if (!amount || amount <= 0) {
    notify.warning("Please enter a valid amount");

    amountInput.focus();

    return false;
  }

  if (!dateInput.value) {
    notify.warning("Please select transaction date");

    dateInput.focus();

    return false;
  }

  if (type === "expense" || type === "income") {
    const selectedAccount = document.querySelector("#selectedAccount");

    if (!selectedAccount.dataset.accountId) {
      notify.warning("Please select an account");

      return false;
    }

    const category = document
      .querySelector("#selectedCategory")
      .textContent.trim();

    if (!category) {
      notify.warning("Please select category");

      return false;
    }
  }

  return true;
}

function updateTransactionBalance(oldTransaction, newTransaction, accounts) {
  reverseTransaction(oldTransaction, accounts);

  applyTransactionBalance(newTransaction, accounts);
}

function saveTransaction(type) {
  const data = getData();

  const amount = Number(document.querySelector("#amountInput").value);

  const date = document.querySelector("#dateInput").value;

  const note = document.querySelector("#noteInput").value.trim();

  const category = document
    .querySelector("#selectedCategory")
    .textContent.trim();

  const selectedAccount = document.querySelector("#selectedAccount");

  const accountId = Number(selectedAccount.dataset.accountId);

  const account = data.accounts.find((acc) => acc.id === accountId);

  if (!account) {
    notify.error("Account not found");
    return false;
  }

  // ==========================
  // EDIT MODE
  // ==========================

  if (editingTransactionId) {
    const oldTransaction = data.transaction.find(
      (t) => t.id === editingTransactionId,
    );

    if (!oldTransaction) {
      return false;
    }

    updateTransactionBalance(oldTransaction, {
      type,
      amount,
      accountId,
    });

    const updatedTransaction = {
      ...oldTransaction,

      type,

      amount,

      date,

      category,

      accountId,

      accountName: account.name,

      note,

      updatedAt: new Date().toISOString(),
    };

    const index = data.transaction.findIndex(
      (t) => t.id === editingTransactionId,
    );

    data.transaction[index] = updatedTransaction;

    updateData({
      accounts: data.accounts,

      transaction: data.transaction,
    });

    window.dispatchEvent(new Event("appDataUpdated"));

    return updatedTransaction;
  }

  // ==========================
  // CREATE MODE
  // ==========================

  applyTransactionBalance(
    {
      type,
      amount,
      accountId,
    },
    data.accounts,
  );

  const transaction = {
    id: Date.now(),

    type,

    amount,

    date,

    category,

    accountId,

    accountName: account.name,

    note,

    createdAt: new Date().toISOString(),
  };

  const transactions = data.transaction || [];

  transactions.push(transaction);

  updateData({
    accounts: data.accounts,

    transaction: transactions,
  });

  window.dispatchEvent(new Event("appDataUpdated"));

  return transaction;
}

function applyTransactionBalance(transaction, accounts) {
  const account = accounts.find((acc) => acc.id === transaction.accountId);

  if (!account) return;

  if (transaction.type === "expense") {
    account.currentBalance -= Number(transaction.amount);
  }

  if (transaction.type === "income") {
    account.currentBalance += Number(transaction.amount);
  }
}

function reverseTransaction(transaction, accounts) {
  const account = accounts.find((acc) => acc.id === transaction.accountId);

  if (!account) return;

  if (transaction.type === "expense") {
    account.currentBalance += Number(transaction.amount);
  }

  if (transaction.type === "income") {
    account.currentBalance -= Number(transaction.amount);
  }
}

function initModal() {
  // close when clicking outside modal box
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // prevent page reload on submit + close modal + toster
  modal.addEventListener("submit", (e) => {
    e.preventDefault();

    const activeType = document.querySelector(".txn-btn.active").dataset.type;

    if (!validateTransaction(activeType)) {
      return;
    }

    const amount = Number(document.querySelector("#amountInput").value);

    const selectedAccount = document.querySelector("#selectedAccount");

    const accountId = Number(selectedAccount.dataset.accountId);

    if (activeType === "expense") {
      const data = getData();

      const account = data.accounts.find((acc) => acc.id === accountId);

      let availableBalance = account.currentBalance;

      // if editing expense, add back old amount first
      if (editingTransactionId && activeType === "expense") {
        const oldTransaction = getData().transaction.find(
          (t) => t.id === editingTransactionId,
        );

        if (oldTransaction && oldTransaction.type === "expense") {
          availableBalance += Number(oldTransaction.amount);
        }
      }

      if (amount > availableBalance) {
        notify.warning(
          `Insufficient balance. Available: ₹${account.currentBalance}`,
        );

        return;
      }

      const result = saveTransaction("expense");

      if (result) {
        notify.success(
          editingTransactionId
            ? "Expense updated successfully"
            : "Expense added successfully",
        );
      }
    }

    if (activeType === "income") {
      const result = saveTransaction("income");

      if (result) {
        notify.success(
          editingTransactionId
            ? "Income updated successfully"
            : "Income added successfully",
        );
      }
    }

    if (activeType === "transfer") {
      notify.info("Transfer completed");
    }

    closeModal();
  });
}

initModal();

// open modal + set today's date
// let editingTransactionId = null;

function openModal(transactionId = null) {
  editingTransactionId = transactionId;

  modal.classList.add("active");

  refreshAccountDropdown();

  requestAnimationFrame(() => {
    const buttons = document.querySelectorAll(".txn-btn");

    let activeBtn;

    // EDIT MODE
    if (transactionId) {
      const data = getData();

      const transaction = data.transaction.find((t) => t.id === transactionId);

      if (transaction) {
        activeBtn = document.querySelector(
          `.txn-btn[data-type="${transaction.type}"]`,
        );
      }
    }

    // CREATE MODE DEFAULT = EXPENSE
    if (!activeBtn) {
      activeBtn = document.querySelector('.txn-btn[data-type="expense"]');
    }

    if (!activeBtn) return;

    buttons.forEach((btn) => btn.classList.remove("active"));

    activeBtn.classList.add("active");

    const pill = document.querySelector(".active-pill");

    if (pill) {
      gsap.set(pill, {
        x: activeBtn.offsetLeft,

        width: activeBtn.offsetWidth,
      });
    }

    changeTransactionType(activeBtn.dataset.type);

    // EDIT MODE FILL DATA
    if (transactionId) {
      fillTransactionData(transactionId);
    }
  });

  // CREATE MODE DATE
  if (!transactionId) {
    const today = new Date();

    const localDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    document.querySelector("#dateInput").value = localDate;
  }

  gsap.fromTo(
    modal,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.2,
    },
  );

  gsap.fromTo(
    ".modal",
    {
      y: 50,
      opacity: 0,
      scale: 0.95,
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "power3.out",
    },
  );
}

function fillTransactionData(id) {
  const data = getData();

  const transaction = data.transaction.find((t) => t.id === id);

  if (!transaction) return;

  document.querySelector("#amountInput").value = transaction.amount;

  document.querySelector("#dateInput").value = transaction.date;

  document.querySelector("#noteInput").value = transaction.note || "";

  const categoryMenu = document.querySelector("#dropdownMenu");

  document.querySelectorAll("#dropdownMenu .dropdown-item").forEach((item) => {
    item.classList.remove("active");

    if (item.textContent.trim() === transaction.category) {
      item.classList.add("active");
    }
  });

  document.querySelector("#selectedCategory").textContent =
    transaction.category;

  // select account

  const accountItem = document.querySelector(
    `#accountMenu .dropdown-item[data-id="${transaction.accountId}"]`,
  );

  if (accountItem) {
    selectAccount(accountItem);
  }
}

// close modal
function closeModal() {
  gsap.to(".modal", {
    y: 30,
    opacity: 0,
    scale: 0.95,
    duration: 0.25,
    ease: "power2.in",
  });

  gsap.to(modal, {
    opacity: 0,
    duration: 0.25,

    onComplete: () => {
      modal.classList.remove("active");

      editingTransactionId = null;

      resetModal();
    },
  });
}

function resetModal() {
  const form = document.querySelector("#modalOverlay");

  if (!form) return;

  // reset inputs
  form.reset();

  // reset account selection
  const selectedAccount = document.querySelector("#selectedAccount");

  if (selectedAccount) {
    selectedAccount.textContent = "Select account";
    delete selectedAccount.dataset.accountId;
  }

  // remove account balance info
  const balanceBox = document.querySelector("#accountBalanceInfo");

  if (balanceBox) {
    balanceBox.textContent = "";
  }

  // reset category
  const selectedCategory = document.querySelector("#selectedCategory");

  if (selectedCategory) {
    selectedCategory.textContent = "Food";
  }

  // reset dropdown menus
  document
    .querySelectorAll(".dropdown-menu")
    .forEach((menu) => menu.classList.remove("active"));

  document
    .querySelectorAll(".dropdown-item")
    .forEach((item) => item.classList.remove("active"));

  // reset transaction tab to expense
  const buttons = document.querySelectorAll(".txn-btn");

  buttons.forEach((btn) => btn.classList.remove("active"));

  const expenseBtn = document.querySelector('.txn-btn[data-type="expense"]');

  if (expenseBtn) {
    expenseBtn.classList.add("active");

    const pill = document.querySelector(".active-pill");

    if (pill) {
      gsap.set(pill, {
        x: expenseBtn.offsetLeft,
        width: expenseBtn.offsetWidth,
      });
    }
  }

  changeTransactionType("expense");

  // reset date
  const dateInput = document.querySelector("#dateInput");

  if (dateInput) {
    const today = new Date();

    dateInput.value = `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  }
}

// CATEGORY DROPDOWN

// open/close category dropdown
function toggleDropdown() {
  document.getElementById("dropdownMenu").classList.toggle("active");
}

// select category item
function selectCategory(dets) {
  document
    .querySelectorAll("#dropdownMenu .dropdown-item")
    .forEach((i) => i.classList.remove("active"));

  dets.classList.add("active");

  document.getElementById("selectedCategory").textContent = dets.textContent;

  document.getElementById("dropdownMenu").classList.remove("active");
}

// click delegation for category dropdown
function initCategoryDropdown() {
  const menu = document.getElementById("dropdownMenu");

  menu.addEventListener("click", (e) => {
    if (e.target.classList.contains("dropdown-item")) {
      selectCategory(e.target);
    }
  });
}

initCategoryDropdown();

// ACCOUNT DROPDOWN

function toggleAccountDropdown() {
  const menu = modal.querySelector("#accountMenu");

  menu.classList.toggle("active");
}

function selectAccount(dets) {
  document
    .querySelectorAll("#accountMenu .dropdown-item")
    .forEach((i) => i.classList.remove("active"));

  dets.classList.add("active");

  const selected = document.getElementById("selectedAccount");

  selected.textContent = dets.textContent;

  selected.dataset.accountId = dets.dataset.id;

  document.getElementById("accountMenu").classList.remove("active");

  showSelectedAccountBalance();
}

// TRANSFER DROPDOWNS

// FROM ACCOUNT
function toggleFromDropdown() {
  document.querySelector("#fromAccountMenu").classList.toggle("active");
}

function selectFromAccount(dets) {
  document
    .querySelectorAll("#fromAccountMenu .dropdown-item")
    .forEach((i) => i.classList.remove("active"));

  dets.classList.add("active");

  document.querySelector("#selectedFromAccount").textContent = dets.textContent;

  document.querySelector("#fromAccountMenu").classList.remove("active");
}

// TO ACCOUNT
function toggleToDropdown() {
  document.querySelector("#toAccountMenu").classList.toggle("active");
}

function selectToAccount(dets) {
  document
    .querySelectorAll("#toAccountMenu .dropdown-item")
    .forEach((i) => i.classList.remove("active"));

  dets.classList.add("active");

  document.querySelector("#selectedToAccount").textContent = dets.textContent;

  document.querySelector("#toAccountMenu").classList.remove("active");
}

// TRANSACTION TYPE SYSTEM
// expense / income / transfer

// expense categories
function loadExpenseCategories() {
  const menu = document.querySelector("#dropdownMenu");

  menu.innerHTML = `
        <div class="dropdown-item active">Food</div>
        <div class="dropdown-item">Transport</div>
        <div class="dropdown-item">Bills</div>
        <div class="dropdown-item">Shopping</div>
    `;

  document.getElementById("selectedCategory").textContent = "Food";
}

// income categories
function loadIncomeCategories() {
  const menu = document.querySelector("#dropdownMenu");

  menu.innerHTML = `
        <div class="dropdown-item active">Salary</div>
        <div class="dropdown-item">Freelance</div>
        <div class="dropdown-item">Interest</div>
        <div class="dropdown-item">Investment</div>
    `;

  document.getElementById("selectedCategory").textContent = "Salary";
}

// switch UI based on transaction type
function changeTransactionType(type) {
  const categoryField = document.querySelector("#field1");
  const accountField = document.querySelector("#accountField");
  const fromField = document.querySelector("#transferFromField");
  const toField = document.querySelector("#transferToField");
  const categoryLabel = document.querySelector("#field1Label");

  if (type === "expense") {
    categoryLabel.textContent = "Category";

    categoryField.classList.remove("hidden");
    accountField.classList.remove("hidden");

    fromField.classList.add("hidden");
    toField.classList.add("hidden");

    loadExpenseCategories();
  }

  if (type === "income") {
    categoryLabel.textContent = "Category";

    categoryField.classList.remove("hidden");
    accountField.classList.remove("hidden");

    fromField.classList.add("hidden");
    toField.classList.add("hidden");

    loadIncomeCategories();
  }

  if (type === "transfer") {
    categoryField.classList.add("hidden");
    accountField.classList.add("hidden");

    fromField.classList.remove("hidden");
    toField.classList.remove("hidden");
  }
}

function initTransactionTabs() {
  const container = document.querySelector(".txn-type");
  const buttons = document.querySelectorAll(".txn-btn");
  const pill = document.querySelector(".active-pill");

  if (!container || !buttons.length || !pill) return;

  let activeBtn = document.querySelector(".txn-btn.active");

  // -----------------------------
  // MOVE PILL FUNCTION (ANIMATION)
  // -----------------------------
  function movePill(target, animate = true) {
    if (!target) return;

    const x = target.offsetLeft;
    const w = target.offsetWidth;

    if (!animate) {
      gsap.set(pill, {
        x,
        width: w,
      });
      return;
    }

    gsap.to(pill, {
      x,
      width: w,
      duration: 0.35,
      ease: "power1.inOut",
    });
  }

  // -----------------------------
  // SET INITIAL STATE
  // -----------------------------
  window.addEventListener("DOMContentLoaded", () => {
    activeBtn = document.querySelector(".txn-btn.active") || buttons[0];
    activeBtn.classList.add("active");
    movePill(activeBtn, false);
    changeTransactionType(activeBtn.dataset.type);
  });

  // -----------------------------
  // CLICK HANDLERS
  // -----------------------------
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn === activeBtn) return;

      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      activeBtn = btn;

      movePill(btn, true);
      changeTransactionType(btn.dataset.type);
    });
  });

  // -----------------------------
  // RESIZE FIX
  // -----------------------------
  window.addEventListener("resize", () => {
    movePill(activeBtn, false);
  });
}

function showSelectedAccountBalance() {
  const accountId = Number(
    document.querySelector("#selectedAccount").dataset.accountId,
  );

  if (!accountId) return;

  const data = getData();

  const account = data.accounts.find((acc) => acc.id === accountId);

  if (!account) return;

  const balanceBox = document.querySelector("#accountBalanceInfo");

  if (balanceBox) {
    balanceBox.textContent = `Available balance: ₹${account.currentBalance}`;
  }
}

initTransactionTabs();

changeTransactionType("expense");

window.openModal = openModal;
window.closeModal = closeModal;

window.toggleDropdown = toggleDropdown;
window.selectCategory = selectCategory;

window.toggleAccountDropdown = toggleAccountDropdown;
window.selectAccount = selectAccount;

window.toggleFromDropdown = toggleFromDropdown;
window.selectFromAccount = selectFromAccount;

window.toggleToDropdown = toggleToDropdown;
window.selectToAccount = selectToAccount;
