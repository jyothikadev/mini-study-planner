//current filter state
let currentFilter = "all";

//get saved tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let editingId = null; // to keep track of the task being edited, initialized to null when no task is being edited

//select elements
let addBtn = document.getElementById("addBtn");
//filter buttons
let allBtn = document.getElementById("allBtn");
let completedBtn = document.getElementById("completedBtn");
let pendingBtn = document.getElementById("pendingBtn");

//function to display tasks
function displayTasks(filter = currentFilter) {
  //select ul
  let taskList = document.getElementById("taskList"); //used to display tasks

  //clear old tasks
  taskList.innerHTML = "";

  //loop through tasks array
  tasks.forEach(function (task) {
    //filter tasks based on current filter
    if (filter === "completed" && !task.completed) {
      //if filter is completed and task is not completed, skip
      return;
    }

    if (filter === "pending" && task.completed) {
      //if filter is pending and task is completed, skipreturn;
      return;
    }

    //create li
    let li = document.createElement("li");

    //create checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    if (task.id === editingId) {
      let input = document.createElement("input");
      input.type = "text";
      input.value = task.text;

      li.appendChild(input);
    } else {
      let text = document.createElement("span");
      text.textContent = task.text;

      li.appendChild(text);
    }

    //if completed add strike-through

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    //create delete button
    let deletebtn = document.createElement("button");
    deletebtn.textContent = "Delete";
    deletebtn.classList.add("deletebtn"); //for styling

    //append elements
    li.appendChild(checkbox);

    li.appendChild(editBtn);
    li.appendChild(deletebtn);

    //append li into ul
    taskList.appendChild(li); //for displaying tasks

    //checkbox functionality

    //update localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks)); //to save the updated tasks array with the new completed status
  });

  editBtn.addEventListener("click", function () {
    editingId = task.id;

    displayTasks();
  });
  console.log(editingId);
  //delete functionality
  deletebtn.addEventListener("click", function () {
    //remove task from array
    tasks = tasks.filter(function (t) {
      return t.id !== task.id; //to keep all tasks except the one that matches the id of the task to be deleted
    });

    //update localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    //refresh UI
    displayTasks(); //for updating the displayed list of tasks after deletion
  });
}

//add task button
addBtn.addEventListener("click", function () {
  //get input
  let taskInput = document.getElementById("taskInput");

  //get value
  let taskValue = taskInput.value;

  //prevent empty tasks
  if (taskValue.trim() === "") {
    return;
  }

  //add task object into array
  tasks.push({
    id: Date.now(), //unique id for each task,date.now()gives the current timestamp in milliseconds which can be used as a unique identifier for each task
    text: taskValue,
    completed: false,
  });

  //save to localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  //clear input
  taskInput.value = "";

  //refresh UI
  displayTasks(); //to show the newly added task in the list
});

//show tasks when page loads
displayTasks();

//filter button functionality
allBtn.addEventListener("click", function () {
  allBtn.classList.add("active-filter"); //for styling the active filter button
  completedBtn.classList.remove("active-filter"); //to remove active styling from the completed button when all button is clicked
  pendingBtn.classList.remove("active-filter"); //to remove active styling from the pending button when all button is clicked
  currentFilter = "all";
  displayTasks();
});

completedBtn.addEventListener("click", function () {
  allBtn.classList.remove("active-filter");
  completedBtn.classList.add("active-filter");
  pendingBtn.classList.remove("active-filter");
  currentFilter = "completed";
  displayTasks();
});

pendingBtn.addEventListener("click", function () {
  allBtn.classList.remove("active-filter");
  completedBtn.classList.remove("active-filter");
  pendingBtn.classList.remove("active-filter");

  pendingBtn.classList.add("active-filter");

  currentFilter = "pending";
  displayTasks();
});

displayTasks(); //to show tasks based on the current filter when the page loads
allBtn.classList.add("active-filter"); //to set the "All Tasks" filter as active when the page loads
