/* =========================================================
   ADVANCED FINOVO TOAST ENGINE (v2)
   FEATURES:
   - grouping (+3 more)
   - swipe dismiss (mobile + desktop)
   - sound system
   - morph updates
   - stacking depth blur
========================================================= */

const MAX_VISIBLE = 4;

let container;
let toasts = [];
let groupBuffer = [];

const sounds = {
  success: new Audio("/assets/sounds/success.mp3"),
  error: new Audio("/assets/sounds/error.mp3"),
  info: new Audio("/assets/sounds/click.mp3"),
};

/* ===========================
   INIT CONTAINER
=========================== */

function ensureContainer() {
  if (container) return;

  container = document.createElement("div");
  container.id = "toast-container";
  document.body.appendChild(container);
}

/* ===========================
   SOUND
=========================== */

function playSound(type) {
  try {
    const sound = sounds[type];
    if (sound) {
      sound.currentTime = 0;
      sound.volume = 0.4;
      sound.play();
    }
  } catch (e) {}
}

/* ===========================
   CREATE TOAST
=========================== */

function createToast({ title, message, type = "info", duration = 4000 }) {
  ensureContainer();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  toast.innerHTML = `
    <div class="toast-icon">${getIcon(type)}</div>
    <div class="toast-text">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close">×</button>
    <div class="toast-progress"></div>
  `;

  toast.dataset.id = Date.now() + Math.random();

  container.appendChild(toast);

  registerToast(toast, type, duration);

  return toast;
}

/* ===========================
   ICONS
=========================== */

function getIcon(type) {
  return {
    success: "✓",
    error: "✕",
    warning: "!",
    info: "i",
  }[type];
}

/* ===========================
   REGISTER TOAST
=========================== */

function registerToast(toast, type, duration) {
  toasts.unshift(toast);

  playSound(type);

  attachEvents(toast);
  animateIn(toast);
  updateStack();

  startTimer(toast, duration);

  if (toasts.length > MAX_VISIBLE) {
    const removed = toasts.splice(MAX_VISIBLE);
    groupBuffer.push(...removed);

    showGroupIndicator();
  }
}

/* ===========================
   GROUP INDICATOR (+3 more)
=========================== */

function showGroupIndicator() {
  const existing = document.querySelector(".toast-group");

  if (groupBuffer.length <= 0) return;

  if (!existing) {
    const g = document.createElement("div");
    g.className = "toast toast-group";
    g.innerHTML = `
      <div class="toast-icon">+</div>
      <div class="toast-text">
        <div class="toast-title">More notifications</div>
        <div class="toast-message">${groupBuffer.length} hidden</div>
      </div>
    `;

    container.appendChild(g);
  } else {
    existing.querySelector(".toast-message").textContent =
      `${groupBuffer.length} hidden`;
  }
}

/* ===========================
   SWIPE SUPPORT (MOUSE + TOUCH)
=========================== */

function attachEvents(toast) {
  const close = toast.querySelector(".toast-close");

  close.onclick = () => removeToast(toast);

  let startX = 0;
  let currentX = 0;
  let dragging = false;

  toast.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    dragging = true;
  });

  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    currentX = e.clientX - startX;

    toast.style.transform = `translateX(${currentX}px)`;
    toast.style.opacity = 1 - Math.abs(currentX) / 200;
  });

  window.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;

    if (Math.abs(currentX) > 120) {
      removeToast(toast);
    } else {
      gsap.to(toast, { x: 0, opacity: 1, duration: 0.2 });
    }

    currentX = 0;
  });
}

/* ===========================
   ANIMATION IN
=========================== */

function animateIn(el) {
  if (!window.gsap) return;

  gsap.fromTo(
    el,
    { x: 100, opacity: 0, scale: 0.95 },
    { x: 0, opacity: 1, scale: 1, duration: 0.35 }
  );
}

/* ===========================
   STACK DEPTH EFFECT
=========================== */

function updateStack() {
  toasts.forEach((t, i) => {
    const scale = 1 - i * 0.04;
    const y = i * 10;
    const blur = i * 1.5;

    gsap.to(t, {
      y,
      scale,
      duration: 0.35,
    });

    t.style.zIndex = 1000 - i;
    t.style.filter = `blur(${blur}px)`;
    t.style.opacity = i > 3 ? 0 : 1;
  });
}

/* ===========================
   REMOVE
=========================== */

function removeToast(toast) {
  if (!toast) return;

  toasts = toasts.filter((t) => t !== toast);

  gsap.to(toast, {
    x: 120,
    opacity: 0,
    scale: 0.9,
    duration: 0.2,
    onComplete: () => {
      toast.remove();
      updateStack();
    },
  });
}

/* ===========================
   TIMER
=========================== */

function startTimer(toast, duration) {
  const bar = toast.querySelector(".toast-progress");
  let start = Date.now();

  function tick() {
    const p = 1 - (Date.now() - start) / duration;

    if (bar) bar.style.transform = `scaleX(${p})`;

    if (p <= 0) {
      removeToast(toast);
      return;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* ===========================
   MORPH UPDATE (OPTIONAL USE)
=========================== */

function updateToast(toast, newData) {
  if (!toast) return;

  toast.querySelector(".toast-title").textContent = newData.title;
  toast.querySelector(".toast-message").textContent = newData.message;

  playSound(newData.type || "info");
}

/* ===========================
   PUBLIC API
=========================== */

function notify(entity, action, meta = {}) {
  const db = {
    app: { reset: "All data reset successfully" },
    account: {
      create: "Account created",
      delete: "Account deleted",
    },
  };

  const message = db?.[entity]?.[action] || "Done";

  return createToast({
    title: entity.toUpperCase(),
    message,
    type: meta.type || "success",
  });
}

/* PROMISE */

function notifyPromise(promise, messages = {}) {
  const t = createToast({
    title: "Loading",
    message: messages.loading || "Please wait",
    type: "info",
  });

  promise
    .then((r) => {
      removeToast(t);
      createToast({
        title: "Success",
        message: messages.success || "Done",
        type: "success",
      });
      return r;
    })
    .catch(() => {
      removeToast(t);
      createToast({
        title: "Error",
        message: messages.error || "Failed",
        type: "error",
      });
    });
}

/* ===========================
   GLOBAL EXPORT
=========================== */

window.notify = notify;
window.notifyPromise = notifyPromise;
window.updateToast = updateToast;