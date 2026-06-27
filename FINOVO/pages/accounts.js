import { getData, updateData } from "../js/core/store.js";

const accountIcons = {
  bank: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round" class="lucide lucide-landmark size-5">
      <path d="M10 18v-7"></path>
      <path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"></path>
      <path d="M14 18v-7"></path>
      <path d="M18 18v-7"></path>
      <path d="M3 22h18"></path>
      <path d="M6 18v-7"></path>
    </svg>
  `,

  wallet: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round" class="lucide lucide-smartphone size-5">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
      <path d="M12 18h.01"></path>
    </svg>
  `,

  cash: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round" class="lucide lucide-wallet size-5">
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
    </svg>
  `,

  card: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round" class="lucide lucide-credit-card size-5">
      <rect width="20" height="14" x="2" y="5" rx="2"></rect>
      <line x1="2" x2="22" y1="10" y2="10"></line>
    </svg>
  `,
};

function createAccountPageHeader() {
  const section = document.createElement("section");

  section.innerHTML = `
  <div class="account-page-sub-header">
                        <div class="accounts-page-sub-header-left-content-area">
                            <h2 class="setting-tab-title">Accounts</h2>
                            <p class="setting-tab-subtitle">Manage cash, bank, credit and wallets</p>
                        </div>
                        <div class="accounts-page-sub-header-left-btn-container">
                            <div class="account-page-btn-container">
                                <button class="accounts-page-transfer-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="lucide lucide-arrow-left-right size-4 mr-1"
                                        aria-hidden="true">
                                        <path d="M8 3 4 7l4 4"></path>
                                        <path d="M4 7h16"></path>
                                        <path d="m16 21 4-4-4-4"></path>
                                        <path d="M20 17H4"></path>
                                    </svg>
                                    Transfer
                                </button>
                                <button class="accounts-page-new-account-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="lucide lucide-plus size-4 mr-1"
                                        aria-hidden="true">
                                        <path d="M5 12h14"></path>
                                        <path d="M12 5v14"></path>
                                    </svg>
                                    New account
                                </button>
                            </div>
                        </div>
                    </div>
  `;
  return section;
}

function createCardSection() {
  const section = document.createElement("section");
  section.className = "accounts-page-card-section";
  return section;
}

function getCurrencySymbol() {
  const data = getData();
  return data?.settings?.currency || "₹";
}

function updateAccountIcon(container, type) {
  if (!container) return;

  const key = type.toLowerCase().trim();
  container.innerHTML = accountIcons[key] || accountIcons.bank;
}

function createAccountCard({ id, name, type, openingBalance }) {
  const card = document.createElement("div");
  card.className = "account-details-card";
  card.dataset.id = id;
  const symbol = getCurrencySymbol();
  const key = type.toLowerCase().trim();

  card.innerHTML = `
        <div class="account-card-info">
            <div class="account-icon-name-and-type">
                <div class="account-icon-bg">
                  ${accountIcons[key] || accountIcons.bank}
                </div>

                <div class="account-name-and-type">
                    <p class="account-name">${name}</p>
                    <p class="account-type">${type}</p>
                </div>
            </div>

            <div class="card-delete-svg-container delete-account">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-trash2 lucide-trash-2 size-4" aria-hidden="true">
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                    <path d="M3 6h18"></path>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </div>
        </div>

        <div class="card-current-amount">
            <span class="amount">${symbol} ${openingBalance}</span>
        </div>

        <div class="card-opening-balance">
            Opening ${symbol} ${openingBalance}
        </div>
    `;

  const deleteBtn = card.querySelector(".delete-account");

  deleteBtn.addEventListener("click", () => {
    const accountId = Number(card.dataset.id);

    const data = getData();
    const updatedAccounts = (data.accounts || []).filter(
      (acc) => acc.id !== accountId,
    );

    updateData({ accounts: updatedAccounts });

    notify("account", "delete");

    gsap.to(card, {
      opacity: 0,
      scale: 0.9,
      x: 20,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        card.remove();

        // IMPORTANT: always read from store AFTER mutation
        requestAnimationFrame(() => {
          updateTransferButtonState();
        });
      },
    });
  });

  // notify("account", "create");
  return card;
}

let accountCardSection = null;

// Open Transfer Pop Up using transfer btn on accounts page
function getAccountsCount() {
  const data = getData();
  return data?.accounts?.length || 0;
}

function getAccounts() {
  return getData()?.accounts || [];
}

function updateTransferButtonState() {
  const btn = document.querySelector(".accounts-page-transfer-btn");
  if (!btn) return;

  const accounts = getData()?.accounts || [];
  const count = accounts.length;

  const shouldDisable = count < 2;

  btn.disabled = shouldDisable;
  btn.classList.toggle("disabled", shouldDisable);
  btn.title = shouldDisable ? "You need at least 2 accounts to transfer" : "";
}

function syncUI() {
  updateTransferButtonState();
}

function syncAccountsUI() {
  renderExistingAccounts(); // optional
  updateTransferButtonState();
}
// this create dynamic dropdown list
function buildAccountDropdownItems() {
  const data = getData();
  const accounts = data?.accounts || [];

  if (!accounts.length) {
    return `<div class="dropdown-item">No accounts</div>`;
  }

  return accounts
    .map((acc) => `<div class="dropdown-item">${acc.name} (${acc.type})</div>`)
    .join("");
}

function OpenTransferPopUp() {
  document
    .querySelector(".accounts-page-transfer-btn")
    .addEventListener("click", () => {
      if (getAccountsCount() < 2) return; // ✅ HARD STOP

      const overlay = document.querySelector(".transfer-modal-overlay");
      const modal = document.querySelector(".transfer-modal");

      const dropdowns = overlay.querySelectorAll(".dropdown-menu");

      dropdowns.forEach((menu) => {
        menu.innerHTML = buildAccountDropdownItems();
      });

      overlay.classList.add("show-pop-up");

      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2 });

      gsap.fromTo(
        modal,
        { scale: 0.9, y: 20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.3, ease: "power3.out" },
      );

      initAllDropdowns(overlay);
    });
}

// Closing Transfer Pop Up using "X btn" or "cancel btn" on transfer pop up
function closeTransferPopUp() {
  const overlay = document.querySelector(".transfer-modal-overlay");
  const modal = document.querySelector(".transfer-modal");

  gsap.to(modal, {
    scale: 0.9,
    y: 20,
    opacity: 0,
    duration: 0.2,
    ease: "power2.in",
  });

  gsap.to(overlay, {
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      overlay.classList.remove("show-pop-up");
    },
  });
}

function initTransferOverlayClose() {
  const overlay = document.querySelector(".transfer-modal-overlay");

  if (!overlay) return;

  overlay.addEventListener("click", (e) => {
    // only close if clicking outside modal
    if (e.target === overlay) {
      closeTransferPopUp();
    }
  });
}

// Open Transfer Pop Up using transfer btn on accounts page
function OpenAccountPopUp() {
  document
    .querySelector(".accounts-page-new-account-btn")
    .addEventListener("click", () => {
      const overlay = document.querySelector(".account-modal-overlay");
      const modal = document.querySelector(".account-modal");

      overlay.classList.add("show-pop-up");

      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2 });

      gsap.fromTo(
        modal,
        { scale: 0.9, y: 20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.3 },
      );

      // ✅ FIX: wait for DOM paint
      requestAnimationFrame(() => {
        initAllDropdowns(modal);
      });
    });
}

// Closing Transfer Pop Up using "X btn" or "cancel btn" on transfer pop up
function closeAccountPopUp() {
  const overlay = document.querySelector(".account-modal-overlay");
  const modal = document.querySelector(".account-modal");

  gsap.to(modal, {
    scale: 0.9,
    y: 20,
    opacity: 0,
    duration: 0.2,
  });

  gsap.to(overlay, {
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      overlay.classList.remove("show-pop-up");
    },
  });
}

// Drop Down

function initDropdown(dropdown) {
  const toggle = dropdown.querySelector("[data-toggle]");
  const menu = dropdown.querySelector(".dropdown-menu");
  const selected = dropdown.querySelector("[data-selected]");
  const items = dropdown.querySelectorAll(".dropdown-item");

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      items.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      selected.innerText = item.innerText;
      menu.classList.remove("active");

      // ✅ only update icon if this dropdown belongs to ACCOUNT FORM
      const accountModal = dropdown.closest(".account-modal");

      if (!accountModal) return;

      const iconContainer = accountModal.querySelector(".account-icon-bg");

      updateAccountIcon(iconContainer, item.innerText);
    });
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      menu.classList.remove("active");
    }
  });
}

function initAllDropdowns(root = document) {
  root.querySelectorAll("[data-dropdown]").forEach(initDropdown);
}

function initAccountFormSubmit() {
  const submitBtn = document.querySelector(".account-modal .submit");

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const name = document.querySelector(
      ".account-form-grid input[type='text']",
    ).value;

    const type = document.querySelector(
      ".account-modal [data-selected]",
    ).innerText;

    const openingBalance = Number(
      document.querySelector(".account-form-grid input[type='number']").value,
    );

    if (!name.trim()) return;

    const newAccount = {
      id: Date.now(),
      name,
      type,
      openingBalance,
      currentBalance: openingBalance,
    };

    const data = getData();
    const accounts = data.accounts || [];

    accounts.push(newAccount);
    updateData({ accounts });

    const card = createAccountCard(newAccount);
    accountCardSection.appendChild(card);

    updateTransferButtonState();

    closeAccountPopUp();
    document.querySelector(".account-form-grid").reset();
  });
}

function renderExistingAccounts() {
  const data = getData();
  const accounts = data?.accounts || [];

  accounts.forEach((account) => {
    const card = createAccountCard(account);
    accountCardSection.appendChild(card);
  });
}

window.closeAccountPopUp = closeAccountPopUp;

// make it accessible from HTML onclick
window.closeTransferPopUp = closeTransferPopUp;

export default {
  mount(container) {
    container.appendChild(createAccountPageHeader());

    accountCardSection = createCardSection();
    container.appendChild(accountCardSection);

    renderExistingAccounts();

    OpenTransferPopUp();
    initTransferOverlayClose();

    OpenAccountPopUp();
    closeAccountPopUp();
    initAccountFormSubmit();

    updateTransferButtonState();
  },
};
