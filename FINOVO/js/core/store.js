const STORAGE_KEY = "appData";

// Default structure (VERY IMPORTANT)
const defaultData = {
  accounts: [],
  settings: {
    theme: "dark",
    currency: "₹"
  }
};

// 1. GET data
export function getData() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : defaultData;
}

// 2. SAVE full data
export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 3. UPDATE only parts safely
export function updateData(partial) {
  const current = getData();

  const updated = {
    ...current,
    ...partial,
    settings: {
      ...current.settings,
      ...(partial.settings || {})
    }
  };

  saveData(updated);
}