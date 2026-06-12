//current filter state
let currentFilter = "all";

//get saved tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];



//select elements
let addBtn = document.getElementById("addBtn");
//filter buttons
let allBtn = document.getElementById("allBtn");
let completedBtn = document.getElementById("completedBtn");
let pendingBtn = document.getElementById("pendingBtn");


function updateTaskCounter() {//task counter feature

  let counter = document.getElementById("taskCounter");// it selects the HTML element with the id "taskCounter" and assigns it to the variable `counter`. This element is likely used to display the total number of tasks in the task list.

  let completed = tasks.filter(function (task) {//it uses the `filter` method to create a new array that contains only the tasks that are marked as completed. The callback function checks if the `completed` property of each task is `true`. The length of this filtered array gives the count of completed tasks.
  return task.completed;//it checks if the task is completed
}).length;//it gets the length of the filtered array to count the number of completed tasks
  

  let total = tasks.length;//it calculates the total number of tasks by getting the length 
  counter.innerHTML =
  "<span>Total: " + total + "</span>" +
  "<span>Completed: " + completed + "</span>" +
  "<span>Pending: " + (total - completed) + "</span>";
//it updates the inner HTML of the `counter` element to display the total number of tasks, the number of completed tasks, and the number of 
  
  
}



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
      //if filter is pending and task is completed, skip
      return;
    }

    //create li
    let li = document.createElement("li");

    //create checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    //create text
    let text = document.createElement("span");
    text.textContent = task.text;

    //create due date text
    let dueDateText = document.createElement("small");
    let formattedDate = new Date(task.dueDate).toLocaleDateString(//to change the format of date style
    "en-GB",
    {
    day: "numeric",
    month: "long",
    year: "numeric"
  }
);
    dueDateText.textContent = "Due: " + formattedDate;
    dueDateText.classList.add("due-date"); //for styling the due date text,to make under the task (block)

    let priorityText = document.createElement("small");
    priorityText.classList.add("priority-text");
    let today = new Date();//it gives the current date to compare with task due date
    let dueDate = new Date(task.dueDate);//it converts the due date string from the task object into a Date object for comparison
    let daysLeft = Math.ceil(
    (dueDate - today) / (1000 * 60 * 60 * 24)
    );//it calculates the number of days left until the task's due date by subtracting the current date from the due date and converting the result from milliseconds to days
    
    if (daysLeft <= 3) {//it checks if the number of days left until the due date is less than or equal to 3. 
     priorityText.textContent = "🔴 High";
    }
    else if (daysLeft <= 7) {
    priorityText.textContent = "  🟡 Medium";
    }
    else {
    priorityText.textContent = "  🟢 Low";
    }
    


    let taskInfo = document.createElement("div");//it creates a new `div` element to group the task text and due date together
    taskInfo.classList.add("task-info"); //for styling the task info container
    taskInfo.appendChild(text);
    taskInfo.appendChild(dueDateText);
    taskInfo.appendChild(priorityText);

    //if completed add strike-through
    if (task.completed) {
      text.style.textDecoration = "line-through";
    }

    //create delete button
    let deletebtn = document.createElement("button");
    deletebtn.textContent = "Delete";
    deletebtn.classList.add("deletebtn"); //for styling

    //append elements
    //li.appendChild(text);
    //li.appendChild(dueDateText);
    li.appendChild(taskInfo);//it appends the `taskInfo` div, which contains both the task text and the due date
    li.appendChild(checkbox);
    li.appendChild(deletebtn);

    //append li into ul
    taskList.appendChild(li); //for displaying tasks

    //checkbox functionality
    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;

      if (checkbox.checked) {
        text.style.textDecoration = "line-through";
      } else {
        text.style.textDecoration = "none";
      }

      //update localStorage
      localStorage.setItem("tasks", JSON.stringify(tasks));
      updateTaskCounter(); //to update the task counter whenever a task is marked as completed or pending
    });

    //delete functionality
    deletebtn.addEventListener("click", function () {
      //remove task from array
      tasks = tasks.filter(function (t) {
        return t.id !== task.id;
      });

      //update localStorage
      localStorage.setItem("tasks", JSON.stringify(tasks));

      //refresh UI
      displayTasks();
      updateTaskCounter(); //to update the task counter whenever a task 
    });
  });
}

//add task button
addBtn.addEventListener("click", function () {
  //get input
  let taskInput = document.getElementById("taskInput");

  let dueDateInput = document.getElementById("dueDateInput");

  //get value
  let taskValue = taskInput.value;

  let dueDateValue = dueDateInput.value;
  

  //prevent empty tasks
  if (taskValue.trim() === "") {
    return;
  }

  //add task object into array
  tasks.push({
    id: Date.now(), //unique id for each task,date.now()gives the current timestamp in milliseconds which can be used as a unique identifier for each task
    text: taskValue,
    completed: false,//it indicates that the task is initially marked as not completed when it is added to the tasks array.
    dueDate: dueDateValue //it stores the due date value entered by the user for the task. 

    
  });
  
  //save to localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  //clear input
  taskInput.value = "";

  //refresh UI
  displayTasks(); //to show the newly added task in the list
  updateTaskCounter();//to update the task counter whenever a new task is added
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
updateTaskCounter();
allBtn.classList.add("active-filter"); //to set the "All Tasks" filter as active when the page loads
