const addBtn = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#wrapper input");
const taskContainer = document.querySelector("#tasks");
const error = document.getElementById("error");
const countValue = document.querySelector(".count-value");

// Function to update local storage with tasks array
const updateLocalStorage = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Function to retrieve tasks from local storage
const getTasksFromLocalStorage = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        renderTask(task.name, task.completed);
    });
};


// Function to render a task in the UI
const renderTask = (taskName, completed) => {
    const task = `<div class="task ${completed ? 'completed' : ''}">
        <input type="checkbox" class="task-check" ${completed ? 'checked' : ''}>
        <span class="taskname">${taskName}</span>
        <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="delete"><i class="fa-solid fa-trash"></i></button>
    </div>`;
    taskContainer.insertAdjacentHTML("beforeend", task);
};

// Function to add a new task
const addNewTask = (taskName) => {
    const lowerCaseTaskName = taskName.trim().toLowerCase(); // Convert to lowercase and trim

    // Check if the task already exists (case insensitive)
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (tasks.some(task => task.name.toLowerCase() === lowerCaseTaskName)) {
        error.innerText = "Task already exists!";
        error.style.display = "block";
        return;
    }

    // Hide error if no issue
    error.style.display = "none";

    // Add to local storage
    tasks.push({ name: lowerCaseTaskName, completed: false });
    updateLocalStorage(tasks);

    // Update UI
    renderTask(lowerCaseTaskName, false);
};

// Add event listener for adding a new task
addBtn.addEventListener("click", () => {
    const taskName = newTaskInput.value.trim();
    if (taskName === "") {
        error.innerText = "Input can't be empty!";
        error.style.display = "block";
        newTaskInput.value = "";
        return;
    }
    addNewTask(taskName);
    newTaskInput.value = "";
});

// Add event listener for edit, delete, and checkbox functionalities within the task container
taskContainer.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("delete")) {
        const taskElement = target.closest(".task");
        const taskName = taskElement.querySelector(".taskname").innerText.toLowerCase();

        // Remove from UI
        taskElement.remove();

        // Remove from local storage
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task.name.toLowerCase() !== taskName);
        updateLocalStorage(tasks);


    } else if (target.classList.contains("edit")) {
        const taskElement = target.closest(".task");
        const taskName = taskElement.querySelector(".taskname").innerText.toLowerCase();

        // Update input with task for editing
        newTaskInput.value = taskName;

        // Remove from UI
        taskElement.remove();

        // Remove from local storage
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task.name.toLowerCase() !== taskName);
        updateLocalStorage(tasks);


    } else if (target.classList.contains("task-check")) {
        const taskElement = target.closest(".task");
        const taskName = taskElement.querySelector(".taskname").innerText.toLowerCase();
        const isChecked = target.checked;

        // Update local storage with completed status
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const index = tasks.findIndex(task => task.name.toLowerCase() === taskName);
        if (index !== -1) {
            tasks[index].completed = isChecked;
            updateLocalStorage(tasks);
        }

        // Toggle completed class in UI
        taskElement.classList.toggle("completed", isChecked);
    }
});

// When the window loads, retrieve tasks from local storage
window.onload = () => {
    getTasksFromLocalStorage();
};
