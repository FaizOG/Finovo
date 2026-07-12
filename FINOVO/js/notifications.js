// (function () {
//   const container = document.createElement("div");
//   container.id = "toast-container";
//   document.body.prepend(container);

//   const MAX_TOASTS = 5;
//   const DURATION = 5000;

//   let isHovered = false;

//   container.addEventListener("mouseenter", () => {
//     isHovered = true;
//     updateStack();
//     pauseProgress(true);
//   });

//   container.addEventListener("mouseleave", () => {
//     isHovered = false;
//     updateStack();
//     pauseProgress(false);
//   });

//   const icons = {
//     success: "✔",
//     error: "✖",
//     warning: "⚠",
//     info: "ℹ",
//   };

//   function createToast(message, type = "success", meta = {}) {
//     const toast = document.createElement("div");
//     toast.className = `toast ${type}`;
//     toast.setAttribute("role", "alert");

//     // ICON + TEXT
//     const icon = document.createElement("span");
//     icon.className = "toast-icon";
//     icon.textContent = icons[type] || "ℹ";

//     const text = document.createElement("span");
//     text.className = "toast-text";
//     text.textContent = message;

//     const content = document.createElement("div");
//     content.className = "toast-content";
//     content.appendChild(icon);
//     content.appendChild(text);

//     toast.appendChild(content);

//     // CLOSE BUTTON
//     const closeBtn = document.createElement("button");
//     closeBtn.className = "toast-close";
//     closeBtn.textContent = "×";
//     closeBtn.onclick = () => removeToast(toast);

//     toast.appendChild(closeBtn);

//     // PROGRESS BAR
//     const progress = document.createElement("div");
//     progress.className = "toast-progress";
//     toast.appendChild(progress);

//     // ACTION CLICK
//     if (meta.onClick) {
//       toast.style.cursor = "pointer";
//       toast.onclick = meta.onClick;
//     }

//     container.appendChild(toast);

//     limitToasts();
//     updateStack();

//     startAutoRemove(toast, progress, meta.duration || DURATION);

//     return toast;
//   }

//   function removeToast(toast) {
//     if (!toast) return;
//     toast.remove();
//     updateStack();
//   }

//   function limitToasts() {
//     while (container.children.length > MAX_TOASTS) {
//       container.firstChild.remove();
//     }
//   }

//   function updateStack() {
//     const toasts = [...container.querySelectorAll(".toast")];

//     toasts.forEach((toast, index) => {
//       toast.style.zIndex = 1000 + index;

//       // improved animation (stack + depth feel)
//       const scale = 1 - index * 0.04;
//       const translateY = index * 12;

//       toast.style.transform = `translateY(${translateY}px) scale(${scale})`;

//       toast.style.opacity = isHovered
//         ? "1"
//         : index === toasts.length - 1
//           ? "1"
//           : "0.85";
//     });
//   }

//   function startAutoRemove(toast, progress, duration) {
//     let start = Date.now();
//     let remaining = duration;
//     let paused = false;

//     function tick() {
//       if (paused) return;

//       const elapsed = Date.now() - start;
//       const percent = Math.max(0, 1 - elapsed / duration);

//       progress.style.width = percent * 100 + "%";

//       if (elapsed >= duration) {
//         removeToast(toast);
//       } else {
//         requestAnimationFrame(tick);
//       }
//     }

//     toast._pause = (state) => {
//       paused = state;
//       if (!paused) {
//         start =
//           Date.now() - duration * (1 - parseFloat(progress.style.width) / 100);
//         requestAnimationFrame(tick);
//       }
//     };

//     requestAnimationFrame(tick);
//   }

//   function pauseProgress(state) {
//     const toasts = container.querySelectorAll(".toast");
//     toasts.forEach((t) => {
//       if (t._pause) t._pause(state);
//     });
//   }

//   // CORE NOTIFY
//   function notify(entity, action, meta = {}) {
//     const messages = {
//       transaction: {
//         create: {
//           expense: "Expense added successfully",
//           income: "Income added successfully",
//           transfer: "Transfer completed successfully",
//         },
//         delete: "Transaction deleted",
//         update: "Transaction updated",
//       },
//       app: {
//         reset: "All data has been reset successfully.",
//       },
//       budget: {
//         create: "Budget created successfully",
//         delete: "Budget deleted",
//         update: "Budget updated",
//       },
//       goal: {
//         create: "Goal created successfully",
//         addMoney: "Money added to goal",
//         delete: "Goal deleted",
//       },
//       account: {
//         create: "Account created successfully",
//         delete: "Account deleted",
//         transferBlocked: "Cannot transfer within same account",
//       },
//     };

//     let message = "Action completed";

//     if (typeof messages[entity]?.[action] === "string") {
//       message = messages[entity][action];
//     } else if (messages[entity]?.[action]) {
//       message = messages[entity][action][meta.type] || message;
//     }

//     return createToast(
//       message,
//       meta.type === "error"
//         ? "error"
//         : meta.type === "warning"
//           ? "warning"
//           : meta.type === "info"
//             ? "info"
//             : "success",
//       meta,
//     );
//   }

//   // PROMISE WRAPPER
//   function notifyPromise(promise, messages = {}) {
//     const toast = createToast(messages.loading || "Loading...", "info", {
//       duration: 10000,
//     });

//     promise
//       .then((res) => {
//         toast.remove();
//         createToast(messages.success || "Success", "success");
//         return res;
//       })
//       .catch((err) => {
//         toast.remove();
//         createToast(messages.error || "Something went wrong", "error");
//         throw err;
//       });
//   }

//   window.notify = notify;
//   window.notifyPromise = notifyPromise;
// })();
