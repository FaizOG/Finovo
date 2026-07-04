(() => {
  const container = document.createElement("div");
  container.id = "toast-container";
  document.body.appendChild(container);

  const MAX_VISIBLE = 4;
  const BASE_DURATION = 2000;

  const PRIORITY = {
    error: 3,
    warning: 2,
    success: 1,
    info: 0,
  };

  const state = {
    active: [],
    queue: [],
    hovered: false,
    audioCtx: null,
  };

  /* ================= SOUND (YOUR VERSION - FIXED + INTEGRATED) ================= */

  function playSound(type) {
    try {
      if (!state.audioCtx) {
        state.audioCtx = new (
          window.AudioContext || window.webkitAudioContext
        )();
      }

      const ctx = state.audioCtx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";

      const freq =
        type === "error"
          ? 120
          : type === "warning"
            ? 220
            : type === "success"
              ? 180
              : 160;

      osc.frequency.value = freq;

      gain.gain.value = 0.0001;

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();

      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }

  /* ================= CREATE ================= */

  function create(message, type) {
    const existing = state.active.find(
      (t) => t.message === message && t.type === type,
    );

    if (existing) {
      merge(existing);
      return;
    }

    const el = document.createElement("div");
    el.className = `toast ${type}`;

    el.innerHTML = `
      <div class="toast-icon">${icon(type)}</div>
      <div class="toast-text">${message}</div>
      <div class="toast-progress"></div>
      <button class="toast-close">×</button>
    `;

    const toast = {
      el,
      message,
      type,
      count: 1,
      progress: 1,
      start: Date.now(),
      pausedAt: null,
    };

    el._toast = toast;

    bind(toast);
    enqueue(toast);
    playSound(type);

    return toast;
  }

  function icon(type) {
    return { success: "✔", error: "✖", warning: "⚠", info: "ℹ" }[type];
  }

  /* ================= MERGE ================= */

  function merge(existing) {
    existing.count++;

    let badge = existing.el.querySelector(".badge");

    if (!badge) {
      badge = document.createElement("span");
      badge.className = "badge";
      badge.style.marginLeft = "8px";
      badge.style.fontSize = "11px";
      badge.style.opacity = "0.8";
      existing.el.appendChild(badge);
    }

    badge.textContent = `×${existing.count}`;

    pulse(existing.el);
  }

  function pulse(el) {
    el.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.05)" },
        { transform: "scale(1)" },
      ],
      { duration: 220, easing: "ease-out" },
    );
  }

  /* ================= QUEUE ================= */

  function enqueue(toast) {
    state.queue.push(toast);

    state.queue.sort((a, b) => PRIORITY[b.type] - PRIORITY[a.type]);

    processQueue();
  }

  function processQueue() {
    while (state.active.length < MAX_VISIBLE && state.queue.length) {
      const toast = state.queue.shift();

      state.active.unshift(toast);
      container.prepend(toast.el);

      animateIn(toast);
      startTimer(toast);
    }

    layout();
  }

  /* ================= STACK (iOS STYLE) ================= */

  function layout() {
    state.active.forEach((t, i) => {
      const el = t.el;

      const scale = 1 - i * 0.05;
      const y = i * 10;

      el.style.transform = `translateY(${y}px) scale(${scale})`;
      el.style.zIndex = 1000 - i;
      el.style.opacity = i === 0 ? 1 : 0.92;
    });
  }

  /* ================= ENTRY ================= */

  function animateIn(t) {
    const el = t.el;

    el.style.opacity = 0;
    el.style.transform = "translateY(-18px) scale(0.92)";

    requestAnimationFrame(() => {
      el.style.transition =
        "transform 0.4s cubic-bezier(.2,.9,.2,1), opacity 0.3s ease";

      el.style.opacity = 1;
      el.style.transform = "translateY(0px) scale(1)";
    });
  }

  /* ================= TIMER ================= */

  function startTimer(t) {
    const el = t.el;
    const bar = el.querySelector(".toast-progress");

    function tick() {
      if (state.hovered) {
        requestAnimationFrame(tick);
        return;
      }

      const elapsed = Date.now() - t.start;
      const p = 1 - elapsed / BASE_DURATION;

      bar.style.transform = `scaleX(${p})`;

      if (p <= 0) {
        remove(t);
      } else {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  /* ================= REMOVE ================= */

  function remove(t) {
    state.active = state.active.filter((x) => x !== t);

    const el = t.el;

    el.style.transition = "all 0.3s ease";
    el.style.opacity = "0";
    el.style.transform = "translateX(120px) scale(0.75)";

    setTimeout(() => {
      el.remove();
      processQueue();
    }, 280);
  }

  /* ================= SHAKE ================= */

  function shake(el) {
    let v = 7;

    function frame() {
      v *= 0.82;
      const x = Math.sin(Date.now() * 0.02) * v;

      // IMPORTANT FIX: don't overwrite transform stack
      el.style.transform += ` translateX(${x}px)`;

      if (v > 0.3) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  /* ================= BIND ================= */

  function bind(t) {
    const el = t.el;

    const close = el.querySelector(".toast-close");
    close.onclick = () => remove(t);

    if (t.type === "error") shake(el);

    let startX = 0;

    el.addEventListener("pointerdown", (e) => {
      startX = e.clientX;
    });

    el.addEventListener("pointerup", (e) => {
      if (e.clientX - startX > 80) {
        remove(t);
      }
    });

    /* hover freeze */
    el.addEventListener("mouseenter", () => {
      state.hovered = true;
    });

    el.addEventListener("mouseleave", () => {
      state.hovered = false;
    });
  }

  /* ================= API ================= */

  window.notify = {
    success: (m) => create(m, "success"),
    error: (m) => create(m, "error"),
    warning: (m) => create(m, "warning"),
    info: (m) => create(m, "info"),
  };
})();
