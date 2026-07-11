import { getData } from "./store.js";

export function getTotalBalance() {
  const data = getData();

  return data.accounts.reduce(
    (total, account) => total + Number(account.currentBalance || 0),
    0,
  );
}

export function getMonthlyIncome() {
  const data = getData();

  const now = new Date();

  return data.transaction
    .filter((item) => {
      const date = new Date(item.date);

      return (
        item.type === "income" &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((total, item) => total + Number(item.amount || 0), 0);
}

export function getMonthlyExpenses() {
  const data = getData();

  const now = new Date();

  return data.transaction
    .filter((item) => {
      const date = new Date(item.date);

      return (
        item.type === "expense" &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((total, item) => total + Number(item.amount || 0), 0);
}

export function getSavingsAmount() {
  const data = getData();

  return data.goals.reduce(
    (total, goal) => total + Number(goal.savedAmount || 0),
    0,
  );
}

export function getMonthlyNet() {
  return getMonthlyIncome() - getMonthlyExpenses();
}
