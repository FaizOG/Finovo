const STORAGE_KEY = "appData";

const defaultData = {
  accounts: [],
  transaction: [],
  budgets: [],
  goals: [],
  goalTransactions: [],
  settings: {
    theme: "dark",
    currency: "₹",
  },
};

if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
}

// 1. GET data
export function getData() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : defaultData;
}

// 2. SAVE full data
export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  window.dispatchEvent(new Event("appDataUpdated"));
}

// 3. UPDATE only parts safely
export function updateData(partial) {
  const current = getData();

  const updated = {
    ...current,
    ...partial,
    settings: {
      ...current.settings,
      ...(partial.settings || {}),
    },
  };

  saveData(updated);
}

export function changedSymbol() {
  const data = localStorage.getItem(STORAGE_KEY);
  // console.log(JSON.parse(data).settings.currency);
  return JSON.parse(data).settings.currency || "₹";
}

function updateCurrencyUI() {
  const symbol = changedSymbol();

  const totalEl = document.querySelector(".total__aside_balance h3 span");

  if (totalEl) {
    totalEl.textContent = symbol;
  }

  document.querySelectorAll(".currency-symbol").forEach((el) => {
    el.textContent = symbol;
  });
}

updateCurrencyUI();

export function clearData() {
  localStorage.removeItem(STORAGE_KEY);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));

  updateCurrencyUI();

  window.dispatchEvent(new Event("appDataUpdated"));

  notify.info("All data has been reset successfully.");
}
