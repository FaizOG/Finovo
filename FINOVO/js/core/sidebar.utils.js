import { changedSymbol } from "./store.js";

import { getTotalBalance, getMonthlyNet } from "./dashboard.utils.js";

export function updateSidebarBalance() {
  const symbol = changedSymbol();

  const balanceElement = document.querySelector(".total-balance-value");

  const currencyElements = document.querySelectorAll(".currency-symbol");

  const netElement = document.querySelector(".net-month-value");

  if (balanceElement) {
    balanceElement.textContent = Number(getTotalBalance()).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
      },
    );
  }

  currencyElements.forEach((element) => {
    element.textContent = symbol;
  });

  if (netElement) {
    const net = getMonthlyNet();

    const sign = net >= 0 ? "+" : "-";

    netElement.innerHTML = `${sign}<span class="currency-symbol"> ${symbol} </span>${Math.abs(
      net,
    ).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}`;

    // Update color classes
    netElement.classList.toggle("negative", net < 0);
    netElement.classList.toggle("positive", net >= 0);
  }
}
