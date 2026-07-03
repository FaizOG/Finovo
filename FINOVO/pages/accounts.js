import { getData, updateData } from "../js/core/store.js";
import { initTransfer } from "../js/features/transfer.js";

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

function createAccountCard({ id, name, type, openingBalance, currentBalance }) {
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
            <span class="amount" data-balance>${symbol} ${currentBalance}</span>
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

    notify.warning(
      `"${card.querySelector(".account-name").textContent}" deleted`,
    );

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

// Closing Transfer Pop Up using "X btn" or "cancel btn" on transfer pop up

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

      requestAnimationFrame(() => {
        initAllDropdowns(modal); // ← uncomment this
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
  if (dropdown.dataset.initialized) return;
  dropdown.dataset.initialized = "true";

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

    notify.success(`"${newAccount.name}" account created`);

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

export function refreshAccountsUI() {
  if (!accountCardSection) return;

  accountCardSection.innerHTML = "";

  renderExistingAccounts();

  updateTransferButtonState();
}

window.closeAccountPopUp = closeAccountPopUp;

const styles = getComputedStyle(document.documentElement);

const primary = styles.getPropertyValue("--primary").trim();
const text = styles.getPropertyValue("--text").trim();

function animateBalanceChange(el, fromValue, toValue, type = "up") {
  const obj = { value: fromValue };

  const flashClass =
    type === "up" ? "up-flash" : type === "down" ? "down-flash" : "";

  const finalColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--text")
    .trim();

  // number animation
  gsap.fromTo(
    obj,
    { value: fromValue },
    {
      value: toValue,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = `${getCurrencySymbol()} ${Math.floor(obj.value)}`;
      },
    },
  );

  // RESET FIRST (important)
  el.classList.remove("up-flash", "down-flash");

  // force reflow so class re-triggers properly
  void el.offsetWidth;

  // apply flash class
  el.classList.add(flashClass);

  // animation
  gsap.fromTo(
    el,
    { scale: 1 },
    {
      scale: 1.15,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
      onComplete: () => {
        el.classList.remove("up-flash", "down-flash");

        // restore base color cleanly
        el.style.color = finalColor;
      },
    },
  );
}

export function animateTransferUI(
  fromId,
  toId,
  fromOld,
  fromNew,
  toOld,
  toNew,
) {
  requestAnimationFrame(() => {
    const fromEl = document.querySelector(
      `.account-details-card[data-id="${fromId}"] [data-balance]`,
    );

    const toEl = document.querySelector(
      `.account-details-card[data-id="${toId}"] [data-balance]`,
    );

    if (!fromEl || !toEl) return;

    // 💸 NEW: flying money effect (use OLD amount for realism)
    createMoneyFly(fromEl, toEl, fromOld - fromNew);

    // balance animations
    animateBalanceChange(fromEl, fromOld, fromNew, "down");
    gsap.delayedCall(0.1, () => {
      animateATMCount(toEl, toOld, toNew);
    });

    const fromRect = fromEl.getBoundingClientRect();

    // 💥 burst at sender
    createParticles(
      fromRect.left + fromRect.width / 2,
      fromRect.top + fromRect.height / 2,
    );
  });
}

function createMoneyFly(fromEl, toEl, amount) {
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();

  const fly = document.createElement("div");

  fly.textContent = `${getCurrencySymbol()} ${Math.floor(amount)}`;
  fly.style.position = "fixed";
  fly.style.left = `${fromRect.left + fromRect.width / 2}px`;
  fly.style.top = `${fromRect.top}px`;
  fly.style.zIndex = "9999";
  fly.style.padding = "6px 10px";
  fly.style.borderRadius = "999px";
  fly.style.background = "#11151d";
  fly.style.color = "#d7f000";
  fly.style.fontSize = "12px";
  fly.style.fontWeight = "600";
  fly.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
  fly.style.pointerEvents = "none";

  document.body.appendChild(fly);

  gsap.to(fly, {
    x: toRect.left - fromRect.left,
    y: toRect.top - fromRect.top,
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: "power2.inOut",
    onComplete: () => fly.remove(),
  });

  // small pop at start
  gsap.fromTo(
    fly,
    { scale: 0.5 },
    { scale: 1, duration: 0.2, ease: "back.out(2)" },
  );
}

function createParticles(x, y) {
  const colors = ["#d7f000", "#22c55e", "#ffffff"];

  for (let i = 0; i < 12; i++) {
    const p = document.createElement("div");

    p.style.position = "fixed";
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.width = "6px";
    p.style.height = "6px";
    p.style.borderRadius = "50%";
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.zIndex = "9999";
    p.style.pointerEvents = "none";

    document.body.appendChild(p);

    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 60;

    gsap.to(p, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: 0,
      scale: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => p.remove(),
    });
  }
}

function animateATMCount(el, fromValue, toValue) {
  const obj = { value: fromValue };

  gsap.to(obj, {
    value: toValue,
    duration: 0.9,
    ease: "power1.out",
    onUpdate: () => {
      el.textContent = `${getCurrencySymbol()} ${Math.floor(obj.value)}`;
    },
  });
}

export default {
  mount(container) {
    container.appendChild(createAccountPageHeader());

    accountCardSection = createCardSection();
    container.appendChild(accountCardSection);

    renderExistingAccounts();

    // OpenTransferPopUp();
    // initTransferOverlayClose();
    initTransfer();

    OpenAccountPopUp();
    closeAccountPopUp();
    initAccountFormSubmit();

    updateTransferButtonState();
  },
};
