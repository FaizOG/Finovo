import { getData, updateData } from "../js/core/store.js";

const goalIcons = {
  travel: "🎯",
  savings: "💰",
  default: "🎯",
};

let goalsContainer = null;

/* ---------------- SAFE ---------------- */
function safeGetGoals() {
  return Array.isArray(getData()?.goals) ? getData().goals : [];
}

/* ---------------- HEADER ---------------- */
function createHeader() {
  const section = document.createElement("section");

  section.innerHTML = `
    <div class="account-page-sub-header">
      <div>
        <h2>Savings goals</h2>
        <p><span class="ActiveGoals">0</span> active goals</p>
      </div>
      <button class="goals-page-new-goal-btn">+ New goal</button>
    </div>
  `;

  return section;
}

/* ---------------- DATE FIX (STRICT) ---------------- */
function isPastDate(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);

  return d < today;
}

/* ---------------- FORM RESET ---------------- */
function resetForm() {
  const form = document.querySelector(".goal-form-grid");
  if (!form) return;
  form.reset();
  setDefaultGoalDate();
}

/* ---------------- POPUP ---------------- */
function openPopup() {
  document.querySelector(".goal-modal-overlay")?.classList.add("show-pop-up");
}

function closePopup() {
  document
    .querySelector(".goal-modal-overlay")
    ?.classList.remove("show-pop-up");
  resetForm();
}

/* ---------------- DATE DEFAULT ---------------- */
function getDefaultDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().split("T")[0];
}

function setDefaultGoalDate() {
  const input = document.querySelector(".goal-input[type='date']");
  if (input && !input.value) input.value = getDefaultDate();
}

/* ---------------- CARD ---------------- */
function createGoalCard(goal) {
  const card = document.createElement("div");
  card.className = "goal-card";

  const saved = Number(goal.savedAmount || 0);
  const target = Number(goal.targetAmount || 0);

  const progress = target ? Math.min((saved / target) * 100, 100) : 0;

  const isCompleted = !!goal.completedAt;

  const remaining = isCompleted
    ? Math.max(0, goal.completedAt + 3600000 - Date.now())
    : 0;

  card.innerHTML = `
    <div class="goal-header">
      <div class="goal-info">
        <div class="goal-icon">${goalIcons[goal.type] || "🎯"}</div>
        <div class="goal-title">
          <h3>${goal.name}</h3>
          <p>by ${goal.deadline}</p>
        </div>
      </div>

      <!-- KEEP ONLY THIS DELETE BUTTON -->
      <button class="goal-delete-btn">🗑️</button>
    </div>

    <!-- RESTORED ORIGINAL AMOUNT STYLE -->
    <div class="goal-amount">
      <span class="saved-amount">$${saved.toFixed(2)}</span>
      <span class="divider">/</span>
      <span class="goal-amount-total">$${target.toFixed(2)}</span>
    </div>

    <div class="goal-progress">
      <div class="goal-progress-fill" style="width:${progress}%"></div>
    </div>

    ${
      isCompleted
        ? `
        <div class="goal-achieved">
          <h3 class="achieved-title">🎉 Goal Achieved</h3>

          <div class="achieved-sub">
            Auto-delete in
          </div>

          <div class="timer">
            <span class="countdown">--</span>
          </div>
        </div>
      `
        : `
        <div class="goal-actions">
          <button class="goal-btn add-50">+ $50</button>
          <button class="goal-btn add-100">+ $100</button>
          <button class="goal-minus-btn remove">−</button>
        </div>
      `
    }
  `;

  /* ---------------- DELETE (ONLY TOP RIGHT) ---------------- */
  card.querySelector(".goal-delete-btn").addEventListener("click", () => {
    card.innerHTML = `
      <div class="confirm-box">
        <p>Are you sure you want to delete this goal?</p>
        <button class="yes">Yes</button>
        <button class="no">No</button>
      </div>
    `;

    card.querySelector(".no").onclick = renderGoals;

    card.querySelector(".yes").onclick = () => {
      const updated = safeGetGoals().filter((g) => g.id !== goal.id);
      updateData({ goals: updated });
      renderGoals();
    };
  });

  /* ---------------- ACTIONS ---------------- */
  if (!isCompleted) {
    card
      .querySelector(".add-50")
      ?.addEventListener("click", () => updateAmount(goal.id, 50));
    card
      .querySelector(".add-100")
      ?.addEventListener("click", () => updateAmount(goal.id, 100));
    card
      .querySelector(".remove")
      ?.addEventListener("click", () => updateAmount(goal.id, -50));
  }

  return card;
}

/* ---------------- UPDATE ---------------- */
function updateAmount(id, change) {
  const updated = safeGetGoals().map((g) => {
    if (g.id !== id) return g;

    const newSaved = Math.min(
      g.targetAmount,
      Math.max(0, (g.savedAmount || 0) + change),
    );

    const completed = newSaved >= g.targetAmount;

    if (completed && !g.completedAt) {
      return {
        ...g,
        savedAmount: g.targetAmount,
        completedAt: Date.now(),
      };
    }

    return { ...g, savedAmount: newSaved };
  });

  updateData({ goals: updated });
  renderGoals();
}

/* ---------------- SAFE AUTO DELETE (NO DOM LOOP) ---------------- */
function startAutoDeleteWatcher() {
  setInterval(() => {
    const now = Date.now();

    const filtered = safeGetGoals().filter((g) => {
      if (!g.completedAt) return true;
      return now - g.completedAt < 3600000;
    });

    updateData({ goals: filtered });
  }, 60000); // NOT every second
}

/* ---------------- TIMER (ONLY UPDATE TEXT, NO RENDER) ---------------- */
function startTimerUIUpdater() {
  setInterval(() => {
    const goals = safeGetGoals();
    const now = Date.now();

    let changed = false;

    const updatedGoals = goals.filter((g) => {
      if (!g.completedAt) return true;

      const expiryTime = g.completedAt + 3600000;
      const remaining = expiryTime - now;

      // ✅ AUTO DELETE WHEN EXPIRED
      if (remaining <= 0) {
        changed = true;
        return false;
      }

      return true;
    });

    if (changed) {
      updateData({ goals: updatedGoals });
      renderGoals();
      return; // stop UI update this cycle
    }

    // ✅ ONLY UPDATE TIMER TEXT (NO RE-RENDER)
    document.querySelectorAll(".goal-card").forEach((card, i) => {
      const g = goals[i];
      if (!g?.completedAt) return;

      const left = g.completedAt + 3600000 - now;
      const el = card.querySelector(".countdown");
      if (!el) return;

      const sec = Math.max(0, Math.floor(left / 1000));
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;

      el.textContent = `${h}h ${m}m ${s}s`;

      // optional visual warning
      if (sec <= 60) {
        el.style.color = "red";
      }
    });
  }, 1000);
}

/* ---------------- RENDER ---------------- */
function renderGoals() {
  if (!goalsContainer) return;

  const goals = safeGetGoals();

  goalsContainer.innerHTML = "";

  if (!goals.length) {
    goalsContainer.innerHTML = `<p style="text-align:center;opacity:.6;">No goals yet</p>`;
    return;
  }

  goals.forEach((g) => goalsContainer.appendChild(createGoalCard(g)));

  const counter = document.querySelector(".ActiveGoals");
  if (counter) counter.textContent = goals.length;
}

/* ---------------- FORM ---------------- */
function initForm() {
  const form = document.querySelector(".goal-form-grid");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll("input");

    const name = inputs[0].value.trim();
    const target = Number(inputs[1].value);
    const saved = Number(inputs[2].value || 0);
    const deadline = inputs[3].value || getDefaultDate();

    if (!name) return notify.error("Name required");
    if (target <= 0) return notify.error("Invalid target");
    if (saved >= target) return notify.error("Saved must be < target");

    /* ✅ FIXED PAST DATE BUG */
    if (isPastDate(deadline)) {
      return notify.error("Past date not allowed");
    }

    const goals = safeGetGoals();

    goals.push({
      id: Date.now(),
      name,
      targetAmount: target,
      savedAmount: saved,
      deadline,
      type: "default",
      completedAt: null,
    });

    updateData({ goals });
    renderGoals();
    closePopup();
    form.reset();
    setDefaultGoalDate();
  });
}

function cleanupExpiredGoals() {
  const now = Date.now();
  const goals = safeGetGoals();

  const filtered = goals.filter((g) => {
    if (!g.completedAt) return true;
    return now - g.completedAt < 3600000;
  });

  updateData({ goals: filtered });
}

/* ---------------- EVENTS ---------------- */
function initEvents() {
  document
    .querySelector(".goals-page-new-goal-btn")
    ?.addEventListener("click", openPopup);

  document
    .querySelector(".goal-close-btn")
    ?.addEventListener("click", closePopup);

  document.querySelector(".goal-cancel")?.addEventListener("click", closePopup);

  document
    .querySelector(".goal-modal-overlay")
    ?.addEventListener("click", (e) => {
      if (e.target.classList.contains("goal-modal-overlay")) closePopup();
    });
}

/* ---------------- INIT ---------------- */
function createContainer() {
  const section = document.createElement("section");
  section.className = "goals-page-card-section";
  return section;
}

export default {
  mount(container) {
    container.innerHTML = "";

    container.appendChild(createHeader());

    goalsContainer = createContainer();
    container.appendChild(goalsContainer);

    renderGoals();
    initEvents();
    initForm();
    setDefaultGoalDate();

    startAutoDeleteWatcher();
    startTimerUIUpdater(); // ✅ important FIX (no re-render loop)
    cleanupExpiredGoals();
  },
};
