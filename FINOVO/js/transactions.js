// transactions.js

// creating dynamic drop down option for Expence category.
function loadExpenseCategories() {
    const menu = document.querySelector("#dropdownMenu");
    console.log("hi");
    

    menu.innerHTML = `
        <div class="dropdown-item active">Food</div>
        <div class="dropdown-item">Transport</div>
        <div class="dropdown-item">Bills</div>
        <div class="dropdown-item">Shopping</div>
    `;

    document.getElementById("selectedCategory").textContent = "Food";
}

// creating dynamic drop down option for Income category.
function loadIncomeCategories() {
    const menu = document.getElementById("dropdownMenu");

    menu.innerHTML = `
        <div class="dropdown-item active">Salary</div>
        <div class="dropdown-item">Freelance</div>
        <div class="dropdown-item">Interest</div>
        <div class="dropdown-item">Investment</div>
    `;

    document.getElementById("selectedCategory").textContent = "Salary";
}

// Chnage the form layout based on transaction type (expense, income or transfer)
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

// transfer active btn status when clicked on expence, income or transfer
function initTransactionType() {
    const buttons = document.querySelectorAll(".txn-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            changeTransactionType(btn.dataset.type);
        });
    });
}

// Initialize button click functionality
initTransactionType();

// Set default form state when page loads & Expense form is shown initially
changeTransactionType("expense");