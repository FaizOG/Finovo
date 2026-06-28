// MODAL (open / close / date)

const modal = document.querySelector("#modalOverlay");

function initModal() {
  // close when clicking outside modal box
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // prevent page reload on submit + close modal + toster
  modal.addEventListener("submit", (e) => {
    e.preventDefault();

    const activeType = document.querySelector(".txn-btn.active").dataset.type;

    notify("transaction", "create", { type: activeType });

    closeModal();
  });
}

initModal();

// open modal + set today's date
function openModal() {
  modal.classList.add("active");

  requestAnimationFrame(() => {
    const expenseBtn = document.querySelector('.txn-btn[data-type="expense"]');

    if (!expenseBtn) return;

    document
      .querySelectorAll(".txn-btn")
      .forEach((btn) => btn.classList.remove("active"));
    expenseBtn.classList.add("active");

    const pill = document.querySelector(".active-pill");

    gsap.set(pill, {
      x: expenseBtn.offsetLeft,
      width: expenseBtn.offsetWidth,
    });

    changeTransactionType("expense");
  });

  document.querySelector("#dateInput").value = new Date()
    .toISOString()
    .split("T")[0];

  gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.2 });

  gsap.fromTo(
    ".modal",
    { y: 50, opacity: 0, scale: 0.95 },
    { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" },
  );
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
    },
  });
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
  document.querySelector("#accountMenu").classList.toggle("active");
}

function selectAccount(dets) {
  document
    .querySelectorAll("#accountMenu .dropdown-item")
    .forEach((i) => i.classList.remove("active"));

  dets.classList.add("active");

  document.getElementById("selectedAccount").textContent = dets.textContent;

  document.getElementById("accountMenu").classList.remove("active");
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

// init transaction buttons
function initTransactionType() {
  const buttons = document.querySelectorAll(".txn-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");

      changeTransactionType(btn.dataset.type);
    });
  });
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

initTransactionTabs();

// initialize default state
initTransactionType();
changeTransactionType("expense");

// EXPOSE FUNCTIONS TO HTML
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
