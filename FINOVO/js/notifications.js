(function () {

    const container = document.createElement("div");
    container.id = "toast-container";
    document.body.prepend(container);

    let isHovered = false;

    container.addEventListener("mouseenter", () => {
        isHovered = true;
        updateStack();
    });

    container.addEventListener("mouseleave", () => {
        isHovered = false;
        updateStack();
    });

    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        updateStack();

        setTimeout(() => {
            toast.remove();
            updateStack();
        }, 5000);
    }
    function updateStack() {
        const toasts = document.querySelectorAll("#toast-container .toast");

        toasts.forEach((toast, index) => {

            toast.style.zIndex = 1000 + index;

            toast.style.transform = `
            scale(${1 - index * (isHovered ? 0.01 : 0.03)})
        `;

            toast.style.opacity = isHovered
                ? "1"
                : (index === toasts.length - 1 ? "1" : "0.85");
        });
    }

    function notify(entity, action, meta = {}) {

        const messages = {

            transaction: {
                create: {
                    expense: "Expense added successfully",
                    income: "Income added successfully",
                    transfer: "Transfer completed successfully"
                },
                delete: "Transaction deleted",
                update: "Transaction updated"
            },

            budget: {
                create: "Budget created successfully",
                delete: "Budget deleted",
                update: "Budget updated"
            },

            goal: {
                create: "Goal created successfully",
                addMoney: "Money added to goal",
                delete: "Goal deleted"
            },

            account: {
                create: "Account created successfully",
                delete: "Account deleted",
                transferBlocked: "Cannot transfer within same account"
            }
        };

        let message = "Action completed";

        if (typeof messages[entity]?.[action] === "string") {
            message = messages[entity][action];
        } else if (messages[entity]?.[action]) {
            message = messages[entity][action][meta.type] || message;
        }

        showToast(message, meta.type === "error" ? "error" : "success");
    }

    window.notify = notify;

})();