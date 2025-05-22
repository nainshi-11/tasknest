document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const emptyImage = document.querySelector(".empty-image");
  const progressBar = document.getElementById("progress");
  const progressNumbers = document.getElementById("progress-numbers");

  const confettiCelebrate = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      }));
    }, 250);
  };

  const toggleEmptyState = () => {
    emptyImage.style.display = taskList.children.length === 0 ? "block" : "none";
  };

  const updateProgress = () => {
    const tasks = taskList.querySelectorAll("li");
    const completed = taskList.querySelectorAll("li.completed");

    const percent = tasks.length === 0 ? 0 : Math.round((completed.length / tasks.length) * 100);
    progressBar.style.width = percent + "%";
    progressNumbers.textContent = `${completed.length} / ${tasks.length}`;

    if (completed.length && tasks.length > 0 && completed.length === tasks.length) {
      confettiCelebrate();
    }
  };

  const createTask = (text, isCompleted = false) => {
    const li = document.createElement("li");
    if (isCompleted) li.classList.add("completed");

    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${isCompleted ? "checked" : ""} />
      <span>${text}</span>
      <div class="task-buttons">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    const checkbox = li.querySelector(".checkbox");
    const editBtn = li.querySelector(".edit-btn");
    const deleteBtn = li.querySelector(".delete-btn");

    checkbox.addEventListener("change", () => {
      li.classList.toggle("completed");
      updateProgress();
    });

    editBtn.addEventListener("click", () => {
      if (!checkbox.checked) {
        taskInput.value = li.querySelector("span").textContent;
        li.remove();
        toggleEmptyState();
        updateProgress();
      }
    });

    deleteBtn.addEventListener("click", () => {
      li.remove();
      toggleEmptyState();
      updateProgress();
    });

    taskList.appendChild(li);
    updateProgress();
    toggleEmptyState();
  };

  document.getElementById("task-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText) {
      createTask(taskText);
      taskInput.value = "";
    }
  });

  toggleEmptyState();
  updateProgress();
});
