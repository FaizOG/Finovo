import { getData, updateData } from "../js/core/store.js";

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
  `
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

function createAccountCard({ name, type, openingBalance }) {
    const card = document.createElement("div");
    card.className = "account-details-card";
    const symbol = getCurrencySymbol();

    card.innerHTML = `
        <div class="account-card-info">
            <div class="account-icon-name-and-type">
                <div class="account-icon-bg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-landmark size-5" aria-hidden="true">
                        <path d="M10 18v-7"></path>
                        <path
                        d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z">
                        </path>
                        <path d="M14 18v-7"></path>
                        <path d="M18 18v-7"></path>
                        <path d="M3 22h18"></path>
                        <path d="M6 18v-7"></path>
                    </svg>
                </div>

                <div class="account-name-and-type">
                    <p class="account-name">${name}</p>
                    <p class="account-type">${type}</p>
                </div>
            </div>

            <div class="card-delete-svg-container">
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

    notify("account", "create");
    return card;

}



let accountCardSection = null;

// Open Transfer Pop Up using transfer btn on accounts page
function OpenTransferPopUp() {
    document
        .querySelector(".accounts-page-transfer-btn")
        .addEventListener("click", () => {

            const overlay = document.querySelector(".transfer-modal-overlay");
            const modal = document.querySelector(".transfer-modal");

            overlay.classList.add("show-pop-up");

            gsap.fromTo(
                overlay,
                { opacity: 0 },
                { opacity: 1, duration: 0.2 }
            );

            gsap.fromTo(
                modal,
                { scale: 0.9, y: 20, opacity: 0 },
                { scale: 1, y: 0, opacity: 1, duration: 0.3, ease: "power3.out" }
            );
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
        ease: "power2.in"
    });

    gsap.to(overlay, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
            overlay.classList.remove("show-pop-up");
        }
    });
}


// make it accessible from HTML onclick
window.closeTransferPopUp = closeTransferPopUp;

// Open Transfer Pop Up using transfer btn on accounts page
function OpenAccountPopUp() {
    document.querySelector(".accounts-page-new-account-btn")
        .addEventListener("click", () => {
            const overlay = document.querySelector(".account-modal-overlay");
            const modal = document.querySelector(".account-modal");

            overlay.classList.add("show-pop-up");

            gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2 });

            gsap.fromTo(modal,
                { scale: 0.9, y: 20, opacity: 0 },
                { scale: 1, y: 0, opacity: 1, duration: 0.3 }
            );
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
        duration: 0.2
    });

    gsap.to(overlay, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
            overlay.classList.remove("show-pop-up");
        }
    });
}

function initAccountFormSubmit() {
    const submitBtn = document.querySelector(".account-modal .submit");

    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const name = document.querySelector(".account-form-grid input[type='text']").value;
        const type = document.querySelector("[data-selected]").innerText;
        const openingBalance = Number(
            document.querySelector(".account-form-grid input[type='number']").value
        );

        if (!name.trim()) return;

        // 1. Create new account object
        const newAccount = {
            id: Date.now(),
            name,
            type,
            openingBalance,
            currentBalance: openingBalance
        };

        // 2. Load existing data
        const data = getData();

        // 3. Add new account
        data.accounts.push(newAccount);

        // 4. Save updated data
        updateData({ accounts: data.accounts });

        // 5. Update UI
        const card = createAccountCard(newAccount);
        accountCardSection.appendChild(card);

        // 6. Close modal + reset form
        closeAccountPopUp();
        document.querySelector(".account-form-grid").reset();
    });
}

window.closeAccountPopUp = closeAccountPopUp;

// make it accessible from HTML onclick
window.closeAccountPopUp = closeAccountPopUp;


export default {
    mount(container) {

        container.appendChild(createAccountPageHeader());

        accountCardSection = createCardSection();
        container.appendChild(accountCardSection);

        OpenAccountPopUp();
        closeAccountPopUp();
        initAccountFormSubmit();
    }
};