import { getData, updateData } from "../core/store.js";

/**
 - Entry point for transfer modal functionality.
 - Initializes popup open, close behavior, and form logic.
 */

export function initTransfer() {
  OpenTransferPopUp();
  initTransferOverlayClose();
  initTransferForm();
  initTransferOverlayClose();
}



/**
 (Opens the transfer modal when the "Transfer" button is clicked.)
 - Validates that at least 2 accounts exist
 - Resets selection state
 - Builds dropdown options
 - Animates modal appearance using GSAP
 */

function OpenTransferPopUp() {
  document
    .querySelector(".accounts-page-transfer-btn")
    .addEventListener("click", () => {
      const accounts = getData().accounts || [];

      if (accounts.length < 2) return;

      const overlay = document.querySelector(".transfer-modal-overlay");
      const modal = document.querySelector(".transfer-modal");

      const dropdowns = overlay.querySelectorAll(".dropdown-menu");

      transferSelection = {
        from: null,
        to: null,
      };

      refreshTransferDropdowns();

      overlay.classList.add("show-pop-up");

      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2 });

      gsap.fromTo(
        modal,
        { scale: 0.9, y: 20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.3, ease: "power3.out" },
      );
    });
}

// Closes transfer modal with animation and resets UI state.
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

      resetTransferForm();
    },
  });
}

// Closes modal when clicking outside the modal content (on overlay only).
function initTransferOverlayClose() {
  const overlay = document.querySelector(".transfer-modal-overlay");

  if (!overlay) return;

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeTransferPopUp();
    }
  });
}

/**
 Holds current transfer form state:
 - from: source account id
 - to: destination account id
 - amount: transfer amount (future use)
 */

let transferSelection = {
  from: null,
  to: null,
  amount: "",
  note: "",
};

/**
 - Builds dropdown HTML items for account selection.
 - Optionally excludes one account (used to prevent selecting same account in both dropdowns).
 */

function buildAccountDropdownItems(excludeId = null) {
  const accounts = getData().accounts || [];

  return accounts
    .filter((acc) => acc.id !== excludeId)
    .map(
      (acc) => `
            <div
                class="dropdown-item"
                data-id="${acc.id}">
                ${acc.name} (${acc.type})
            </div>
        `,
    )
    .join("");
}

/**
 -Refreshes both "from" and "to" dropdowns based on current selection.
 -Prevents selecting the same account in both fields.
 */
function refreshTransferDropdowns() {
  const fromMenu = document.querySelector(".from-dropdown .dropdown-menu");
  const toMenu = document.querySelector(".to-dropdown .dropdown-menu");

  fromMenu.innerHTML = buildAccountDropdownItems(transferSelection.to);
  toMenu.innerHTML = buildAccountDropdownItems(transferSelection.from);

  initTransferDropdowns();
}

/**
 Initializes dropdown interactions inside the transfer modal:
 - Toggle dropdown visibility
 - Handle selection
 - Update transferSelection state
 - Refresh dropdowns to enforce valid choices
 */
function initTransferDropdowns() {
  document
    .querySelectorAll(".transfer-modal [data-dropdown]")
    .forEach((dropdown) => {
      const toggle = dropdown.querySelector("[data-toggle]");
      const menu = dropdown.querySelector(".dropdown-menu");
      const selected = dropdown.querySelector("[data-selected]");

      toggle.onclick = (e) => {
        e.stopPropagation();
        menu.classList.toggle("active");
      };

      menu.querySelectorAll(".dropdown-item").forEach((item) => {
        item.onclick = () => {
          const id = Number(item.dataset.id);

          selected.innerText = item.innerText;

          menu.classList.remove("active");

          if (dropdown.classList.contains("from-dropdown")) {
            transferSelection.from = id;
          } else {
            transferSelection.to = id;
          }

          refreshTransferDropdowns();
        };
      });
    });
}

// Resets transfer form state and UI after modal close.
function resetTransferForm() {
  transferSelection = {
    from: null,
    to: null,
  };

  const form = document.querySelector(".transfer-modal-overlay");

  if (form) {
    form.reset();
  }

  document.querySelector(".from-dropdown [data-selected]").innerText =
    "Select account";

  document.querySelector(".to-dropdown [data-selected]").innerText =
    "Select account";

  refreshTransferDropdowns();
}


function initTransferForm() {
  //    main functionality here
}


// const form = document.querySelector(".transfer-modal-overlay");
// console.log("Form:", form);

const transferSubmitBtn = document.querySelector(".transfer-popup-submit-btn");
// console.log("Button:", transferSubmitBtn);
transferSubmitBtn.addEventListener("click", function(){
    const AccountFrom = document.querySelector(".fromAccountValue data-selected").innerHTML
    console.log(AccountFrom);
    
})


// Expose close function globally (used by UI buttons in HTML)
window.closeTransferPopUp = closeTransferPopUp;
