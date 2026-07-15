import { getData, updateData, changedSymbol } from "../js/core/store.js";
import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";

const currency = () => changedSymbol();

const goalIcons = {
  default: `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target size-5" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
  `,
};

let goalsContainer = null;

function safeGetGoals() {
  return Array.isArray(getData()?.goals) ? getData().goals : [];
}

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

function isPastDate(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);

  return d < today;
}

function resetForm() {
  const form = document.querySelector(".goal-form-grid");
  if (!form) return;

  form.reset();

  requestAnimationFrame(() => {
    setDefaultGoalDate();
  });
}

function openPopup() {
  document.querySelector(".goal-modal-overlay")?.classList.add("show-pop-up");

  requestAnimationFrame(() => {
    setDefaultGoalDate();
  });
}

function closePopup() {
  document
    .querySelector(".goal-modal-overlay")
    ?.classList.remove("show-pop-up");
  resetForm();
}

function getDefaultDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function setDefaultGoalDate() {
  const input = document.getElementById("goalDeadline");
  if (!input) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const defaultDate = new Date(today);
  defaultDate.setMonth(defaultDate.getMonth() + 6);

  input.min = today.toISOString().split("T")[0];
  input.valueAsDate = defaultDate;
}

function createEmptyState() {
  const empty = document.createElement("section");
  empty.className = "goals-empty-state";

  empty.innerHTML = `
    <div class="goals-empty-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target size-4" aria-hidden="true" style="transform-origin: 50% 50%;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
    </div>

    <h2>No goals yet</h2>

    <p>
      Every big achievement starts with a single goal.
      Create your first savings goal and begin building your future.
    </p>

    <button class="goals-page-new-goal-btn goals-empty-btn">
      + Create your first goal
    </button>
  `;

  empty
    .querySelector(".goals-page-new-goal-btn")
    .addEventListener("click", openPopup);

  return empty;
}

const quotes = [
  "Small steps every day lead to big results.",
  "Discipline beats motivation every time.",
  "Your future self will thank you.",
  "Consistency creates freedom.",
  "Dreams work only when you do.",
  "Progress, not perfection.",
  "You built this one decision at a time.",
  "Success is a habit, not an event.",
];

const usedQuotes = new Set();

function getRandomQuote(id) {
  const available = quotes.filter((q) => !usedQuotes.has(q));

  if (available.length === 0) {
    usedQuotes.clear();
  }

  const pool = quotes.filter((q) => !usedQuotes.has(q));

  if (pool.length === 0) return quotes[0];

  const index = id % pool.length;

  const quote = pool[index];
  usedQuotes.add(quote);

  return quote;
}

function getExpectedSavingPercent() {
  const roll = Math.random() * 100;

  if (roll < 70) return Math.floor(Math.random() * 14);

  if (roll < 90) return 14 + Math.floor(Math.random() * 4);

  return 18 + Math.floor(Math.random() * 3);
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDuration(start, end) {
  if (!start || !end || isNaN(start) || isNaN(end) || end < start)
    return "0 months 0 days";

  const diff = end - start;

  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const months = Math.floor(days / 30);
  const remDays = days % 30;

  return `${months} months ${remDays} days`;
}

const GOAL_DELETE_DELAY = 10 * 60 * 1000;

function createGoalCard(goal) {
  const card = document.createElement("div");
  card.className = "goal-card";

  const isCompleted = !!goal.completedAt;
  const isExpired = !isCompleted && isPastDate(goal.deadline);

  const deadlineStatus = getDeadlineStatus(goal.deadline);

  if (isCompleted) {
    card.classList.add("goal-card--completed");
  }

  if (isExpired) {
    card.classList.add("goal-card--expired");
  }

  const saved = Number(goal.savedAmount || 0);
  const target = Number(goal.targetAmount || 0);

  const progress = target ? Math.min((saved / target) * 100, 100) : 0;

  // const isCompleted = !!goal.completedAt;
  // const isExpired = !isCompleted && isPastDate(goal.deadline);

  const createdAt = goal.createdAt || Date.now();
  const completedAt = goal.completedAt ?? Date.now();

  const startedOn = formatDate(createdAt);
  const completedIn = getDuration(createdAt, completedAt);

  const expected = goal.expectedSaving != null ? goal.expectedSaving : 0;
  const quote = getRandomQuote(goal.id);

  card.dataset.id = goal.id;

  card.innerHTML = `
    <div class="goal-header">
      <div class="goal-info">
        <div class="goal-icon">${goalIcons[goal.type] || "🎯"}</div>
        <div class="goal-title">
          <h3>${goal.name}</h3>
            <p>
              ${
                deadlineStatus.expired
                  ? `<span class="goal-expired-badge">${deadlineStatus.text}</span>`
                  : deadlineStatus.text
              }
            </p>
        </div>
      </div>

      <!-- KEEP ONLY THIS DELETE BUTTON -->
      <button class="goal-delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 size-4" aria-hidden="true">
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                    <path d="M3 6h18"></path>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
      </button>
    </div>

    <!-- RESTORED ORIGINAL AMOUNT STYLE -->
    <div class="goal-amount">
      <span class="saved-amount">${currency()} ${saved.toFixed(2)}</span>
      <span class="divider">/</span>
      <span class="goal-amount-total">${currency()} ${target.toFixed(2)}</span>
    </div>

     <div class="goal-progress">
    <div class="goal-progress-fill" style="width:${progress}%"></div>
  </div>

    ${
      isCompleted
        ? `
      <div class="goal-achieved">
        <div class="goal-achieved-icon">🎉</div>

        <h3 class="achieved-title">
          Goal Achieved
        </h3>

        <p class="achieved-sub">
          Will be removed from active goals in
        </p>

        <div class="goal-timer">
          <span class="countdown">--</span>
        </div>
        <div class="goal-reflection">

          <!-- FULL WIDTH -->
          <div class="reflection-full">
            📅 Started on: <strong>${startedOn}</strong>
          </div>

          <!-- 50 / 50 -->
          <div class="reflection-row">
            
            <div class="reflection-box">
              ⏱️ Completed in: <strong>${completedIn}</strong>
            </div>

            <div class="reflection-box ${expected >= 14 ? "highlight-rare" : "highlight"}">
              📈 You saved <strong>${expected}%</strong> faster than expected
            </div>

          </div>
        </div>

        <div class="goal-quote">
          <p>“${quote}”</p>
        </div>
      </div>
      `
        : `
        

      <div class="goal-actions">

        <button class="goal-btn-minus">−</button>

        <button class="goal-btn-add">+</button>

        <div class="goal-action-panel">

          <span class="currency">${currency()}</span>

          <input
            type="number"
            min="1"
            class="goal-action-input"
            placeholder="0"
          />

          <button class="goal-submit-btn">
            Add
          </button>

        </div>

       </div>
      `
    }
  `;

  const savedEl = card.querySelector(".saved-amount");
  if (savedEl) {
    savedEl.dataset.value = saved;
  }

  card.querySelector(".goal-delete-btn").addEventListener("click", () => {
    if (card.dataset.confirming === "true") return;

    card.dataset.confirming = "true";

    gsap.to(card, {
      scale: 0.98,
      y: -6,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        card.classList.add("goal-card--delete");

        card.innerHTML = `
        <div class="confirm-box">
          <p>Are you sure you want to delete this goal?</p>
          <button class="yes">Yes</button>
          <button class="no">Cancel</button>
        </div>
      `;

        const confirmBox = card.querySelector(".confirm-box");

        gsap.fromTo(
          confirmBox,
          { opacity: 0, scale: 0.9, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power2.out" },
        );

        card.querySelector(".no").onclick = () => {
          gsap.to(confirmBox, {
            opacity: 0,
            scale: 0.95,
            duration: 0.15,
            onComplete: () => {
              card.dataset.confirming = "false";
              card.classList.remove("goal-card--delete");

              renderGoals();
            },
          });
        };

        card.querySelector(".yes").onclick = () => {
          gsap.to(card, {
            scale: 0.9,
            opacity: 0,
            y: -10,
            filter: "blur(6px)",
            duration: 0.3,
            ease: "power2.in",

            onComplete: () => {
              const updated = safeGetGoals().filter((g) => g.id !== goal.id);
              updateData({ goals: updated });

              renderGoals();
            },
          });
        };
      },
    });
  });

  if (!isCompleted) {
    const actions = card.querySelector(".goal-actions");

    const plusBtn = actions.querySelector(".goal-btn-add");
    const minusBtn = actions.querySelector(".goal-btn-minus");

    const panel = actions.querySelector(".goal-action-panel");
    const input = panel.querySelector(".goal-action-input");
    const submit = panel.querySelector(".goal-submit-btn");

    let mode = null;

    gsap.set(panel, {
      display: "none",
      opacity: 0,
      x: 0,
      width: 0,
    });

    function openPanel(type) {
      mode = type;

      const isAdd = type === "add";

      panel.style.display = "flex";

      submit.textContent = isAdd ? "Add" : "Remove";

      const clickedBtn = isAdd ? plusBtn : minusBtn;
      const otherBtn = isAdd ? minusBtn : plusBtn;

      const color = getComputedStyle(clickedBtn).backgroundColor;
      panel.style.backgroundColor = color;

      gsap.to([plusBtn, minusBtn], {
        opacity: 0,
        scale: 0.8,
        pointerEvents: "none",
        duration: 0.15,
      });

      const fromX = type === "remove" ? -40 : 40;

      gsap.fromTo(
        panel,
        {
          opacity: 0,
          x: fromX,
          width: 0,
        },
        {
          opacity: 1,
          x: 0,
          width: "100%",
          duration: 0.25,
          ease: "power2.out",
          onComplete() {
            input.focus();
          },
        },
      );
    }

    function closePanel() {
      input.value = "";

      gsap.to(panel, {
        opacity: 0,
        x: 0,
        width: 0,
        duration: 0.2,
        onComplete() {
          panel.style.display = "none";

          gsap.to([plusBtn, minusBtn], {
            opacity: 1,
            scale: 1,
            pointerEvents: "auto",
            duration: 0.2,
          });

          mode = null;
        },
      });
    }

    plusBtn.addEventListener("click", () => openPanel("add"));
    minusBtn.addEventListener("click", () => openPanel("remove"));

    submit.addEventListener("click", () => {
      const amount = Number(input.value);

      if (!amount || amount <= 0) return;

      updateAmount(goal.id, mode === "add" ? amount : -amount);
      closePanel();
    });

    const closeBtn = document.createElement("button");
    closeBtn.className = "goal-panel-close";
    closeBtn.innerHTML = "✕";
    panel.appendChild(closeBtn);

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closePanel();
    });
  }

  return card;
}

export function animateNumberWithFeedback(
  el,
  from,
  to,
  currency = "$",
  type = "neutral",
) {
  const obj = { value: from };

  const colors = {
    up: "#22c55e",
    down: "#ef4444",
    neutral: "",
  };

  el.style.color = colors[type];

  gsap.to(obj, {
    value: to,
    duration: 0.7,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = `${currency}${obj.value.toFixed(2)}`;
    },
    onComplete: () => {
      el.style.color = "";
    },
  });
}

function updateAmount(id, change) {
  const data = getData();
  const goals = safeGetGoals();

  let becameCompleted = false;

  const updated = goals.map((g) => {
    if (g.id !== id) return g;

    const newSaved = Math.min(
      g.targetAmount,
      Math.max(0, (g.savedAmount || 0) + change),
    );

    const wasCompleted = !!g.completedAt;
    const isNowCompleted = newSaved >= g.targetAmount;

    if (!wasCompleted && isNowCompleted) {
      becameCompleted = true;
    }

    return {
      ...g,
      savedAmount: newSaved,
      completedAt: isNowCompleted ? Date.now() : g.completedAt,
    };
  });

  const goal = updated.find((g) => g.id === id);
  const isAdd = change > 0;

  // Log the transaction
  const goalTransactions = Array.isArray(data.goalTransactions)
    ? [...data.goalTransactions]
    : [];

  goalTransactions.unshift({
    id: Date.now(),
    goalId: goal.id,
    goalName: goal.name,
    type: isAdd ? "deposit" : "withdraw",
    amount: Math.abs(change),
    savedAmount: goal.savedAmount,
    targetAmount: goal.targetAmount,
    createdAt: Date.now(),
  });

  updateData({
    goals: updated,
    goalTransactions,
  });

  console.log(getData().goalTransactions);

  if (becameCompleted) {
    renderGoals();
    return;
  }

  updateSingleCard(id, goal, isAdd);
}

function updateSingleCard(id, goal, isAdd) {
  const card = document.querySelector(`.goal-card[data-id="${id}"]`);
  if (!card) return;

  const saved = Number(goal.savedAmount || 0);
  const target = Number(goal.targetAmount || 0);
  const progress = target ? (saved / target) * 100 : 0;

  const fill = card.querySelector(".goal-progress-fill");

  const color = isAdd ? "#22c55e" : "#ef4444";

  const PRIMARY_COLOR = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary-color")
    .trim();

  const flashColor = isAdd ? "#22c55e" : "#ef4444";

  gsap
    .timeline()
    .to(fill, {
      width: `${progress}%`,
      backgroundColor: flashColor,
      duration: 0.5,
      ease: "power3.out",
    })
    .to(fill, {
      backgroundColor: PRIMARY_COLOR,
      duration: 0.4,
      ease: "power2.inOut",
    });

  const savedEl = card.querySelector(".saved-amount");

  const prevValue = Number(savedEl.dataset.value || 0);
  const newValue = saved;

  const type = isAdd ? "up" : "down";

  animateNumberWithFeedback(savedEl, prevValue, newValue, currency(), type);

  savedEl.dataset.value = newValue;
}

function startAutoDeleteWatcher() {
  setInterval(() => {
    const now = Date.now();

    const goals = safeGetGoals();

    const filtered = goals.filter((g) => {
      if (!g.completedAt) return true;
      return now < g.completedAt + GOAL_DELETE_DELAY;
    });

    if (filtered.length === goals.length) return;

    updateData({ goals: filtered });
    renderGoals();
  }, 1000);
}

function startTimerUIUpdater() {
  setInterval(() => {
    const now = Date.now();

    const goals = safeGetGoals();

    let changed = false;

    const updatedGoals = goals.filter((g) => {
      if (!g.completedAt) return true;

      const remaining = g.completedAt + GOAL_DELETE_DELAY - now;

      if (remaining <= 0) {
        changed = true;
        return false;
      }

      return true;
    });

    if (changed) {
      updateData({ goals: updatedGoals });
      renderGoals();
      return;
    }

    document.querySelectorAll(".goal-card").forEach((card, i) => {
      const g = goals[i];
      if (!g?.completedAt) return;

      const left = g.completedAt + GOAL_DELETE_DELAY - now;
      const el = card.querySelector(".countdown");
      if (!el) return;

      const sec = Math.max(0, Math.floor(left / 1000));
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;

      el.textContent = `${h}h ${m}m ${s}s`;

      if (sec <= 60) el.style.color = "red";
    });
  }, 1000);
}

function renderGoals() {
  if (!goalsContainer) return;

  const oldCards = goalsContainer.querySelectorAll(".goal-card");

  if (oldCards.length) {
    gsap.to(oldCards, {
      opacity: 0,
      y: -10,
      duration: 0.15,
      stagger: 0.02,
      onComplete: () => {
        buildGoals();
      },
    });
  } else {
    buildGoals();
  }
}

function updateCounter() {
  const goals = safeGetGoals();
  const active = goals.filter((g) => !g.completedAt).length;

  const el = document.querySelector(".ActiveGoals");
  if (el) el.textContent = active;
}

function buildGoals() {
  const goals = safeGetGoals();

  const page = goalsContainer.parentElement;

  page.querySelector(".goals-empty-state")?.remove();

  goalsContainer.innerHTML = "";

  if (!goals.length) {
    goalsContainer.style.display = "none";

    page.appendChild(createEmptyState());

    updateCounter();

    return;
  }

  goalsContainer.style.display = "grid";

  goals.forEach((g) => goalsContainer.appendChild(createGoalCard(g)));

  updateCounter();

  gsap.from(".goal-card", {
    opacity: 0,
    y: 20,
    scale: 0.98,
    duration: 0.35,
    stagger: 0.06,
    ease: "power2.out",
  });
}

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

    if (isPastDate(deadline)) {
      return notify.error("Past date not allowed");
    }

    const now = Date.now();
    const goals = safeGetGoals();

    goals.push({
      id: Date.now(),
      name,
      targetAmount: target,
      savedAmount: saved,
      deadline,
      type: "default",
      createdAt: now,
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
    return now - g.completedAt < GOAL_DELETE_DELAY;
  });

  updateData({ goals: filtered });
}

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

function createContainer() {
  const section = document.createElement("section");
  section.className = "goals-page-card-section";
  return section;
}

function getDeadlineStatus(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(dateStr);
  deadline.setHours(0, 0, 0, 0);

  const diff = deadline - today;

  const days = Math.ceil(Math.abs(diff) / (1000 * 60 * 60 * 24));

  if (diff < 0) {
    return {
      expired: true,
      text: `Expired ${days} day${days === 1 ? "" : "s"} ago`,
    };
  }

  return {
    expired: false,
    text: `${days} day${days === 1 ? "" : "s"} left`,
  };
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
    startTimerUIUpdater();
    cleanupExpiredGoals();
  },
};
