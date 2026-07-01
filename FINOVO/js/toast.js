let container;

const icons = {
  success: "✓",
  error: "✕",
  warning: "!",
  info: "i",
};

function ensureContainer() {
  if (container) return;

  container = document.createElement("div");
  container.id = "toast-container";
  document.body.appendChild(container);
}

/* ===========================
   CREATE TOAST
=========================== */

function createToast({ title, message, type = "info", duration = 4000 }) {
  ensureContainer();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = document.createElement("div");
  icon.className = "toast-icon";
  icon.textContent = icons[type] || "i";

  const text = document.createElement("div");
  text.className = "toast-text";

  const t = document.createElement("div");
  t.className = "toast-title";
  t.textContent = title;

  const m = document.createElement("div");
  m.className = "toast-message";
  m.textContent = message;

  text.appendChild(t);
  text.appendChild(m);

  const close = document.createElement("button");
  close.className = "toast-close";
  close.innerHTML = "×";

  const progress = document.createElement("div");
  progress.className = "toast-progress";

  toast.appendChild(icon);
  toast.appendChild(text);
  toast.appendChild(close);
  toast.appendChild(progress);

  container.appendChild(toast);

  close.onclick = () => removeToast(toast);

  animateIn(toast);
  startTimer(toast, progress, duration);

  return toast;
}

/* ===========================
   ANIMATION (GSAP optional)
=========================== */

function animateIn(el) {
  if (!window.gsap) {
    el.style.opacity = 1;
    return;
  }

  gsap.fromTo(
    el,
    { x: 100, opacity: 0, scale: 0.95 },
    { x: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" }
  );
}

/* ===========================
   REMOVE
=========================== */

function removeToast(toast) {
  if (!toast) return;

  if (window.gsap) {
    gsap.to(toast, {
      x: 80,
      opacity: 0,
      duration: 0.2,
      onComplete: () => toast.remove(),
    });
  } else {
    toast.remove();
  }
}

/* ===========================
   TIMER
=========================== */

function startTimer(toast, bar, duration) {
  let start = Date.now();

  function tick() {
    const elapsed = Date.now() - start;
    const progress = 1 - elapsed / duration;

    if (bar) bar.style.transform = `scaleX(${progress})`;

    if (elapsed >= duration) {
      removeToast(toast);
      return;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* ===========================
   PUBLIC API
=========================== */

function notify(entity, action, meta = {}) {
  const messages = {
    app: {
      reset: "All data has been reset successfully.",
    },
    account: {
      delete: "Account deleted successfully",
      create: "Account created successfully",
    },
  };

  let msg = "Done";

  if (messages?.[entity]?.[action]) {
    msg = messages[entity][action];
  }

  return createToast({
    title: entity.toUpperCase(),
    message: msg,
    type: meta.type || "success",
    duration: meta.duration,
  });
}

function notifyPromise(promise, messages = {}) {
  const t = createToast({
    title: "Loading",
    message: messages.loading || "Please wait...",
    type: "info",
    duration: 999999,
  });

  promise
    .then((res) => {
      t.remove();
      createToast({
        title: "Success",
        message: messages.success || "Done",
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      t.remove();
      createToast({
        title: "Error",
        message: messages.error || "Failed",
        type: "error",
      });
    });
}

/* ===========================
   GLOBAL EXPORT (IMPORTANT FIX)
=========================== */

window.notify = notify;
window.notifyPromise = notifyPromise;