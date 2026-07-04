function openGoalPopUp() {
  document.getElementById("goalModal").classList.add("show-pop-up");
}

function closeGoalPopUp() {
  document.getElementById("goalModal").classList.remove("show-pop-up");
}

let AddNewGoalBtn = document
  .querySelector(".goals-page-new-goal-btn")
  .addEventListener("click", () => {
    let GoalPopUp = document.querySelector(".goal-modal-overlay");
    if (GoalPopUp) {
      GoalPopUp.classList.add("show-pop-up");
    }
  });

let ProgressFill = document.querySelector(".goal-progress-fill");

function updateProgressBar() {
  ProgressFill.style.width = "50%";
}
